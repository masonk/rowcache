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
        outDir: "client/src/generated"
    },
    server: {
        language: "typescript",
        outDir: "server/src/generated",        
    }
}