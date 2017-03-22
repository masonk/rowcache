import * as websocket from "ws"; 
import * as protobuf from "protobufjs";
import * as messages from "./generated/messages";
import * as rowcache from "./generated/rowcacheservice";

const wss = new websocket.Server({ port: 8081 });
console.log('listening on 8081');

function makeResponse(streamid: number, type: messages.MessageType, response: rowcache.ResponseType) {
    	let envelope = messages.Envelope.create({
	        type: type,
	        message: rowcache.encodeMessage(response)
	    });

        const wse = messages.WebsocketEnvelope.encodeDelimited({
            streamid: streamid,
            envelope: envelope
        }).finish();

        return wse;
}

wss.on('connection', ws => {
    console.log('accepting a new connection');
    ws.on('message', data => {
        console.log(data);
        try {
            const reader = new protobuf.BufferReader(data);
            let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
            const env = pb.envelope;
            const streamid = pb.streamid;
            console.log({ pb: pb })
            if (!streamid) throw("no streamid");
            if (!env) throw("no envelope");

            if (env.type && env.message) {
                try {
                    let msg: any = rowcache.decodeMessage(env.type, env.message);
                    let responseType = rowcache.ResponseMap.get(env.type);
                    if (!responseType) throw "couldn't find a response type";

                    let responseClass: any = rowcache.ClassMap.get(responseType);
                    let response: any = responseClass.create({
                        userLogin: msg.login,
                        userEmail: "Whatever@yes.com",
                    });
                    ws.send(makeResponse(streamid, responseType, response));
                }
                catch (e) {
                    console.warn("received a malformed rowcache request", e);
                }
            }
            else {
                console.warn("received malformed rowcache envelope");
            }
        }
        catch(e) {
            console.warn("received malformed websocket envelope");
        }
        
    });

    ws.on('close', con => {

    });
});