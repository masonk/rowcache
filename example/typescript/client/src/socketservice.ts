import { ClassMap, RowcacheService, ManifestType, QueryInfo, RequestType, CommandType, encodeMessage, decodeMessage  } from "rc/rowcacheservice"
import * as messages from "rc/messages"
import * as Rx from "rxjs"
import * as Case from "case"
import * as db from "./db"
import * as protobuf from "protobufjs"

enum FrameType {
	RC_RESPONSE = 1,
	RC_REQUEST = 2,
}

/* Pass a connected websocket for the service to use. */
export interface IWebsocket{
    addEventListener(method: 'message', cb?: (event: { data: any; type: string; target: WebSocket }) => void): void;
    addEventListener(method: 'close', cb?: (event: {
        wasClean: boolean; code: number;
        reason: string; target: WebSocket
    }) => void): void;
    addEventListener(method: 'error', cb?: (err: Error) => void): void;
    addEventListener(method: 'open', cb?: (event: { target: WebSocket }) => void): void;
    addEventListener(method: string, listener?: () => void): void;
    binaryType?: string;
    send(data: any): void;
}
export interface IWebsocketServiceConfig {
    verbose?: boolean;
}
export class WebsocketService extends RowcacheService {
    db = new db.RowCacheDB();
    subs = new Rx.Subscription();
	constructor(private ws: IWebsocket, config: IWebsocketServiceConfig) {
	    super();
        if (ws.binaryType) {
            ws.binaryType = 'arraybuffer';
        }

        ws.addEventListener('message', this.receive.bind(this));
	}
	private sid = 1; // In http2 spec, stream identifier 0x0 is reserved, start with 1 
	private activeRequests: { [streamId: number]: Rx.Subject<any> } = {};
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
            active.complete();
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
    private receive(msg: MessageEvent) {
        const reader = new protobuf.Reader(new Uint8Array(msg.data));
        this.logReceive(msg.data);
        let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
        let sid = pb.streamid;
        if (sid !== undefined) {
            let watcher = this.activeRequests[sid];
            
            if (watcher) {
                let rcenv = pb.envelope;
                if (rcenv) {
                    let type = rcenv.type;
                    if (type) {
                        if (rcenv.message) {
                            let dm = decodeMessage(type, rcenv.message);
                            watcher.next(dm);
                        }
                    }
                }
            }
        }
    }
    private encodeFrame(sid: number, envelope: messages.Envelope) {
        return messages.WebsocketEnvelope.encodeDelimited({
            streamid: sid,
            envelope: envelope
        }).finish();
    }

    protected logSend(buf: Uint8Array) {
        console.log(buf, "(sent)");
    }
    protected logReceive(buf: ArrayBuffer) {
        console.log(`${this.printBuffer(buf)} (received)`);
    }
	protected startObserve(type: messages.ManifestType, req: ManifestType) {
        this.logSend(encodeMessage(req));
	    let envelope = messages.Envelope.create({
	        type: type,
	        message: encodeMessage(req),
            operation: messages.OperationType.Observe
	    });
	    let sid = this.nextSid();

	    this.activeRequests[sid] = new Rx.Subject<any>();
	    this.ws.send(this.encodeFrame(sid, envelope));
        return this.activeRequests[sid].asObservable();
	}
    protected startExecute(type: messages.ManifestType, req: CommandType) { return <any>{} }
    protected startObserveDiffs(type: messages.ManifestType, req: RequestType) {return <any>{}}
    protected startQuery(type: messages.ManifestType, req: RequestType) {
        const query = QueryInfo.get(type);
        if (query == null) throw `Unknown querytype '${type}'`

        if (this.db.canSatisfy(query, req)) {
            return Promise.resolve(this.db.query(query, req));
        }
        else {
            let sid = this.nextSid();
            let envelope = messages.Envelope.create({
                type: type,
                message: encodeMessage(req),
                operation: messages.OperationType.Query
            });

            this.logSend(this.encodeFrame(sid, envelope));
            let sub = new Rx.ReplaySubject<any>();
            
            this.activeRequests[sid] = sub;
            let prom = new Promise((resolve, reject) => {
                sub.take(1).subscribe(resolve, reject, () => {
                    console.log(`reclaiming ${sid}`);
                    sub.complete();
                    this.reclaimSid(sid);
                });
            });
            
            this.ws.send(this.encodeFrame(sid, envelope));

            return prom;
        }
     }

}

