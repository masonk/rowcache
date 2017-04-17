import * as rowcache from "rowcache"
import * as Rx from "rxjs"
import * as Case from "case"
import * as messages from "rc/messages"
import * as rc from "rc/rowcacheservice"
import { WebsocketService, IWebsocket } from "./socketservice";
import * as WebSocket from "ws";

const url = "ws://localhost:8081";
let ws = new WebSocket(url);

export type Rows = any[];
export interface Notification {
    insert?: Rows;
    update?: Rows;
    delete?: Rows;
}
export class RowCacheDB {
    private tables = new Map<string, { table: rowcache.Table, rows: Rows }>();
    private notifications = new Map<string, Rx.Subject<Notification>>();

    create(name: string, table: rowcache.Table) {
        this.tables.set(name, { table: table, rows: [] });
        this.notifications.set(name, new Rx.Subject<Notification>());
    }
    insert(table: string, rs: any[]) {
        const t =  this.tables.get(table);
        if (t) {
            t.rows.push(rs);
            let note = this.notifications.get(table);
            if (note) {
                note.next({ insert: rs })
            }
        }
    }
    update(table: string, rs: any[]) {
        const t =  this.tables.get(table);
        if (t) {
            t.rows.push(rs);
            let note = this.notifications.get(table);
            if (note) {
                note.next({ insert: rs })
            }
        }
    }
    
    canSatisfy(q: rowcache.Query, req: rc.RequestType) {
        return false;
    }

    query(query: rowcache.Query, req: rc.RequestType): any[] | null {
        let tables = query.effect.from;
        const where = query.effect.where;
        if (where) {
            if (rowcache.isAtom(where)) {
                const [table, column] = where.dbvalue.split(/[.]/);
                const t = this.tables.get(table);

                if (t) {
                    if (where.type === "Equals") {
                        if (this.canSatisfy(query, req)) {
                            const bind = query.binds[0];
                            return t.rows.filter(r => r[column] === (req as any)[Case.camel(bind.name)]);
                        }
                        else {
                            return null;
                        }
                    }
                }
            }
            else if (rowcache.isAnd(where)) {
                
            }
            else {

            }
        }
        return [];
    }
    private atomic_clause_predicate(where: rowcache.WhereAtom) {
        const [ table, column ] = where.dbvalue.split(/[.]/);
    }


    private find_by_column_equality(table: string, column: string, value: any) {
        let t = this.tables.get(table);
        if (!t) throw `No table '${table}' exists`;
        return t.rows.filter(r => r[column] === value);
    }
}