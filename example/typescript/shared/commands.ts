import * as rc from "rowcache"

const commands: rc.Command[] = [{
    "name": "addUser",
    "table": "user",
    "columns": ["login", "passhash", "email"]
}];

module.exports = commands;