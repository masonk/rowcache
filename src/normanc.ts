#!/usr/bin/env node
require('app-module-path').addPath(__dirname);
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import * as path from "path";
import { TypeScriptServiceGenerator } from "generators/tsservicegenerator";
import { TypeScriptSocketServiceGenerator } from "generators/socketservicegenerator";
import { ProtoGenerator } from "generators/protogenerator";
import * as child from "child_process";

let argv = require('yargs')
    .usage('Usage: $0 [querymanifest.js] [outdir]')
    .demandCommand(2)
    .argv;

let manpath = argv['_'][0];
let outdir = argv['_'][1];
let fqmanpath = path.resolve(process.cwd(), manpath);

let manifest = require(fqmanpath).manifest;
let fqoutdir = path.resolve(path.resolve(process.cwd(), outdir));

let tsbuilder = new TypeScriptServiceGenerator(manifest, path.resolve(fqoutdir, "normanservice.ts"));

if (!fs.existsSync(fqoutdir)) {
    mkdirp.sync(fqoutdir);
}
tsbuilder.emit();

let socketgenerator = new TypeScriptSocketServiceGenerator(manifest, path.resolve(fqoutdir, "socketservice.ts"));
socketgenerator.emit();

let protofile = path.resolve(fqoutdir, "messages.proto");
let protobuilder = new ProtoGenerator(manifest, protofile);
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
