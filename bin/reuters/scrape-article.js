var Scraper = require("node-crawler/Scraper");
var url = require("url");

var args = process.argv.slice(2);
var articleUrl = (args.length) ? args[0] : "http://UK.reuters.com/article/2011/09/20/uk-britain-eu-idUKTRE78J15I20110920";
// var articleUrl = "https://uk.reuters.com/article/uk-usa-russia-butina/u-s-judge-orders-accused-russian-agent-butina-kept-in-jail-idUKKCN1LQ1XF";

Scraper.Scraper(articleUrl, function($page, pageUrl) {
    console.log(pageUrl);
    var $header = $page("div.ArticleHeader_content-container");
    var title = $page("h1.ArticleHeader_headline", $header).text().trim();
    var pubDate = $page("div.ArticleHeader_date", $header).text().split('/');
    var published = pubDate[0].trim() + " " + pubDate[1].trim();
    var channel = $page("div.ArticleHeader_channel a", $header).text().trim();
    var $byline = $page("div.BylineBar_byline a", $header);
    var author = $byline.text().trim();
    var authorLink = $byline.attr('href');

    // console.log(title);
    // console.log(channel, "/", published);
    // console.log(author, authorLink);

    var $articleText = $page("div.StandardArticleBody_body").children('p, h3');
    var $images = $page("div.StandardArticleBody_body div.Image_container");

    var article = {
        title: title,
        published: published,
        link: pageUrl,
        section: channel,
        body : [],
        media: []
    };

    $articleText.each(function() {
        var $para = $page(this);
        var text = $para.text().trim();
        var elem = this.name;
        var isHeader = (elem === 'h3');
        var elemType = isHeader ? "heading" : "paragraph";

        if (text) {
            var para = {
                type: elemType,
                text: text
            };

            article.body.push(para);
        }
    });

    $images.each(function() {
        var $figure = $page(this);
        var $image = $page("figure img", $figure).first();
        var imgSrc = $image.attr('src');
        var $caption = $page("figcaption", $figure);
        var caption = $caption.text();

        var image = {
            type: "image",
            src: url.resolve(pageUrl, imgSrc),
            caption: caption
        };

        article.media.push(image);
    });

    console.log(JSON.stringify(article, null, 4));
});

