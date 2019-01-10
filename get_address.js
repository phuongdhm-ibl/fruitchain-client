require("babel-register");
require("babel-polyfill");

const utils = require("./utils/sawtooth-utils");

console.log(utils.calculateStampAddress(process.argv[2]));
