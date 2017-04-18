import { ClassMap, RowcacheService, ResponseMap, ManifestMap, MessageType, RequestType, encodeMessage, decodeMessage  } from "rc/rowcacheservice"
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
    pad(n: string, width: number, z = '0') {
        return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
    }
    printBuffer(buf: ArrayBuffer) {
        let view = new Uint8Array(buf);
        let hex = [...view].map(v => this.pad(v.toString(16), 2));
        return `<Buffer ${hex.join(" ")}>`;
    }
    private receive(msg: MessageEvent) {

        console.log(`${this.printBuffer(msg.data)} (received)`);
        const reader = new protobuf.Reader(msg.data);
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
                            let msg = decodeMessage(type, rcenv.message);
                            console.log(msg);
                            watcher.next(msg);
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

	protected startObserve(type: messages.MessageType, req: MessageType) {
        console.log(encodeMessage(req), "(sent)");
	    let envelope = messages.Envelope.create({
	        type: type,
	        message: encodeMessage(req)
	    });
	    let sid = this.nextSid();

	    this.activeRequests[sid] = new Rx.Subject<any>();
	    this.ws.send(this.encodeFrame(sid, envelope));
        return this.activeRequests[sid].asObservable();
	}

    protected startObserveDiffs(type: messages.MessageType, req: RequestType) {return <any>{}}
    protected startQuery(type: messages.MessageType, req: RequestType) {
        const query = ManifestMap.get(type);
        if (query == null) throw `Unknown querytype '${type}'`

        if (this.db.canSatisfy(query, req)) {
            return Promise.resolve(this.db.query(query, req));
        }
        else {
            let sid = this.nextSid();
            let envelope = messages.Envelope.create({
                type: type,
                message: encodeMessage(req)
            });
            this.activeRequests[sid] = new Rx.ReplaySubject<any>();
            this.ws.send(this.encodeFrame(sid, envelope));
        
            return new Promise((resolve, rej) => {
                let sub = this.activeRequests[sid].asObservable().take(1).subscribe(resolve, rej, () => this.reclaimSid(sid));
                this.subs.add(sub);
            });
        }
     }

     private reclaimSid(sid: number) {
         let active = this.activeRequests[sid];
         if (active) {
             active.complete();
            delete this.activeRequests[sid];
         }
     }
}

