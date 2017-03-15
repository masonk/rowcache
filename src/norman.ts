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

// necessary for "structural typing"
export enum ClauseType { And, Or }
export interface And { left: Clause; right: Clause; type: ClauseType.And }
export interface Or { left: Clause; right: Clause; type: ClauseType.Or }

export interface WhereAtom {
    dbvalue: string;
    relationship: WhereRelationship;
    parameter: string;
}
export interface SelectStatement {
    select: string[],
    from: string[],
    where: Clause;
}
export interface QueryParameter {
    name: string;
    type: string;
}

export interface Query {
    name: string;
    parameters: QueryParameter[];
    effect: SelectStatement;
}
export interface QueryManifest {
    tables: { [name: string]: Table };
    queries: Query[];
}

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