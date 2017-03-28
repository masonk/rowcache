import { IRowcacheHandler, RowcacheSocketServer} from "generated/socketserver";
import * as messages from "generated/messages";
import * as Rx from "rxjs/Rx";

class RowcacheHandler implements IRowcacheHandler {


	handleObserveGetUserByLogin(req: messages.GetUserByLogin, envelope: messages.Envelope) {
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
        return Rx.Observable.from([
            messages.GetLoginByNameResponse.create({
                userLogin: "Masonk",
                userEmail: "mason.kramer@gmail.com"}),
            
            messages.GetLoginByNameResponse.create({
                userLogin: "Masonk2",
                userEmail: "2mason.kramer@gmail.com"}),        
        ]);
    }


	handleQueryGetUserByLogin(req: messages.GetUserByLogin, envelope: messages.Envelope) {
        return Promise.resolve({
                userLogin: "Masonk",
                userEmail: "mason.kramer@gmail.com"})
    }
	    
	handleQueryGetLoginByName(req: messages.GetLoginByName, envelope: messages.Envelope) {
        return Promise.resolve({
                userLogin: "Masonk3",
                userEmail: "mason.kramer@gmail3.com"})
    }
}
new RowcacheSocketServer(new RowcacheHandler());