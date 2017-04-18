import * as rowcache from "rowcache";
import * as fs from "fs";
import * as Case from "case";

export class ManifestGenerator {
    private indent = 0;
    public stream: fs.WriteStream;
    constructor(protected tables: rowcache.Tables, 
                protected queries: rowcache.Query[],
                protected commands: rowcache.Command[],
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
    resolveType(fqType: string): string {
        let [tableName, columnName] = fqType.split(`\.`);
        if (!this.tables[tableName][columnName]) {
            console.log(`${fqType}:`, this.tables[tableName]);
        }
        return this.lookupColumnType(tableName, columnName);
    }
    lookupColumnType(tableName: string, columnName: string) {
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
    commandName = (command: rowcache.Command) => Case.pascal(command.name);
    commandResponseName = (command: rowcache.Command) => Case.pascal(`${this.commandName(command)}Response`)
    queryMap() {
        let map = new Map<number, string>();
        let i = 1;
        for (let query of this.queries) {
            map.set(i++, this.requestName(query));
            map.set(i++, this.responseName(query));
        }
        return map;
    }
    commandEnum() {
        let map = new Map<number, string>();
        let idx = 1;
        for (let command of this.commands) {
            map.set(idx++, this.commandName(command));
            map.set(idx++, this.commandResponseName(command));
        }
        return map;
    }
    commandResponseMap() {
        let map = new Map<string, string>();
        for (let com of this.commands) {
            map.set(this.commandName(com), this.commandResponseName(com));
        }
    }
    responseMap() {
        let map = new Map<string, string>();
        for (let query of this.queries) {
            map.set(this.requestName(query), this.responseName(query));
        }
        return map; 
    }

}