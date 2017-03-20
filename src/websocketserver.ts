import * as http from "http";
import * as websocket from "websocket";
import * as protobuf from "protobufjs";
import * as messages from "./messages";

const server = http.createServer((req, res) => {});
server.listen('8081', () => {
    console.log((new Date()) + " Server is listening on port 8081");
});  
const wss = new websocket.server({ httpServer: server });

wss.on('request', req => {
    const con = req.accept(undefined, req.origin);
    console.log((new Date()) + " Connection accepted.");
    con.on('message', msg => {
        if (msg.type === 'binary') {

            const data = msg.binaryData; 
            if (data) {
                console.log("Received Binary Message of " + data + " bytes");
                console.log(data);
                const reader = new protobuf.BufferReader(data);
                let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
                console.log("decoded msg to ", pb.toJSON());
            }
            else {
                
            }
        }
    });

    con.on('close', con => {

    });
});