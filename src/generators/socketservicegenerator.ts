import * as rowcache from "rowcache";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";
import { ResultSet, ResultSetDiff } from "rowcache"
import { Observable } from "rxjs"

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

/*


   
*/
export class TypeScriptSocketServiceGenerator extends ManifestGenerator {
    constructor(protected tables: rowcache.Tables, 
                protected queries: rowcache.Query[], 
                outdir: string) {
        super(tables, queries, outdir);
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
        let qMap = this.queryMap();


        this.write(`import { RowcacheService, ResponseMap, MessageType, encodeMessage  } from "./rowcacheservice"
import * as messages from "./messages";
import * as Rx from "rxjs";

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

    private receive(msg: MessageEvent) {

    }
    private encodeFrame(sid: number, envelope: messages.Envelope) {
        return messages.WebsocketEnvelope.encodeDelimited({
            streamid: sid,
            envelope: envelope
        }).finish();
    }

    private decodeFrame(data: Uint8Array) {
        return messages.WebsocketEnvelope.decodeDelimited(data);
    }

	protected startObserve(type: messages.MessageType, req: MessageType) {
        console.log(encodeMessage(req));
	    let envelope = messages.Envelope.create({
	        type: type,
	        message: encodeMessage(req)
	    });
	    let sid = this.nextSid();

	    this.activeRequests[sid] = new Rx.Subject<any>();
	    this.ws.send(this.encodeFrame(sid, envelope));
        return this.activeRequests[sid].asObservable();
	}

    protected startObserveDiffs(type: messages.MessageType, req: MessageType) {return <any>{}}
    protected startQuery(type: messages.MessageType, req: MessageType) { return <any>{} }
}
`);
        this.stream.end();
    }
}


	// makeFrame(sid: number, envelope: protobuf.Writer): Uint8Array {
	//     /* Reuse the HTTP/2 frame protocol, rfc 7540 4.1
	    
	//         All frames begin with a fixed 9-octet header followed by a variable-
	//         length payload. All numbers are big endian.
	
	//         +-----------------------------------------------+
	//         |                 Length (24)                   |
	//         +---------------+---------------+---------------+
	//         |   Type (8)    |   Flags (8)   |
	//         +-+-------------+---------------+-------------------------------+
	//         |R|                 Stream Identifier (31)                      |
	//         +=+=============================================================+
	
	//     */
	//     const len = envelope.len;
	//     if (len > Math.pow(2, 24) - 1) {
	//         throw new RangeError("Cannot send messages greater than 2^24-1 bytes");
	//     }
	//     let view  = new DataView(new ArrayBuffer(9));
	//     view.setUint32(0, len);
	//     for (let i = 0; i < 3; i++) { //* right shift the length int 1 byte 
	//         view.setUint8(i, view.getUint8(i+1));
	//     }
	//     view.setUint8(3, FrameType.RC_REQUEST);
	//     view.setUint8(4, 0);
	//     view.setUint32(5, sid);
	
	//     return <any>view.buffer;
	// }

    // decodeFrame(data: ArrayBuffer) {
    //     let view = new DataView(data);
    //     let lengthBuf = new DataView(new ArrayBuffer(4));
    //     lengthBuf.setUint8(0, 0);
    //     for (let i = 0; i < 3; i++) {
    //         lengthBuf.setUint8(i+1, view.getUint8(i));
    //     }
    //     let length = lengthBuf.getUint32(0);
    //     let sid = view.getUint32(5);
    //     let envelope = messages.Envelope.decode(new Uint8Array(view.buffer.slice(9)));
    // }
