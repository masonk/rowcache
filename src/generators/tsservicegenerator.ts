import * as norman from "norman";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";
import { ResultSet, ResultSetDiff } from "norman"
import { Observable } from "rxjs"

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

export class TypeScriptServiceGenerator extends ManifestGenerator {
    constructor(manifest: norman.QueryManifest, outdir: string) {
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

        this.write(`import * as norman from "norman"`);
        this.write(`import { ResultSet, ResultSetDiff } from "norman"`);
        this.write(`import { Observable } from "rxjs"`)
        this.write(`import * as messages from "./norman_messages"\n`);

        this.startBlock(`export const EnumClassMap = new Map<messages.MessageType, { new(): any }>([`)
        for (let [idx, name] of this.queryMap()) {
            this.write(`[messages.MessageType.${name}, messages.${name}],`);
        }
        this.endBlock(`])\n`);

        this.startBlock(`export const ClassMap = new Map<number, { new(): any }>([`)
        for (let [idx, name] of qMap) {
            this.write(`[${idx}, messages.${name}],`);
        }
        this.endBlock(`])\n`);

        this.startBlock(`export const ResponseMap = new Map<messages.MessageType, messages.MessageType>([`)
            for (let [req, res] of this.responseMap()) {
                this.write(`[messages.MessageType.${req}, messages.MessageType.${res}],`)
            }
        this.endBlock(`])\n`);

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


        this.startBlock("export abstract class NormanService {");
            [`abstract startObserve(type: messages.MessageType, req: any): Observable<ResultSet<any>>;`,
            `abstract startObserveDiffs(type: messages.MessageTYpe, req: any): Observable<ResultSetDiff<any>>;`,
            `abstract startQuery(req: any): Promise<any>;`].forEach(line => {
                this.write(line);
            });
    /*        let messageType: messages.MessageType;
            if (req instanceof messages.GetUserByLogin) {
                messageType = messages.MessageType.GetUserByLogin;
            }
            let pb = messages.Envelope.create({ type: messageType, message: req.encode().finish()}).encode().finish();
    */
            this.startBlock(`getMessageType(req: any): messages.MessageType {`);
                this.write(`let messageType = messages.MessageType.Unknown`);
                for (let [typeEnum, className] of qMap) {
                    this.startBlock(`if (req instanceof messages.${className}) {`)
                        this.write(`messageType = ${typeEnum};`)
                    this.endBlock(`}`);
                }
                this.write(`return messageType;`);
            this.endBlock(`}\n`);

            for (let ol of observeOverloads) {
                this.write(ol);
            }

            this.startBlock(`observe(req: Uint8Array) {`);
                this.write(`return this.startObserve(req);`)
            this.endBlock(`}`);

            for (let ol of observeDiffOverloads) {
                this.write(ol);
            }
            this.startBlock(`observeDiffs(req: Uint8Array) {`);
                this.write(`return this.startObserveDiffs(req);`)
            this.endBlock(`}`);

            for (let ol of queryOverloads) {
                this.write(ol);
            }
            this.startBlock(`query(req: Uint8Array) {`);
                this.write(`return this.startQuery(req);`)
            this.endBlock(`}`);

        this.endBlock(`}`);
        this.stream.end();
    }
}