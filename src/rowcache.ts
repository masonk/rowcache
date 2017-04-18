export interface ColumnInfo {
    type: string;
}

export interface Table {
    [name: string]: ColumnInfo;
}

export enum WhereRelationship {
    Equals
}

export type Clause = WhereAtom | And | Or;

export enum ClauseType { And, Or } // necessary for "structural typing"
export interface And { left: Clause; right: Clause; type: ClauseType.And }
export interface Or { left: Clause; right: Clause; type: ClauseType.Or }
export function isAtom(clause: Clause): clause is WhereAtom {
    if ((<any>clause).dbvalue) {
        return true;
    }
    return false;
}

export function isAnd(clause: Clause): clause is And {
    if ((<any>clause).type === ClauseType.And) {
        return true;
    }
    return false;
}

export function isOr(clause: Clause): clause is Or {
    if ((<any>clause).type === ClauseType.Or) {
        return true;
    }
    return false;
}

export type WhereAtom = Equals;

export interface Equals {
    dbvalue: string;  // Name of the column in the DB
    type: "Equals";
    parameter: string; // Name of the parameter in the request proto that corresponds to this
}
export interface SelectStatement {
    select: string[],
    from: string[],
    where: Clause;
}
export interface Bind {
    name: string;
    type: string;
}

export interface Query {
    name: string;
    binds: Bind[];
    effect: SelectStatement;
}

export interface Insert {
    name: string;
    table: string;
    columns: string[];
}

export type Command = Insert;

export interface Tables { [name: string]: Table }

export interface ResultSetDiff<T> {
    delete: string[]; // delete rows by pkey
    insert: T[];
    update: T[];
}

export interface ResultSet<T> {
    table: Readonly<Table>;
    tablename: string;
    query: Query;
    rows: T[];
}