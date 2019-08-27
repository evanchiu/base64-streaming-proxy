import http from "http";
import proxy from "./proxy";

const pjson = require("../package.json");

const port = process.env.PORT || 1337;

const server = http.createServer(proxy);

server.listen(port);
console.log(`${pjson.name} ${pjson.version} listening on port ${port}`);
