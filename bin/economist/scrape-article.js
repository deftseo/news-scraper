var DeftCrawler = require('deft-crawler');
var Economist = require('../../src/sources/Economist');

var args = process.argv.slice(2);
var articleUrl = (args.length) ? args[0] : "https://www.economist.com/node/21749064";

DeftCrawler.scrape(articleUrl, function($page, pageUrl) {
    var article = Economist.getArticle($page, pageUrl);
    console.log(JSON.stringify(article, null, 4));
});


