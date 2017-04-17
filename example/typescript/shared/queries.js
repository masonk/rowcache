"use strict";
exports.__esModule = true;
var queries = [{
        "name": "get_user_by_login",
        "binds": [{ "name": "login", "type": "user.login" }],
        "effect": {
            "select": ["user.login", "user.email"],
            "from": ["user"],
            "where": {
                "parameter": "login",
                type: "Equals",
                "dbvalue": "user.login"
            }
        }
    },
    {
        "name": "get_login_by_name",
        "binds": [{ "name": "first", "type": "contact.first" }],
        "effect": {
            "select": ["contact.first", "user.email"],
            "from": ["user", "contact"],
            "where": {
                "parameter": "login",
                type: "Equals",
                "dbvalue": "user.login"
            }
        }
    }];
module.exports = queries;
