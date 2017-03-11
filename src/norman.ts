export interface ColumnInfo {
    type: string;
}

export interface Table {
    [name: string]: ColumnInfo;
}

export enum WhereRelationship {
    Equals
}

type Clause = WhereAtom | And | Or;

// necessary for "structural typing"
export enum ClauseType { And, Or }
export interface And { left: Clause; right: Clause; type: ClauseType.And }
export interface Or { left: Clause; right: Clause; type: ClauseType.Or }

interface WhereAtom {
    dbvalue: string;
    relationship: WhereRelationship;
    parameter: string;
}
interface SelectStatement {
    select: string[],
    from: string[],
    where: Clause;
}
interface QueryParameter {
    name: string;
    type: string;
}

interface Query {
    name: string;
    parameters: QueryParameter[];
    effect: SelectStatement;
}
export interface QueryManifest {
    tables: { [name: string]: Table };
    queries: Query[];
}