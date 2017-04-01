import * as rowcache from "rowcache";
import * as fs from "fs";
import * as Case from "case";

export class ManifestGenerator {
    private indent = 0;
    public stream: fs.WriteStream;
    constructor(protected tables: rowcache.Tables, 
                protected queries: rowcache.Query[], 
                protected outdir: string) {}
                
    write(msg: string) {
        this.stream.write(this.idt(msg) + `\n`);
    }
    idt(msg: string) {
        let tabs = Array(this.indent).fill(`\t`).join("");
        return msg.replace(/^/gm, tabs);
    }
    startBlock(msg: string) {
        this.write(msg);
        this.indent += 1;
    }
    endBlock(msg: string) {
        this.indent -= 1;
        this.write(msg);
    }
    lookupType(fqType: string): string {
        let [tableName, columnName] = fqType.split(`\.`);
        if (!this.tables[tableName][columnName]) {
            console.log(`${columnName}:`, this.tables[tableName]);
        }
        return this.tables[tableName][columnName].type;
    }
    lookupTable(name: string): rowcache.Table {
        return this.tables[name];
    }
    iterateTable(table: rowcache.Table, fn: (name: string, field: rowcache.ColumnInfo) => void) {
        for (let tname of Object.keys(table)) {
            fn(tname, table[tname]);
        }
    }
    requestName = (query: rowcache.Query) => Case.pascal(query.name);
    responseName = (query: rowcache.Query) => Case.pascal(`${this.requestName(query)}Response`);
    queryMap() {
        let map = new Map<number, string>();
        let i = 1;
        for (let query of this.queries) {
            map.set(i++, this.requestName(query));
            map.set(i++, this.responseName(query));
        }
        return map;
    }
    responseMap() {
        let map = new Map<string, string>();
        let i = 1;
        for (let query of this.queries) {
            map.set(this.requestName(query), this.responseName(query));
        }
        return map; 
    }

}