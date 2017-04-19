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
export interface IRowcacheCommandHandler {
    handleAddUser: (request: messages.AddUser, envelope: messages.Envelope)
        => Promise<void>;
}
export interface IRowcacheHandler extends IRowcachePromiseHandler, IRowcacheObservableHandler, IRowcacheCommandHandler { }
type CommandOp = messages.OperationType.Update | messages.OperationType.Insert | messages.OperationType.Upsert;
const commandOps = [messages.OperationType.Update, messages.OperationType.Insert, messages.OperationType.Upsert];
function isCommandOp(op: messages.OperationType): op is CommandOp { return commandOps.includes(op); }
type QueryOp = messages.OperationType.Query | messages.OperationType.Observe | messages.OperationType.ObserveDiff;
const queryOps = [messages.OperationType.Query, messages.OperationType.Observe, messages.OperationType.ObserveDiff];
function isQueryOp(op: messages.OperationType): op is QueryOp { return queryOps.includes(op); }

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
    pad(n: string, width: number, z = '0') {
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    printBuffer(buf: ArrayBuffer) {
        let view = new Uint8Array(buf);
        let hex = [...view].map(v => this.pad(v.toString(16), 2));
        return `<Buffer ${hex.join(" ")}>`;
    }
    protected logSend(buf: Uint8Array) {
        console.log(buf, "(sent)");
    }
    protected logReceive(buf: ArrayBuffer) {
        console.log(`${this.printBuffer(buf)} (received)`);
    }
    protected send(ws: websocket, buf: Uint8Array) {
        this.logSend(buf);
        ws.send(buf);
    }
    constructor(private handler: IRowcacheHandler) {
        this.wss = new websocket.Server({ port: 8081 });
        console.log('listening on 8081');

        this.wss.on('connection', ws => {
            console.log('accepting a new connection');
            ws.on('message', data => {
                this.logReceive(data);
                try {
                    const reader = new protobuf.BufferReader(data);
                    let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
                    const env = pb.envelope as messages.Envelope;
                    const streamid = pb.streamid;
                    if (!streamid) throw ("no streamid");
                    if (!env) throw ("no envelope");
                    const err = (reason: string) => this.send(ws, this.makeError(streamid, reason));
                    const response = (rt: messages.ManifestType, msg: any) => this.send(ws, this.makeResponse(streamid, rt, msg));

                    if (env && env.type != null && env.message) {
                        let msg = rowcache.decodeMessage(env.type, env.message);
                        const OT = messages.OperationType;
                        if ([OT.ObserveDiff, OT.Transaction, OT.Batch, OT.Update, OT.Delete, OT.Upsert].includes(env.operation)) {
                            this.makeError(streamid, `${messages.OperationType[env.operation]} (${env.operation}): NYI`)
                        }
                        else if (isQueryOp(env.operation)) {
                            let responseType = rowcache.ResponseTForRequestT.get(env.type);
                            if (!responseType) throw "Unknown response type or unknown request type";
                            let responseClass = rowcache.ClassMap.get(responseType);
                            let rt = responseType;
                            const resp = response.bind(this, rt);

                            if (responseClass) {
                                if (env.type === messages.ManifestType.GetLoginByNameT) {
                                    const m = msg as messages.GetLoginByName;
                                    const r = responseClass as typeof messages.GetUserByLoginResponse;
                                    if (env.operation === messages.OperationType.Observe) {
                                        let obs = handler.handleObserveGetLoginByName(m, env);
                                        let sub = obs.subscribe(v => resp(r.create(v)), err);
                                        this.activeRequests[streamid] = sub;
                                    }
                                    else if (env.operation === messages.OperationType.Query) {
                                        handler.handleQueryGetLoginByName(m, env)
                                            .then(v => resp(r.create(v)))
                                            .catch(err);
                                    }
                                }
                                else if (env.type == messages.ManifestType.GetUserByLoginT) {
                                    const m = msg as messages.GetUserByLogin;
                                    const r = responseClass as typeof messages.GetLoginByNameResponse;
                                    if (env.operation === messages.OperationType.Observe) {
                                        let obs = handler.handleObserveGetUserByLogin(m, env);
                                        let sub = obs.subscribe(v => resp(r.create(v)), err);
                                        this.activeRequests[streamid] = sub;
                                    }
                                    else if (env.operation === messages.OperationType.Query) {
                                        handler.handleQueryGetUserByLogin(m, env)
                                            .then(v => resp(r.create(v)))
                                            .catch(err);
                                    }
                                }
                            }
                        }
                        else if (isCommandOp(env.operation)) {
                            const r = messages.CommandResponse;
                            const resp = response.bind(this, messages.ManifestType.CommandResponseT, r.create({}));

                            if (env.type === messages.ManifestType.AddUserT) {
                                const m = msg as messages.AddUser;
                                handler.handleAddUser(m, env)
                                    .then(resp)
                                    .catch(err);
                            }
                        }
                        else {
                            err("Unhandled Message");
                        }
                    }
                }
                catch (e) {
                    console.warn("Couldn't handle a message", e);
                }
            });

            ws.on('close', con => {});
        });
    }
    makeResponse(streamid: number, type: messages.ManifestType, response: rowcache.ResponseType) {
        let envelope = messages.Envelope.create({ type: type, message: rowcache.encodeMessage(response) });
        return this.wrapWS(streamid, envelope);
    }
    makeError(streamid: number, info: string, code = messages.ResponseCode.Error) {
        let envelope = messages.Envelope.create({ codeinfo: info, code: code });
        console.warn(`[${streamid}: ${code} ${messages.ResponseCode[code]}] ${info}`)
        return this.wrapWS(streamid, envelope);
    }
    private wrapWS(streamid: number, envelope: messages.Envelope) {
        const wse = messages.WebsocketEnvelope.encodeDelimited({ streamid: streamid, envelope: envelope }).finish();
        return wse;
    }
}
