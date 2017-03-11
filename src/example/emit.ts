import * as path from "path";
import { ServiceBuilder } from "servicebuilder";
import manifest from "./querymanifest";

let builder = new ServiceBuilder(manifest);
builder.emit(path.resolve(__dirname, "norman_services.ts"));