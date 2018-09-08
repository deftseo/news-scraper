var fs = require('fs');

var args = process.argv.slice(2);
var issueDate = (args.length) ? args[0] : '2018-09-01';
var issueYear = issueDate.substring(0,4);

var baseDir = "data/economist/";
var issueDir = baseDir + issueYear + "/" + issueDate + "/";
var issueFile = issueDir + "index.json";
var issueDoc = JSON.parse(fs.readFileSync(issueFile, 'utf-8'));

console.log(issueDoc);

