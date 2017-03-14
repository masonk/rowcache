import { QueryManifest, WhereRelationship } from "norman";

export const manifest: QueryManifest = {
    "tables": {
        "user": {
            "login": { "type": "varchar(256)" },
             "passhash": { "type": "varchar(512)" },
             "email" : { "type": "varchar(512" }
        },
        "contact": {
            "user_login": { "type": "varchar(256)" },
            "first": { "type": "varchar(128)" },
            "last": { "type": "varchar(128)" }
        }
    },
    "queries": [{
        "name": "get_user_by_login",
        "parameters": [{ "name": "login", "type": "user.login"}],
        "effect": { 
            "select": ["user.login", "user.email"],
            "from": ["user"],
            "where": {
                "parameter": "login",
                "relationship": WhereRelationship.Equals,
                "dbvalue": "user.login"
            }
        },
    },
    {
        "name": "get_login_by_name",
        "parameters": [{ "name": "first", "type": "contact.first"}],
        "effect": { 
            "select": ["user.login", "user.email"],
            "from": ["user"],
            "where": {
                "parameter": "login",
                "relationship": WhereRelationship.Equals,
                "dbvalue": "user.login"
            }
        },
    }]
}
