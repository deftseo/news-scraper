var Crawler = require('node-crawler/Crawler');
var fs = require('fs');

/****
var args = process.argv.slice(2);
var issueDate = (args.length) ? args[0] : '2018-09-01';
var issueYear = issueDate.substring(0,4);

var baseDir = "data/economist/";
var issueDir = baseDir + issueYear + "/" + issueDate + "/";
var issueFile = issueDir + "index.json";
var issueDoc = JSON.parse(fs.readFileSync(issueFile, 'utf-8'));

console.log(issueDoc);
****/


var cheerio = require('cheerio');
var articleFiles = [
    "economist-article-2018.html",
    "economist-article.html"
];
var articleFile = articleFiles[1];
var articleHtml = fs.readFileSync(articleFile, 'utf-8');

var $page = cheerio.load(articleHtml);

var $article = $page('div.blog-post__text');
var $articleText = $page('p', $article);

var article = {
    body: []
};

$articleText.each(function() {
    var $para = $page(this);
    var text = $para.text();
    var isHeader = $para.hasClass('xhead');
    var elem = isHeader ? 'heading' : 'paragraph';

    if (text) {
        var para = {
            type: elem,
            text: text
        };

        article.body.push(para);
    }
});

console.log('[ARTICLE]', JSON.stringify(article, null, 4));
