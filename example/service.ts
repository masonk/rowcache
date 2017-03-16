
export class SockjsService extends NormanService {
    private sock: sockjs;
    public closed = false;
    public opened = false;
    public subscriptions = new rx.Subscription();
    private pendingStarts: rx.Subject<any>[] = [];
    private streamCounter = 1;
    constructor(readonly url: string) {
        super();
        this.sock = new sockjs(url);
        this.sock.onopen = () => { this.startPending(); };
        this.sock.onclose = () => { this.completeAll() };
        
    }
    startObserving(req: any) {
        let streamId = this.streamCounter++;
        if (this.sock.OPEN) {
            this.sock.send(streamId, req.serialize());
        }
        else if (this.sock.CONNECTING) {
            let pend = new rx.Subject<any>();
            this.pendingStarts.push(() => { this });
            return pend.asObservable();
        }

    }
    startObservingDiffs(req: any) {

    }
    startQuery(req: any) {

    }
    startPending() {

    }
    completeAll() {
        this.subscriptions.unsubscribe();
    }
}
