import * as rowcache from "rowcache";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";
import { ResultSet, ResultSetDiff } from "rowcache"
import { Observable } from "rxjs"

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

export class TypeScriptServiceGenerator extends ManifestGenerator {
    constructor(manifest: rowcache.QueryManifest, outdir: string) {
        super(manifest, outdir);
    }
    private mapType(manifestType: string): TypeScriptType {
        if (/^varchar/.test(manifestType)) {
            return "string";
        }
        
        return "any";
    }

    emit() {
        let dest = this.outdir;
        this.stream = fs.createWriteStream(dest, { flags: "w" });
        let qMap = this.queryMap();

        this.write(`import * as rowcache from "rowcache"`);
        this.write(`import { ResultSet, ResultSetDiff } from "rowcache"`);
        this.write(`import { Observable } from "rxjs"`)
        this.write(`import * as protobuf from "protobufjs"`)
        this.write(`import * as messages from "./messages"\n`);

        let requestTypes = this.responseMap().keys();
        let responseTypes = this.responseMap().values();
        let requestClassString = [...requestTypes].map(t => `messages.${t}`).join("  | ");
        let responseClassString = [...responseTypes].map(t => `messages.${t}`).join("  | ");

        this.write(`export type RequestType = ${requestClassString};`);
        this.write(`export type ResponseType = ${responseClassString};`);
        this.write(`export type MessageType = RequestType | ResponseType;\n`);
        
        this.startBlock(`export const EnumClassMap = new Map<messages.MessageType, { new(): MessageType }>([`)
        for (let [idx, name] of this.queryMap()) {
            this.write(`[messages.MessageType.${name}T, messages.${name}],`);
        }
        this.endBlock(`]);\n`);

        this.startBlock(`export const ClassMap = new Map<number, { new(): MessageType }>([`)
        for (let [idx, name] of qMap) {
            this.write(`[${idx}, messages.${name}],`);
        }
        this.endBlock(`]);\n`);

        this.startBlock(`export const ClassNameMap = new Map<number, string>([`)
        for (let [idx, name] of qMap) {
            this.write(`[${idx}, '${name}'],`);
        }
        this.endBlock(`]);\n`);

        this.startBlock(`export const ResponseMap = new Map<messages.MessageType, messages.MessageType>([`)
            for (let [req, res] of this.responseMap()) {
                this.write(`[messages.MessageType.${req}T, messages.MessageType.${res}T],`)
            }
        this.endBlock(`]);\n`);

        this.startBlock(`export function isRequest(type: messages.MessageType) {`);
            this.write(`return Boolean(ResponseMap.get(type));`)
        this.endBlock(`};\n`);

        this.startBlock(`export function getMessageType(req: any): messages.MessageType {`);
            this.write(`let messageType = messages.MessageType.Unknown`);
            for (let [typeEnum, className] of qMap) {
                this.startBlock(`if (req instanceof messages.${className}) {`)
                    this.write(`messageType = ${typeEnum};`)
                this.endBlock(`}`);
            }
            this.write(`return messageType;`);
        this.endBlock(`}\n`);

        this.write(`export function getMessageClass(req: any): any {
    let type = getMessageType(req);
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
        this.write(`export function decodeMessage(type: messages.MessageType, bytes: Uint8Array | Buffer): MessageType {
    let klass = ClassMap.get(type);
    return (klass as any).decodeDelimited(protobuf.Reader.create(bytes));
}`);

        let observeOverloads: string[] = [];
        let observeDiffOverloads: string[] = [];
        let queryOverloads: string[] = [];

        let serviceOverloads = this.manifest.queries.forEach(query => {

            let qname = Case.pascal(`${query.name}`);
            let fqname = `messages.${qname}`

            observeOverloads.push(`observe(req: ${fqname}): Observable<ResultSet<${fqname}Response>>;`);
            observeDiffOverloads.push(`observeDiffs(req: ${fqname}): Observable<ResultSetDiff<${fqname}Response>>;`);
            queryOverloads.push(`query(req: ${fqname}): Promise<ResultSet<${fqname}Response>>;`)
        });


        this.startBlock("export abstract class RowcacheService {");
            [`protected abstract startObserve(type: messages.MessageType, req: MessageType): Observable<ResultSet<any>>;`,
            `protected abstract startObserveDiffs(type: messages.MessageType, req: MessageType): Observable<ResultSetDiff<any>>;`,
            `protected abstract startQuery(type: messages.MessageType, req: MessageType): Promise<any>;`].forEach(line => {
                this.write(line);
            });
    /*        let messageType: messages.MessageType;
            if (req instanceof messages.GetUserByLogin) {
                messageType = messages.MessageType.GetUserByLogin;
            }
            let pb = messages.Envelope.create({ type: messageType, message: req.encode().finish()}).encode().finish();
    */

            for (let ol of observeOverloads) {
                this.write(ol);
            }

            this.startBlock(`observe(req: RequestType) {`);
                this.write(`return this.startObserve(getMessageType(req), req);`)
            this.endBlock(`}`);

            for (let ol of observeDiffOverloads) {
                this.write(ol);
            }
            this.startBlock(`observeDiffs(req: RequestType) {`);
                this.write(`return this.startObserveDiffs(getMessageType(req), req);`)
            this.endBlock(`}`);

            for (let ol of queryOverloads) {
                this.write(ol);
            }
            this.startBlock(`query(req: RequestType) {`);
                this.write(`return this.startQuery(getMessageType(req), req);`)
            this.endBlock(`}`);

        this.endBlock(`}`);
        this.stream.end();
    }
}