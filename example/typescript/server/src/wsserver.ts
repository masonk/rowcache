let path = require("path");
require('app-module-path').addPath(__dirname);
require('app-module-path').addPath(path.resolve(__dirname, "../generated"));
import { IRowcacheHandler, RowcacheSocketServer} from "./socketserver";
import * as messages from "rc/messages";
import * as Rx from "rxjs/Rx";

class RowcacheHandler implements IRowcacheHandler {

	handleObserveGetUserByLogin(req: messages.GetUserByLogin, envelope: messages.Envelope) {
        console.log("Observer GetUser")
        return Rx.Observable.from([
            messages.GetUserByLoginResponse.create({
                userLogin: "Masonk",
                userEmail: "mason.kramer@gmail.com"}),
            
            messages.GetUserByLoginResponse.create({
                userLogin: "Masonk2",
                userEmail: "2mason.kramer@gmail.com"}),        
        ]);
    }
	    
	handleObserveGetLoginByName(req: messages.GetLoginByName, envelope: messages.Envelope) {
        console.log("Observe GetLogin");
        return Rx.Observable.from([
            messages.GetLoginByNameResponse.create({
                contactFirst: "Masonk",
                userEmail: "mason.kramer@gmail.com"}),
            
            messages.GetLoginByNameResponse.create({
                contactFirst: "Masonk2",
                userEmail: "2mason.kramer@gmail.com"}),        
        ]);
    }

	handleQueryGetUserByLogin(req: messages.GetUserByLogin, envelope: messages.Envelope) {
        return Promise.resolve({
                userLogin: "Get Promise Masonk",
                userEmail: "mason.kramer@gmail.com"})
    }
	    
	handleQueryGetLoginByName(req: messages.GetLoginByName, envelope: messages.Envelope) {
        return Promise.resolve({
                contactFirst: "Get Promise Masonk3",
                userEmail: "mason.kramer@gmail3.com"})
    }

    handleAddUser(req: messages.AddUser, envelope: messages.Envelope) {
        console.log("Handling addUser");
        return Promise.resolve();
    }
}
new RowcacheSocketServer(new RowcacheHandler());