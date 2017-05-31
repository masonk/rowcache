import * as rc from "rowcache"


const queries: rc.Query[] = [

    new Query("MySpecialQuery")
        .Select("foo.a", "foo.b", "foo.*", "def.c")
        .From("abc as foo", "def")
        .InnerJoin("foo.id = def.fooid")
        .Where("def.bar in ('a', 'b'")
    {
        name: "MySpecialQuery",
        select: ["foo.a", "foo.b", "foo.c", "d.c"],
        from: ["abc as foo", "  def"],
        join: rc.InnerJoin("foo.id", "def.fooid"),
        where: "foo.bar = 'white rabbit'",
        
    },
    
    {
    "name": "get_user_by_login",
    "binds": [{ "name": "login", "type": "user.login"}],
    "effect": { 
        "select": ["user.login", "user.email"],
        "from": ["user"],
        "where": {
            "parameter": "login",
            type: "Equals",
            "dbvalue": "user.login"
        }
    },
},
{
    "name": "get_login_by_name",
    "binds": [{ "name": "first", "type": "contact.first"}],
    "effect": { 
        "select": ["contact.first", "user.email"],
        "from": ["user", "contact"],
        "where": {
            "parameter": "login",
            type: "Equals",
            "dbvalue": "user.login"
        }
    },
}];

module.exports = queries;