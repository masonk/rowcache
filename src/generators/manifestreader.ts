import * as norman from "norman";
import * as fs from "fs";
import * as Case from "case";

export class ManifestGenerator {
    constructor(protected manifest: norman.QueryManifest, protected outdir: string) {}
    
    lookupType(fqType: string): string {
        let [tableName, columnName] = fqType.split(`\.`);
        return this.manifest.tables[tableName][columnName].type;
    }
    lookupTable(name: string): norman.Table {
        return this.manifest.tables[name];
    }
    iterateTable(table: norman.Table, fn: (name: string, field: norman.ColumnInfo) => void) {
        for (let tname of Object.keys(table)) {
            fn(tname, table[tname]);
        }
    }
}