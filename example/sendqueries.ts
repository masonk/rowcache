let messages = require("generated/messages");
import { WebsocketService } from "generated/socketservice";


let sh = new WebsocketService("ws://localhost:8081");
let message1 = messages.GetUserByLogin.create({
    login: "foobie"
});
let m2 = messages.GetLoginByName.create({
    first: "Jack",
});

sh.observe(message1).subscribe((val: any) => console.log(val));
sh.observe(m2).subscribe((val: any) => console.log(val));




