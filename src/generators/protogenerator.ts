import * as rowcache from "rowcache";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";

type ProtobuffType = "double" | "float" | "int32" | "int64" | "uint32" | "uint64" 
| "bool" | "string" | "bytes";

export class ProtoGenerator extends ManifestGenerator {
    constructor(protected tables: rowcache.Tables, 
                protected queries: rowcache.Query[], 
                protected commands: rowcache.Command[],
                outdir: string) {
        super(tables, queries, commands, outdir);
    }

    private mapType(manifestType: string): ProtobuffType {
        if (/^varchar/.test(manifestType)) {
            return "string";
        }
        
        return "bool";
    }

    private writeEnum(name: string, items: string[]) {
        this.startBlock(`enum ${name} {`);
        for (let [idx, name] of items.entries()) {
            this.write(`${name} = ${idx};`)
        }
        this.endBlock(`}\n`);    
    }

    private writeMessage(name: string, items: [string, string][]) {
        this.startBlock(`message ${name} {`);
            for (let [idx, [type, name]] of items.entries()) {
                this.write(`${type} ${name} = ${idx};`);
            }
        this.endBlock(`}\n`);
    }
    emit() {
        let dest = this.outdir;
        let stream = fs.createWriteStream(dest, { flags: "w" });
        this.stream = stream;
        this.write(`/* These messages were generated by rowcachec. */`)
        this.write(`syntax = "proto3";\n`);

        this.writeEnum("ManifestType", ["Unknown"].concat([...this.messageMap().values(), "CommandResponse"]
            .map(v => `${v}T`))); /* ugly hack due to protobuf namespacing limitations: enum member symbols aren't separately namespaced from siblings of the enum */
        this.writeEnum("OperationType", [`Query`, `Observe`, `ObserveDiff`, `Unsubscribe`, `UpgradeQuery`, `Insert`, `Add`, `Upsert`, `Delete`, `Batch`, `Transaction`]);
        this.writeEnum("ResponseCode", ["OK", "NotAuthorized", "Error"]);

        /* envelope */               

        this.writeMessage('Envelope', [
            [`ManifestType`, `type`],
            [`string`, `version`],
            [`bytes`, `message`],
            [`OperationType`, `operation`]
        ]);
        
        this.writeMessage(`WebsocketEnvelope`, [
            [`uint32`, `streamid`],
            [`Envelope`, `envelope`]
        ]);

        this.writeMessage(`CommandResponse`, [
            [`ResponseCode`, `code`],
            [`string`, `info`]
        ]);


        this.queries.forEach(query => {
            this.writeMessage(this.requestName(query), 
                query.binds.map(p => [Case.camel(this.mapType(this.resolveType(p.type))), Case.camel(p.name)] as [string, string])
            )
            this.writeMessage(this.responseName(query), 
                query.effect.select.map(p => [Case.camel(this.mapType(this.resolveType(p))), Case.camel(p)] as [string, string])
            )
            this.writeMessage(`${this.requestName(query)}Diff`, [
                    [`repeated ${this.responseName(query)}`, `added`],
                    [`repeated ${this.responseName(query)}`, `updated`],
                    [`repeated uint64`, `removed`]
            ]);
        });

        this.commands.forEach(command => {
            this.writeMessage(`${this.commandName(command)}Binds`, 
                command.columns.map(col => [Case.camel(this.mapType(this.lookupColumnType(command.table, col))), Case.camel(col)] as [string, string]));
       
            this.writeMessage(this.commandName(command), [
                [`repeated ${this.commandName(command)}Binds`, `binds`]
            ])
        });

        stream.end();
    }
}