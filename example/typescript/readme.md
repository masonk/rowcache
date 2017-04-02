npm run bootstrap // compile shared/tables.ts and shared/queries.ts, then run rowcachec on them to generate the protos
cd server


"shared" is a micro-project that builds the tables manifest and the queries manifest. (These are shared on both sides of the wire).
    - Both client and server import from 'shared'. Check the respective "paths" field of tsconfig.json
    - For a node project, is recommended that any JS you want shared between front and backend - e.g., validation - goes into this project.

"client" is a small script that establishes a websocket connection to a listening socket server, sends a few rowcache requests, and prints the results.
"server" is a node websocket server that replies to rowcache requests from a mocked database.

Though server and client are both typescript in this example, server and client are necessarily distinct projects. I recommend this separation in all node-based web applications, because node and browser runtimes are different and the typings need to be kept distinct. 




