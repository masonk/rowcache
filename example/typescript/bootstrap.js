#!/usr/bin/env node
let path = require("path");
let child = require("child_process");
const mfpath = path.resolve(__dirname, "shared/querymanifest.ts");

let ret = child.exec(`tsc ${mfpath}`, (err, out, stderr) => {
    if (out) console.log(out);
    if (err) console.warn(err);
    if (stderr) console.warn(stderr);
});

child.exec(`rowcachec -m shared/querymanifest.js --clientdir client/src/generated --serverdir server/src/generated`, (err, out, stderr) => {
    if (out) console.log(out);
    if (err) console.warn(err);
    if (stderr) console.warn(stderr);
});