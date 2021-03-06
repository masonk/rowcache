#!/usr/bin/env node
let path = require("path");
let child = require("child_process");
const tpath = path.resolve(__dirname, "../shared/tables.ts");
const qpath = path.resolve(__dirname, "../shared/queries.ts");
const cpath = path.resolve(__dirname, "../shared/commands.ts");

let ret = child.exec(`tsc ${tpath} ${qpath} ${cpath}`, (err, out, stderr) => {
    if (out) console.log(out);
    if (err) console.warn(err);
    if (stderr) console.warn(stderr);
    
    child.exec(`rowcachec`, (err, out, stderr) => {
        if (out) console.log(out);
        if (err) console.warn(err);
        if (stderr) console.warn(stderr);
    });
});

