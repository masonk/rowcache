import * as websocket from "ws"; 
import * as protobuf from "protobufjs";
import * as messages from "./generated/messages";
import * as rowcache from "./generated/rowcacheservice";

const wss = new websocket.Server({ port: 8081 });
console.log('listening on 8081');
wss.on('connection', connection => {
    console.log('accepting a new connection');
    connection.on('message', data => {

        console.log(data);
        const reader = new protobuf.BufferReader(data);
        let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
        let env = pb.envelope;
        console.log({ pb: pb })
        if (env && env.type && env.message) {
            console.log(rowcache.decodeMessage(env.type, env.message));
        }
        else {
            throw "Malformed envelope";
        }
    });

    connection.on('close', con => {

    });
});