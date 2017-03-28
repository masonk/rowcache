import * as rowcache from "rowcache";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";
import { ResultSet, ResultSetDiff } from "rowcache"
import { Observable } from "rxjs"

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

export class ServerGenerator extends ManifestGenerator {
    constructor(manifest: rowcache.QueryManifest, outdir: string) {
        super(manifest, outdir);
    }
    private mapType(manifestType: string): TypeScriptType {
        if (/^varchar/.test(manifestType)) {
            return "string";
        }
        
        return "any";
    }

    emit() {
        let dest = this.outdir;
        this.stream = fs.createWriteStream(dest, { flags: "w" });


        this.write(`import * as websocket from "ws"`);
        this.write(`import * as rowcache from "./rowcacheservice"`);
        this.write(`import { ResultSet, ResultSetDiff } from "rowcache"`);
        this.write(`import { Observable } from "rxjs"`)
        this.write(`import * as protobuf from "protobufjs"`)
        this.write(`import * as messages from "./messages"\n`);
        
        this.startBlock(`export interface IRowcacheHandler {`);
            for (let [req, res] of this.responseMap()) {
                let re = Case.pascal(req);
                let rs = Case.pascal(res);
                for (let method of [`Observe`, `Query`]) {
                    let monad = method === 'Observe' ? `Observable` : `Promise`;
                    this.write(`handle${method}${re}?: (reqest: messages.${re}, envelope: messages.Envelope)
=> ${monad}<messages.${rs}$Properties>;`);
                }
                
            }
        this.endBlock(`}`);

        this.write(`
export class RowcacheSocketServer {
    private wss: websocket.Server;
    constructor(private handler: IRowcacheHandler) {
        this.wss = new websocket.Server({ port: 8081 });
        console.log('listening on 8081');

        this.wss.on('connection', ws => {
            console.log('accepting a new connection');
            ws.on('message', data => {
                console.log(data);
                try {
                    const reader = new protobuf.BufferReader(data);
                    let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
                    const env = pb.envelope;
                    const streamid = pb.streamid;
                    console.log({ pb: pb })
                    if (!streamid) throw ("no streamid");
                    if (!env) throw ("no envelope");

                    if (env.type && env.message) {
                        try {
                            let msg: any = rowcache.decodeMessage(env.type, env.message);
                            let responseType = rowcache.ResponseMap.get(env.type);
                            if (responseType) {
                                let responseClass: any = rowcache.ClassMap.get(responseType);
                                let rt = responseType;
                                [\`cat\`, \`bear\`, \`pig\`].forEach((val, idx) => {
                                    let response: any = responseClass.create({
                                        userLogin: msg.login,
                                        userEmail: \`\${val}\${idx}@place.com\`,
                                    });
                                    ws.send(this.makeResponse(streamid, rt, response));
                                })
                            }
                        }
                        catch (e) {
                            console.warn("received a malformed rowcache request", e);
                        }
                    }
                    else {
                        console.warn("received malformed rowcache envelope");
                    }
                }
                catch (e) {
                    console.warn("received malformed websocket envelope");
                }

            });

            ws.on('close', con => {

            });
        });
    }
    makeResponse(streamid: number, type: messages.MessageType, response: rowcache.ResponseType) {
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
}`);
    }
}
