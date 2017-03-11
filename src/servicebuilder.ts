import * as norman from "norman";
import * as fs from "fs";

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";


export class ServiceBuilder {
    constructor(private manifest: norman.QueryManifest) {}
    mapType(manifestType: string): TypeScriptType {
        if (/^varchar/.test(manifestType)) {
            return "string";
        }
        
        return "any";
    }
    lookupType(fqType: string): string {
        let [tableName, columnName] = fqType.split(`\.`);
        return this.manifest.tables[tableName][columnName].type;
    }
    emit(dest: string) {
        let stream = fs.createWriteStream(dest, { flags: "w" });
        stream.write(`import * as norman from "norman"\n`);
        stream.write(`import { ResultSet, ResultSetDiff } from "norman"\n`)
        stream.write(`import { Observable } from "rxjs"\n\n`);

        let observeOverloads: string[] = [];
        let observeDiffOverloads: string[] = [];
        let queryOverloads: string[] = [];

        let serviceOverloads = this.manifest.queries.forEach(query => {
            let constructorArgs = query.parameters.map(param => {
                let tsType = this.mapType(this.lookupType(param.type));
                return `private ${param.name}: ${tsType}`
            }).join(", ");
let qname = `${query.name}`;
let req = `export class ${qname} {
    constructor(${constructorArgs}) {}
}
`      
            stream.write(`${req}\n`);

            observeOverloads.push(`observe(req: ${qname}): Observable<ResultSet<${query.name}_response>>;`);
            observeDiffOverloads.push(`observeDiffs(req: ${qname}): Observable<ResultSetDiff<${query.name}_response>>;`);
            queryOverloads.push(`query(req: ${qname}): Promise<ResultSet<${query.name}>>;`)
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