let fqoutdir = path.resolve(__dirname, `messages`);
let protojs = path.resolve(fqoutdir, `messages.js`);
let protots = path.resolve(fqoutdir, `messages.d.ts`);
let pbts = path.resolve(__dirname, "../node_modules/.bin/pbts");
let protofile = path.resolve(fqoutdir, "messages.proto");

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