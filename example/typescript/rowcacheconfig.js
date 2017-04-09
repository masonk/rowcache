// Relative paths will be resolved relative to the directory that contains rowcacheconfig.js
// tell rowcacehc where the tables and queries are
// and where you want the code it generates for those tables and queries to go.
module.exports = {
    baseDir: ".",
    tables: {
        paths: [
            "shared/tables.js"
        ]
    },
    queries: {
        paths: [
            "shared/queries.js",
        ]
    },
    client: {
        language: "typescript",
        outDir: "client/build/generated/rc", // Where tsc is going to put the ts files that it finds in generatedRoot when it compiles your project
        generatedRoot: "client/generated/rc", // Where the generated files will go. If you use a packaging system or typescript, you must tell that system to resolve modules here, e.g. by adding a paths entry in tsconfig.json
    },
    server: {
        language: "typescript",
        outDir: "server/build/generated/rc",
        generatedRoot: "server/generated/rc"
    }
}