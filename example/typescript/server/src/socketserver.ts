import * as websocket from "ws"
import * as rowcache from "rc/rowcacheservice"
import { ResultSet, ResultSetDiff } from "rowcache"
import * as Rx from "rxjs"
import * as protobuf from "protobufjs"
import * as messages from "rc/messages"

export interface IRowcacheObservableHandler {
    handleObserveGetUserByLogin: (request: messages.GetUserByLogin, envelope: messages.Envelope)
        => Rx.Observable<messages.GetUserByLoginResponse$Properties>;
    handleObserveGetLoginByName: (request: messages.GetLoginByName, envelope: messages.Envelope)
        => Rx.Observable<messages.GetLoginByNameResponse$Properties>;
}
export interface IRowcachePromiseHandler {
    handleQueryGetUserByLogin: (request: messages.GetUserByLogin, envelope: messages.Envelope)
        => Promise<messages.GetUserByLoginResponse$Properties>;
    handleQueryGetLoginByName: (request: messages.GetLoginByName, envelope: messages.Envelope)
        => Promise<messages.GetLoginByNameResponse$Properties>;
}
export interface IRowcacheHandler extends IRowcachePromiseHandler, IRowcacheObservableHandler { }

export class RowcacheSocketServer {
    private wss: websocket.Server;
    private sid = 1; // In http2 spec, stream identifier 0x0 is reserved, start with 1 
    private activeRequests: { [streamId: number]: Rx.Subscription } = {};
    private nextSid(): number {
        if (this.sid + 1 > Math.pow(2, 31) - 1) {
            this.sid = 1;
        }
        else {
            this.sid += 1;
        }
        return this.sid;
    }

    private reclaimSid(sid: number) {
        let active = this.activeRequests[sid];
        if (active) {
            active.unsubscribe();
            delete this.activeRequests[sid];
        }
    }
    constructor(private handler: IRowcacheHandler) {
        this.wss = new websocket.Server({ port: 8081 });
        console.log('listening on 8081');

        this.wss.on('connection', ws => {
            console.log('accepting a new connection');
            ws.on('message', data => {
                console.log(data, '(received)');
                try {
                    const reader = new protobuf.BufferReader(data);
                    let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
                    const env = pb.envelope as messages.Envelope;
                    const streamid = pb.streamid;
                    console.log({ pb: pb })
                    if (!streamid) throw ("no streamid");
                    if (!env) throw ("no envelope");

                    if (env && env.type != null && env.message) {
                        try {
                            let msg = rowcache.decodeMessage(env.type, env.message);
                            let responseType = rowcache.ResponseMap.get(env.type);
                            if (responseType) {
                                let responseClass = rowcache.ClassMap.get(responseType);
                                let rt = responseType;

                                if (responseClass) {
                                    if (env.type === messages.ManifestType.GetLoginByNameT) {
                                        const m = msg as messages.GetLoginByName;
                                        const r = responseClass as typeof messages.GetUserByLoginResponse;
                                        if (env.operation === messages.OperationType.Observe) {
                                            let obs = handler.handleObserveGetLoginByName(m, env);
                                            let sub = obs.subscribe(v => {
                                                ws.send(this.makeResponse(streamid, rt, r.create(v)));
                                            });
                                            this.activeRequests[streamid] = sub;
                                        }
                                        else if (env.operation === messages.OperationType.Query) {
                                            let prom = handler.handleQueryGetLoginByName(m, env);
                                            prom.then(v => {
                                                ws.send(this.makeResponse(streamid, rt, r.create(v)));
                                            })
                                        }
                                    }
                                    else if (env.type == messages.ManifestType.GetUserByLoginT) {
                                        const m = msg as messages.GetUserByLogin;
                                        const r = responseClass as typeof messages.GetLoginByNameResponse;
                                        if (env.operation === messages.OperationType.Observe) {
                                            let obs = handler.handleObserveGetUserByLogin(m, env);
                                            let sub = obs.subscribe(v => {
                                                ws.send(this.makeResponse(streamid, rt, r.create(v)));
                                            });
                                            this.activeRequests[streamid] = sub;
                                        }
                                        else if (env.operation === messages.OperationType.Query) {
                                            let prom = handler.handleQueryGetUserByLogin(m, env);
                                            prom.then(v => {
                                                ws.send(this.makeResponse(streamid, rt, r.create(v)));
                                            })
                                        }
                                    }
                                }
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
    makeResponse(streamid: number, type: messages.ManifestType, response: rowcache.ResponseType) {
        let envelope = messages.Envelope.create({
            type: type,
            message: rowcache.encodeMessage(response)
        });

        const wse = messages.WebsocketEnvelope.encodeDelimited({
            streamid: streamid,
            envelope: envelope
        }).finish();
        console.log(streamid, wse, '(sent)');

        return wse;
    }
}
