import * as messages from "./generated/messages";
import { WebsocketService, IWebsocket } from "./generated/socketservice";
import * as WebSocket from "ws";
const url = "ws://localhost:8081";
let ws = new WebSocket(url);

console.log(`Connecting to ${url}`)

ws.on('open', () => {
    console.log(`Opened connection to ${url}`)
    let sh = new WebsocketService(ws);
    let message1 = messages.GetUserByLogin.create({
        login: "foobie"
    });
    let m2 = messages.GetLoginByName.create({
        first: "Jack",
    });

    sh.observe(message1).subscribe((val: any) => console.log(val));
    sh.observe(m2).subscribe((val: any) => console.log(val));

})




