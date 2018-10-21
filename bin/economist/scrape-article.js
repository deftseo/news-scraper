var Scraper = require('node-crawler/Scraper');

var args = process.argv.slice(2);
var articleUrl = (args.length) ? args[0] : "https://www.economist.com/node/21749064";

Scraper.Scraper(articleUrl, function($page, pageUrl) {
    var $articleTitle = $page('article h1.flytitle-and-title__body .flytitle-and-title__title');
    var articleTitle = $articleTitle.text().trim();
    var $articleSummary = $page('article h1.flytitle-and-title__body+p.blog-post__rubric');
    var articleSummary = $articleSummary.text().trim();
    var $articlePublish = $page('article div.blog-post__section-date-author time');
    var publishDate = $articlePublish.attr('datetime');
    var $articleSection = $page('article .blog-post__inner h3.blog-post__section');
    var articleSection = $articleSection.text().split('|').pop().trim();

    var $articleSubtitle = $page('article h1.flytitle-and-title__body .flytitle-and-title__flytitle');
    var articleSubtitle = $articleSubtitle.text().trim();

    var $articleImg = $page('div.blog-post__image img');
    var articleImage = $articleImg.attr('src');
    // TODO: Process @srcset

    var $articleText = $page('div.blog-post__text > p');

    var article = {
        link: pageUrl,
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

    console.log(JSON.stringify(article, null, 4));
});


