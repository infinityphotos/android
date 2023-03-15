import "react-native-url-polyfill/auto";
import TextEncodingPolyfill from "text-encoding";

if (typeof TextEncoder === "undefined")
  global.TextEncoder = TextEncodingPolyfill.TextEncoder;
if (typeof TextDecoder === "undefined")
  global.TextEncoder = TextEncodingPolyfill.TextDecoder;

if (typeof __dirname === "undefined") global.__dirname = "/";
if (typeof __filename === "undefined") global.__filename = "";

if (typeof process === "undefined") {
  global.process = require("process");
} else {
  const bProcess = require("process");
  for (var p in bProcess) {
    if (!(p in process)) process[p] = bProcess[p];
  }
}
process.browser = false;

if (typeof Buffer === "undefined") global.Buffer = require("buffer").Buffer;
if (typeof BigInt === "undefined") global.BigInt = require("big-integer");

if (!global.btoa) {
  const { encode } = require("base-64");
  global.btoa = encode;
}
if (!global.atob) {
  const { decode } = require("base-64");
  global.atob = decode;
}

const isDev = typeof __DEV__ === "boolean" && __DEV__;
process.env["NODE_ENV"] = isDev ? "development" : "production";
if (typeof localStorage !== "undefined") localStorage.debug = isDev ? "*" : "";
