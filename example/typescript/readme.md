"shared" is a micro-project that builds the query manifest. (The manifest is shared on both sides of the wire.)
    - Both client and server can import from 'shared'. Check the respective "paths" field of tsconfig.json
    - It is recommended that any JS you want shared between front and backend - e.g., validation - goes into this project
"client" is a small script that establishes a websocket connection to a listening socket server, sends a few rowcache requests, and prints the results.
"server" is a node websocket server that replies to rowcache requests from a mocked database.

Though server and client are both typescript in this example, server and client are necessarily distinct projects. I recommend this separation in all node-based web applications, because node and browser runtimes are different and the typings need to be kept distinct. 



