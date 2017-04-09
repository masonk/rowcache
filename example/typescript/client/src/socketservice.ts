import * as rowcache from "rc/rowcacheservice"
import * as messages from "rc/messages";
import * as Rx from "rxjs";
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

export interface WebsocketServiceConfig {
    verbose?: boolean;
}
export class WebsocketService extends rowcache.RowcacheService {
	constructor(private ws: IWebsocket, private config: WebsocketServiceConfig = {}) {
	    super();
        if (ws.binaryType) {
            ws.binaryType = 'arraybuffer';
        }

        ws.addEventListener('message', this.receive.bind(this));
	}
	private sid = 0; 
	private activeRequests: { [streamId: number]: Rx.Subject<any> } = {};
	private nextSid(): number {
		if (this.sid + 1 > Math.pow(2, 31) - 1) {
			this.sid = 0;
		}
		this.sid += 2;
		return this.sid;
	}

    private receive(msg: MessageEvent) {
        const data = new Uint8Array(msg.data);
        let envelope: messages.WebsocketEnvelope;
        try {
            envelope = this.decodeEnvelope(data);
        }
        catch(e) {
            this.warn("envelope decode error", e);
            return;
        }

        const env = envelope.envelope;
        const streamid = envelope.streamid;
        const type = env && env.type;
        const bytes = env && env.message;

        if (streamid && type && bytes) {
            try {
                let msg: any = rowcache.decodeMessage(type, bytes);
                this.log(envelope, msg)
                this.handleReceive(streamid, type, msg);
            }
            catch (e) {
                this.warn("Payload decode error", e);
            }
        }
        else {
            this.warn(this.ppEnvelope(envelope));
        }
    }
    private handleReceive(sid: number, type: messages.MessageType, payload: rowcache.MessageType) {
        let subject = this.activeRequests[sid];
        if (subject) {
            subject.next(payload);
        }
    }
    private ppEnvelope(envelope: messages.WebsocketEnvelope): string {
        const sid = envelope.streamid;
        const env = envelope.envelope;
        const typeNum = env && env.type;
        const version = env && env.version;
        let type = messages.MessageType[messages.MessageType.Unknown];
        let isRequest = false;
        if (typeNum) {
            type = rowcache.ClassNameMap.get(typeNum) || 'Unknown';
           
            if (rowcache.isRequest(typeNum)) {
                isRequest = true;
            }
        }
        if (!(sid && env && typeNum)) {
            return `[Malformed stream '${sid}' type '${type}' v'${version}']`;
        }
        else {
            return `[${sid}:${type}${version && `v${version}`} (${isRequest ? `Req` : `Resp` })]`
        }
    }
    private log(envelope: messages.WebsocketEnvelope, payload: rowcache.MessageType) {
        if (this.config.verbose) {
            console.log(this.ppEnvelope(envelope), payload.toJSON());
        }
    }
    private warn(msg: string, ...rest: any[]) {
        console.warn(msg, rest);
    }
    private decodeEnvelope(data: Uint8Array) {
        const reader = protobuf.Reader.create(data);
        let pb = messages.WebsocketEnvelope.decodeDelimited(reader);
        return pb;
    }

    protected send(sid: number, type: messages.MessageType, payload: rowcache.MessageType) {
        let buf = this.encodeFrame(sid, type, payload);
        this.ws.send(buf);
    }
    private encodeFrame(sid: number, type: messages.MessageType, payload: rowcache.MessageType) {
        let envelope = messages.Envelope.create({
	        type: type,
	        message: rowcache.encodeMessage(payload)
	    });
        let wse = messages.WebsocketEnvelope.create({
            streamid: sid,
            envelope: envelope
        });
        this.log(wse, payload);
        return messages.WebsocketEnvelope.encodeDelimited(wse).finish();
    }

	protected startObserve(type: messages.MessageType, req: rowcache.MessageType) {
	    let sid = this.nextSid();
	    this.activeRequests[sid] = new Rx.Subject<any>();

        this.send(sid, type, req)
        return this.activeRequests[sid].asObservable();
	}

    protected startObserveDiffs(type: messages.MessageType, req: rowcache.MessageType) {return <any>{}}
    protected startQuery(type: messages.MessageType, req: rowcache.MessageType) { return <any>{} }
}

