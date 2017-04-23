# Rowcache
###### An Optimizing Service Layer

## What you do.

1. Define your service API as a json data structure representing virtual SQL tables (the _table manifest_) and a json data structure representing a list of queries on those tables (the _query manifest_). 
2. Run the rowcachec compiler to generate code.
3. Implement the handler interfaces that Rowcache generated for the server.

## What it does now

1. Emits a TypeScript websocket service client. 
2. Emits a node+TypeScript websocket server. (More server languages could be supported in the future.)
3. Emits Protobuffv3 to describe each request and response, then uses [protobufjs](https://github.com/dcodeIO/ProtoBuf.js/) to generate JS serializers and deseserializers. Describe your data once and get it on both sides of the wire.
4. Generates TypeScript type declarations for request and response protobuffs: Send SQL queries and consume SQL results _type safely_.
5. Exposes a Reactive API and a Promise API.
6. Emits server-side handler interfaces.
7. Rowcache can share facts from a client-side cache to optimize away requests.

## What it will do in the future

1. Insert, Upsert, Update, and Delete API.
2. Manual fact sharing: teach rowcache how two queries are related by defining a mapping function, and rowcache will share facts between them.
3. Transactions and batches.
4. Automatic fact sharing: rowcache could use SQL semantics to automatically infer cases where one query is derivable from another.
5. Diff-based API.
6. Optimstic updating of suscribers when sending writes.
7. For those services that are actually backed by an ACID SQL database, a library to translate request protos into SQL prepared statements.
8. A utility to read a database schema and generate the table manifest automatically.
9. Write your table manifest and query manifest as literal SQL statements, instead of in a pseudo-sql JSON structure.
10. Generate validation code that enforces constraints in your table manifest on both sides of the wire (even if your backend isn't TypeScript).

## Key value propositions

1. Latency efficient. The best queries are ones you never have to send. Joins allow you to ask for all the data you need in one shot, and the cache prevents duplicate queries from going over the wire.
2. Bandwidth efficient. It's so easy to add another SQL query that you'll never have to ask for data you don't need just to re-use an existing endpoint, nor will you be tempted to inefficiently reuse an existing endpoint in order to get your client-side cache to share results.
3. DRY: Only describe your data one time, and use it efficiently and type-safely on both sides of the wire.
4. Separation of concerns. You won't be tempted to organize your data service layer as one giant blob of global state, a la Reflux, in order to dedupe / fact share. Each widget knows how to query for the data it wants and how those requests get serviced is an orthogonal concern that is resolved behind the rowcache service API.
5. No impedance mismatch. If your data is relational, then querying it relationally is the most efficient way: pass along your database's true power directly to the client.
6. Observable or Promise interface to your data.

## Run the Example
Rowcache alpha exists now only as a small example that, nevertheless, shows a complete project layout and request-response roundtripping for inserts, query observation, and single-shot queries.

```
cd $REPO
npm install
npm link
cd (example/typescript)[example/typescript]
npm install
npm link rowcache
npm run bootstrap
cd server
ts-node (src/wsserver.ts)[example/typescript/server/wsserver.ts] &
cd ../client
ts-node src/sendqueries.ts
```

Also take a gander at the (manifests)[example/typescript/shared], a (headless client)[example/typescript/client/sendqueries.ts] and the (server)[example/typescript/server/wsserver.ts].

Note that socketserver.ts and socketservice.ts are handwritten now, but are destined to be code-generated in the future.
