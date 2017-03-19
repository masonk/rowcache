import * as norman from "norman";
import * as fs from "fs";
import { ManifestGenerator } from "generators/manifestreader";
import * as Case from "case";
import { ResultSet, ResultSetDiff } from "norman"
import { Observable } from "rxjs"

type TypeScriptType = "string" | "number" | "boolean" 
 | "any";

/*


   
*/
export class TypeScriptSocketServiceGenerator extends ManifestGenerator {
    constructor(manifest: norman.QueryManifest, outdir: string) {
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
        let qMap = this.queryMap();


        this.write(`import { NormanService, ResponseMap  } from "./normanservice"
import * as messages from "./messages";
import { client } from "websocket";
import * as Rx from "rxjs";

enum FrameType {
	RC_RESPONSE = 1,
	RC_REQUEST = 2,
}

export class WebsocketService extends NormanService {
	private ws: WebSocket;
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
	makeFrame(sid: number, envelope: protobuf.Writer): Uint8Array {
	    /* Reuse the HTTP/2 frame protocol, rfc 7540 4.1
	    
	        All frames begin with a fixed 9-octet header followed by a variable-
	        length payload.
	
	        +-----------------------------------------------+
	        |                 Length (24)                   |
	        +---------------+---------------+---------------+
	        |   Type (8)    |   Flags (8)   |
	        +-+-------------+---------------+-------------------------------+
	        |R|                 Stream Identifier (31)                      |
	        +=+=============================================================+
	
	    */
	    const len = envelope.len;
	    if (len > Math.pow(2, 24) - 1) {
	        throw new RangeError("Cannot send messages greater than 2^24-1 bytes");
	    }
	    let view  = new DataView(new ArrayBuffer(9));
	    view.setUint32(0, len);
	    for (let i = 0; i < 3; i++) { //* right shift the length int 1 byte 
	        view.setUint8(i, view.getUint8(i+1));
	    }
	    view.setUint8(3, FrameType.RC_REQUEST);
	    view.setUint8(4, 0);
	    view.setUint32(5, sid);
	
	    return <any>view.buffer;
	}
	
	constructor(private socketUrl: string) {
	    super();
	    const ws = new WebSocket(socketUrl);
	    ws.binaryType = "arraybuffer";
	}
	
	startObserve(req: any) {
	    let envelope = messages.Envelope.encode({
	        type: this.getMessageType(req),
	        message: req.encode().finish()
	    });
	    let sid = this.nextSid();

	    this.activeRequests[sid] = new Rx.Subject<any>();
	    this.ws.send(this.makeFrame(sid, envelope));
        return this.activeRequests[sid].asObservable();
	}
}`);
        this.stream.end();
    }
}