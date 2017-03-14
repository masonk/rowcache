import * as norman from "norman"
import { ResultSet, ResultSetDiff } from "norman"
import { Observable } from "rxjs"

export class get_user_by_login {
    constructor(private login: string) {}
}

export class get_login_by_name {
    constructor(private first: string) {}
}

export class NormanService {
	observe(req: get_user_by_login): Observable<ResultSet<get_user_by_loginResponse>>;
	observe(req: get_login_by_name): Observable<ResultSet<get_login_by_nameResponse>>;
	observe(req: any): any { }
	observeDiffs(req: get_user_by_login): Observable<ResultSetDiff<get_user_by_loginResponse>>;
	observeDiffs(req: get_login_by_name): Observable<ResultSetDiff<get_login_by_nameResponse>>;
	observeDiffs(req: any): any { }
	query(req: get_user_by_login): Promise<ResultSet<get_user_by_login>>;
	query(req: get_login_by_name): Promise<ResultSet<get_login_by_name>>;
	query(req: any): any { }
}
