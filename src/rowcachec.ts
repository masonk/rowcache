#!/usr/bin/env node
require('app-module-path').addPath(__dirname);
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import * as path from "path";
import * as rowcache from "./rowcache";

import { TypeScriptServiceGenerator } from "generators/tsservicegenerator";
import { TypeScriptSocketServiceGenerator } from "generators/socketservicegenerator";
import { ServerGenerator } from "generators/handlergenerator"
import { ProtoGenerator } from "generators/protogenerator";
import * as child from "child_process";
import * as yargs from "yargs";
let argv = yargs
    .usage("rowcachec [config]")
    .argv;

let configpath = argv[0] || ".";

if (!configpath) process.exit(1);
const cwd = process.cwd();
let fqconfigpath = path.resolve(cwd, configpath, "rowcacheconfig.js");
let config = require(fqconfigpath);
if (!config) {
    process.stderr.write(`Couldn't find ${configpath}`);
    process.exit();
}
let qpaths: string[] = config.queries && config.queries.paths || [];
let cpaths: string[] = config.commands && config.commands.paths || [];
let tpaths: string[] = config.tables && config.tables.paths || [];

let base = config.baseDir || ".";
let _queries: rowcache.Query[][] = qpaths.map(p => require(path.resolve(cwd, base, p)));
let _tables: rowcache.Tables[]  = tpaths.map(p => require(path.resolve(cwd, base, p)));
let _commands: rowcache.Command[][] = cpaths.map(p => require(path.resolve(cwd, base, p)));
let queries = _queries.reduce((p, n) => p.concat(n), []);
let commands = _commands.reduce((p, n) => p.concat(n), []);
let tables = _tables.reduce((p, ts) => {
    for (let k of Object.keys(ts)) {
        if (p[k]) {
            process.stderr.write(`a table named ${k} already exists; overwriting`);
        }
        p[k] = ts[k];
    }
    return p;
}, {});

for (let side of ['client', 'server']) {

    let outdirs = [config[side].generatedRoot || path.join(config[side].baseUrl, "generated")];
    
    for (let outdir of outdirs) {
        let fqoutdir = path.resolve(path.resolve(cwd, base, outdir));
        if (!fs.existsSync(fqoutdir)) {
            mkdirp.sync(fqoutdir);
        }
        const servicepath = path.resolve(fqoutdir, "rowcacheservice.ts");
        verbalize(servicepath);
        let tsbuilder = new TypeScriptServiceGenerator(tables, queries, commands, servicepath);
        tsbuilder.emit();

        if (side === 'client') {
            const socketservicegenerator = path.resolve(fqoutdir, "socketservice.ts");
            verbalize(socketservicegenerator);
            let socketgenerator = new TypeScriptSocketServiceGenerator(tables, queries, commands, socketservicegenerator);
            socketgenerator.emit();
        }
        if (side === 'server') {
            const socketserverpath = path.resolve(fqoutdir, "socketserver.ts");
            verbalize(socketserverpath);
            let servergenerator = new ServerGenerator(tables, queries, commands, socketserverpath);
            servergenerator.emit();
        }

        let outDeclarations = config[side].outDir; // Where typescript is going to spit out the build project
        if (outDeclarations) {
            let dts = path.resolve(path.resolve(cwd, base, outDeclarations));
            if (!fs.existsSync(dts)) {
                mkdirp.sync(dts);    
            }
            emit_protos([fqoutdir, dts]);
        } else  {
            emit_protos([fqoutdir]);
        }
    }
}

function verbalize(str: string) {
    console.log(str);
}

function emit_protos(outs: string[]) {
    for (const outf of outs) {
        let protofile = path.resolve(outf, "messages.proto");
        let protobuilder = new ProtoGenerator(tables, queries, commands, protofile);
        protobuilder.emit();

        let protojs = path.resolve(outf, `messages.js`);
        let pbjs = path.resolve(__dirname, "../node_modules/.bin/pbjs");
        let pbts = path.resolve(__dirname, "../node_modules/.bin/pbts");
        const cmd =`${pbjs} -t static-module -w commonjs --out ${protojs} ${protofile}`;
        verbalize(protojs);
        let ret = child.exec(cmd, (err, out, stderr) => {
            if (out) console.log(out);
            if (err) console.warn(err);
            if (stderr) console.warn(stderr);

            if (!err) {
                let protots = path.resolve(outf, `messages.d.ts`);
                const tscmd = `${pbts} --out ${protots} ${protojs}`;
                verbalize(protots);
                child.exec(tscmd, (err, out, stderr) => {
                    if (out) console.log(out)
                    if (err) console.warn(err)
                    if (stderr) console.warn(stderr);
                });
            }
        });
    }
}
    