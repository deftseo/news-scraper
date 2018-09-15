var fs = require('fs');

var args = process.argv.slice(2);
var issueDate = (args.length) ? args[0] : '2018-09-01';
var issueYear = issueDate.substring(0,4);

var baseDir = "data/reuters/";
var issueDir = baseDir + issueYear + "/" + issueDate + "/";
var issueFile = issueDir + "index.json";
var dailyDoc = JSON.parse(fs.readFileSync(issueFile, 'utf-8'));

dailyDoc.stories.forEach(function(story) {
    console.log(story.link);
});
