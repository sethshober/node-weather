// to run use node app.js [zipcode]
// example: node app.js 90210

var functions = require("./scripts.js");
var zipcode = process.argv.slice(2);
functions.getZipCoordinates(zipcode);