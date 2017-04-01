"use strict";
var tables = {
    "user": {
        "login": { "type": "varchar(256)" },
        "passhash": { "type": "varchar(512)" },
        "email": { "type": "varchar(512" }
    },
    "contact": {
        "user_login": { "type": "varchar(256)" },
        "first": { "type": "varchar(128)" },
        "last": { "type": "varchar(128)" }
    }
};
module.exports = tables;
