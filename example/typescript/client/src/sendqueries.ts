let path = require("path");
require('app-module-path').addPath(__dirname);
require('app-module-path').addPath(path.resolve(__dirname, "../generated"));

import * as messages from "rc/messages";
import { WebsocketService, IWebsocket } from "./socketservice";
import * as WebSocket from "ws";

const url = "ws://localhost:8081";
let ws = new WebSocket(url);

console.log(`Connecting to ${url}`)

ws.on('open', () => {
    console.log(`Opened connection to ${url}`)
    let sh = new WebsocketService(ws, { verbose: true });
    let message1 = messages.GetUserByLogin.create({
        login: "foobie"
    });
    let m2 = messages.GetLoginByName.create({
        first: "Jack",
    });

    sh.observe(message1).subscribe((val: any) => console.log(val));
    sh.observe(m2).subscribe((val: any) => console.log(val));
    sh.query(m2).then(v => console.log(`got promise`, v));
    sh.query(message1).then(v => console.log(`got promise`, v));
})




