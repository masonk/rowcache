import * as rowcache from "rowcache";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";
import { ResultSet, ResultSetDiff } from "rowcache"
import { Observable } from "rxjs"

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

export class TypeScriptServiceGenerator extends ManifestGenerator {
    constructor(protected tables: rowcache.Tables, 
                protected queries: rowcache.Query[],
                protected commands: rowcache.Command[],
                outdir: string) {
        super(tables, queries, commands, outdir);
    }
    private mapType(manifestType: string): TypeScriptType {
        if (/^varchar/.test(manifestType)) {
            return "string";
        }
        
        return "any";
    }
    private import(what: string[], from: string, as?: string) {
        this.write(`import { ${what.join(", ")} } from "${from}"`)
    }
    private importAll(as: string, from: string) {
        this.write(`import * as ${as} from "${from}"`);
    }
    private typedecl(name: string, types: string[]) {
        this.write(`export type ${name} = ${types.join(" | ")};`)
    }
    private map(name: string, tkey: string, tval: string, pairs: string[][]) {
        this.startBlock(`export const ${name} = new Map<${tkey}, ${tval}>([`);
            this.write(pairs.map(p => `[${p[0]}, ${p[1]}]`).join(",\n"));
        this.endBlock(`]);`)
    }
    emit() {
        let dest = this.outdir;
        this.stream = fs.createWriteStream(dest, { flags: "w" });
        let messageMap = this.messageMap();
        const mmsg = (v: string) => `messages.${v}`;

        this.importAll("rowcache", "rowcache");
        this.importAll("protobuf", "protobufjs");
        this.importAll("messages", "./messages");
        this.import(["Observable"], "rxjs");

        this.typedecl("CommandType", [...this.commandNameToResponseName().keys()].map(mmsg));
        this.typedecl("QueryType",   [...this.queryNameToResponseName().keys()].map(mmsg));
        this.typedecl("QueryResponseType", [...this.queryNameToResponseName().values()].map(mmsg));
        this.typedecl("RequestType", ["CommandType", "QueryType"]);
        this.typedecl("ResponseType", [mmsg("CommandResponse"), "QueryResponseType"]);
        this.typedecl("ManifestType", ["RequestType", "ResponseType"]);
                
        this.map("ClassMap", "messages.ManifestType", "any", 
            [...messageMap.values()].map(v => [`messages.ManifestType.${v}T`, `messages.${v}`]));

        this.map("QueryInfo", "messages.ManifestType", "rowcache.Query", this.queries.map(q => {
            return [`messages.ManifestType.${this.requestName(q)}T`, JSON.stringify(q)]
        }));

        this.map("ResponseTForRequestT", "messages.ManifestType", "messages.ManifestType", 
            [...this.queryNameToResponseName(), ...this.commandNameToResponseName()].map(p => {
                return [`messages.ManifestType.${p[0]}T`, `messages.ManifestType.${p[1]}T`]
            }));

        this.startBlock(`export function isRequest(type: messages.ManifestType) {`);
            this.write(`return ~Boolean(ResponseTForRequestT.get(type));`)
        this.endBlock(`};\n`);

        this.startBlock(`export function getManifestType(req: any): messages.ManifestType {`);
            this.write(`let messageType = messages.ManifestType.Unknown`);
            for (let [typeEnum, className] of messageMap) {
                this.startBlock(`if (req instanceof messages.${className}) {`)
                    this.write(`messageType = ${typeEnum};`)
                this.endBlock(`}`);
            }
            this.write(`return messageType;`);
        this.endBlock(`}\n`);

        this.write(`export function getMessageClass(req: any): any {
    let type = getManifestType(req);
    let klass = ClassMap.get(type);
    return klass as any;
}
`);

        this.write(`export function encodeMessage(req: any): Uint8Array {
    let klass = getMessageClass(req);
    if (klass) {
        return klass.encodeDelimited(req).finish();
    }
    return new Uint8Array(0);
}
`);
        this.write(`export function decodeMessage(type: messages.ManifestType, bytes: Uint8Array | Buffer): ManifestType {
    let klass = ClassMap.get(type);
    return (klass as any).decodeDelimited(protobuf.Reader.create(bytes));
}`);

        let observeOverloads: string[] = [];
        let observeDiffOverloads: string[] = [];
        let queryOverloads: string[] = [];
        let commandOverloads = this.commands.map(c => {
            let name = Case.pascal(`${c.name}`);
            let fqname = `messages.${name}`;
            return `execute(command: ${fqname}): Promise<messages.CommandResponse>;`
        })

        this.queries.forEach(query => {

            let qname = Case.pascal(`${query.name}`);
            let fqname = `messages.${qname}`

            observeOverloads.push(`observe(req: ${fqname}): Observable<${fqname}Response>;`);
            observeDiffOverloads.push(`observeDiffs(req: ${fqname}): Observable<messages.${this.requestName(query)}Diff>;`);
            queryOverloads.push(`query(req: ${fqname}): Promise<${fqname}Response>;`)
        });


        this.startBlock("export abstract class RowcacheService {");
            [`protected abstract startObserve(type: messages.ManifestType, req: QueryType): Observable<any>;`,
            `protected abstract startObserveDiffs(type: messages.ManifestType, req: QueryType): Observable<any>;`,
            `protected abstract startQuery(type: messages.ManifestType, req: QueryType): Promise<any>;`,
            `protected abstract startExecute(type: messages.ManifestType, req: CommandType): Promise<any>;`].forEach(line => {
                this.write(line);
            });
    
            for (let ol of observeOverloads) {
                this.write(ol);
            }

            this.startBlock(`observe(req: QueryType) {`);
                this.write(`return this.startObserve(getManifestType(req), req);`)
            this.endBlock(`}`);

            for (let ol of observeDiffOverloads) {
                this.write(ol);
            }
            this.startBlock(`observeDiffs(req: QueryType) {`);
                this.write(`return this.startObserveDiffs(getManifestType(req), req);`)
            this.endBlock(`}`);

            for (let ol of queryOverloads) {
                this.write(ol);
            }
            this.startBlock(`query(req: QueryType) {`);
                this.write(`return this.startQuery(getManifestType(req), req);`)
            this.endBlock(`}`);

            for (let ol of commandOverloads) {
                this.write(ol);
            }
            this.startBlock(`execute(req: CommandType) {`);
                this.write(`return this.startExecute(getManifestType(req), req);`);
            this.endBlock(`}`)

        this.endBlock(`}`);
        this.stream.end();
    }
}