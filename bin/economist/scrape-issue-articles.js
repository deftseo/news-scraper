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

var $articleTitle = $page('article h1.flytitle-and-title__body .flytitle-and-title__title');
var articleTitle = $articleTitle.text().trim();
var $articleSummary = $page('article h1.flytitle-and-title__body+p.blog-post__rubric');
var articleSummary = $articleSummary.text().trim();
var $articlePublish = $page('article div.blog-post__section-date-author time');
var publishDate = $articlePublish.attr('datetime');
var $articleSection = $page('article h3.blog-post__section');
var articleSection = $articleSection.text().split('|').pop().trim();

var $articleSubtitle = $page('article h1.flytitle-and-title__body .flytitle-and-title__flytitle');
var articleSubtitle = $articleSubtitle.text().trim();

var $articleImg = $page('div.blog-post__image img');
var articleImage = $articleImg.attr('src');
// TODO: Process @srcset

var $articleText = $page('div.blog-post__text > p');

var article = {
    title: articleTitle,
    subtitle: articleSubtitle,
    summary: articleSummary,
    published: publishDate,
    section: articleSection,
    image: articleImage,
    body: []
};



$articleText.each(function() {
    var $para = $page(this);
    var text = $para.text().trim();
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

