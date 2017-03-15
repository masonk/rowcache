import * as norman from "norman";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

export class TypeScriptServiceBuilder extends ManifestGenerator {
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
        let stream = fs.createWriteStream(dest, { flags: "w" });
        stream.write(`import * as norman from "norman"\n`);
        stream.write(`import { ResultSet, ResultSetDiff } from "norman"\n`)
        stream.write(`import { Observable } from "rxjs"\n`);
        stream.write(`import * as messages from "./norman_messages"\n\n`)

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


        stream.write("export class NormanService {\n");

        for (let ol of observeOverloads) {
            stream.write(`\t${ol}\n`);
        }
        stream.write(`\tobserve(req: any): any { }\n`)

        for (let ol of observeDiffOverloads) {
            stream.write(`\t${ol}\n`);
        }
        stream.write(`\tobserveDiffs(req: any): any { }\n`)

        for (let ol of queryOverloads) {
            stream.write(`\t${ol}\n`);
        }
        stream.write(`\tquery(req: any): any { }\n`)
        stream.write(`}\n`)

        stream.end();
    }
}