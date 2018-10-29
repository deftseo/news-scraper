var DeftCrawler = require("deft-crawler");
var Reuters = require('../../src/sources/Reuters');

var args = process.argv.slice(2);
var articleUrl = (args.length) ? args[0] : "http://UK.reuters.com/article/2011/09/20/uk-britain-eu-idUKTRE78J15I20110920";

DeftCrawler.scrape(articleUrl, function($page, pageUrl) {
    var article = Reuters.getArticle($page, pageUrl);
    console.log(JSON.stringify(article, null, 4));
    console.log(pageUrl);
});

