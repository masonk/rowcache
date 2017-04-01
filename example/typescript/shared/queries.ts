import * as rc from "rowcache"

const queries: rc.Query[] = [{
    "name": "get_user_by_login",
    "parameters": [{ "name": "login", "type": "user.login"}],
    "effect": { 
        "select": ["user.login", "user.email"],
        "from": ["user"],
        "where": {
            "parameter": "login",
            "relationship": rc.WhereRelationship.Equals,
            "dbvalue": "user.login"
        }
    },
},
{
    "name": "get_login_by_name",
    "parameters": [{ "name": "first", "type": "contact.first"}],
    "effect": { 
        "select": ["user.first", "user.email"],
        "from": ["user"],
        "where": {
            "parameter": "login",
            "relationship": rc.WhereRelationship.Equals,
            "dbvalue": "user.login"
        }
    },
}];

module.exports = queries;