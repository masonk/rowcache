#!/usr/bin/env node
require('app-module-path').addPath(__dirname);
import * as mkdirp from "mkdirp";
import * as fs from "fs";
import * as path from "path";
import { TypeScriptServiceGenerator } from "generators/tsservicegenerator";
import { TypeScriptSocketServiceGenerator } from "generators/socketservicegenerator";
import { ServerGenerator } from "generators/handlergenerator"
import { ProtoGenerator } from "generators/protogenerator";
import * as child from "child_process";
import * as yargs from "yargs";
let argv = yargs
    .option('clientdir', {
        alias: 'c', 
        describe: 'the directory to which rowcachec will emit client-side generated files'
    })
    .option('manifest', {
        alias: 'm',
        describe: 'the query manifest files for which rowcache will generate services'
    })
    .option('serverdir', {
        alias: 's',
        describe: 'the directory to which rowcachec will emit sever-side generated files'
    })
    .requiresArg(['c', 's', 'm'])
    .usage('Usage: $0 [querymanifest.js] -c clientdir -s serverdir')
    .demandOption('manifest')
    .argv;

let manpath = argv['m'];
if (!manpath) process.exit(1);

let fqmanpath = path.resolve(process.cwd(), manpath);
let manifest = require(fqmanpath).manifest;

for (let side of ['c', 's']) {
    let outdir = argv[side]; 
    if (outdir) {
        let fqoutdir = path.resolve(path.resolve(process.cwd(), outdir));
        if (!fs.existsSync(fqoutdir)) {
            mkdirp.sync(fqoutdir);
        }
        
        let tsbuilder = new TypeScriptServiceGenerator(manifest, path.resolve(fqoutdir, "rowcacheservice.ts"));
        tsbuilder.emit();
        if (side === 'c') {
            let socketgenerator = new TypeScriptSocketServiceGenerator(manifest, path.resolve(fqoutdir, "socketservice.ts"));
            socketgenerator.emit();
        }
        if (side === 's') {
            let servergenerator = new ServerGenerator(manifest, path.resolve(fqoutdir, "socketserver.ts"));
            servergenerator.emit();
        }


        emit_protos(fqoutdir);
    }
}

function emit_protos(fqoutdir: string) {
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
}
