import * as websocket from "ws"; 
import * as protobuf from "protobufjs";
import * as messages from "./generated/messages";

const wss = new websocket.Server({ port: 8081 });
wss.on('connection', connection => {
    connection.on('message', msg => {
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