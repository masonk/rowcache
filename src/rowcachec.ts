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
let tpaths: string[] = config.tables && config.tables.paths || [];
let base = config.baseDir || ".";
let _queries: rowcache.Query[][] = qpaths.map(p => require(path.resolve(cwd, base, p)));
let _tables: rowcache.Tables[]  = tpaths.map(p => require(path.resolve(cwd, base, p)));

let queries = _queries.reduce((p, n) => p.concat(n), []);
let tables = _tables.reduce((p, ts) => {
    for (let k of Object.keys(ts)) {
        if (p[k]) {
            process.stderr.write(`a table named ${k} already exists; overwriting`);
        }
        p[k] = ts[k];
    }
    return p;
}, {})

for (let side of ['client', 'server']) {
    let outdir = config[side].outDir || ".";
    if (outdir) {
        let fqoutdir = path.resolve(path.resolve(cwd, base, outdir));
        if (!fs.existsSync(fqoutdir)) {
            mkdirp.sync(fqoutdir);
        }
        
        let tsbuilder = new TypeScriptServiceGenerator(tables, queries, path.resolve(fqoutdir, "rowcacheservice.ts"));
        tsbuilder.emit();
        if (side === 'client') {
            let socketgenerator = new TypeScriptSocketServiceGenerator(tables, queries, path.resolve(fqoutdir, "socketservice.ts"));
            socketgenerator.emit();
        }
        if (side === 'server') {
            let servergenerator = new ServerGenerator(tables, queries, path.resolve(fqoutdir, "socketserver.ts"));
            servergenerator.emit();
        }


        emit_protos(fqoutdir);
    }
}

function emit_protos(fqoutdir: string) {
    let protofile = path.resolve(fqoutdir, "messages.proto");
    let protobuilder = new ProtoGenerator(tables, queries, protofile);
    protobuilder.emit();

    let protojs = path.resolve(fqoutdir, `messages.js`);
    let protots = path.resolve(fqoutdir, `messages.d.ts`);
    let pbjs = path.resolve(__dirname, "../node_modules/.bin/pbjs");
    let pbts = path.resolve(__dirname, "../node_modules/.bin/pbts");
    let ret = child.exec(`${pbjs} -t static-module -w commonjs --out ${protojs} ${protofile}`, (err, out, stderr) => {
        if (out) console.log(out);
        if (err) console.warn(err);
        if (stderr) console.warn(stderr);

        if (!err) {
            child.exec(`${pbts} --out ${protots} ${protojs}`, (err, out, stderr) => {
                if (out) console.log(out)
                if (err) console.warn(err)
                if (stderr) console.warn(stderr);
            });
        }
    });
}
