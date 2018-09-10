var Scraper = require("node-crawler/Scraper");

var args = process.argv.slice(2);
var curDate = (args.length) ? args[0] : '2018-09-01';

var dateStr = curDate.replace(/-/g, "");
var dailyUrl = "https://www.reuters.com/resources/archive/uk/" + dateStr + ".html";

Scraper.Scraper(dailyUrl, function($page, pageUrl) {
    var $header = $page("div.contentBand h1");
    var pageTitle = $header.text().replace("Site Archive for", "").trim();
    var $stories = $page("div.primaryContent div.headlineMed");
    var daily = {
        title: pageTitle,
        stories: []
    };

    //console.log("Title:", pageTitle);

    $stories.each(function() {
        var $story = $page(this);
        var $link = $page("a", $story);
        var title = $link.text().trim();
        var link = $link.attr('href');
        var pubTime = $story.text().replace(title, "").trim();
        var published = curDate + " " + pubTime;
        var storyId, story;

        if (! /\/videoStory/.test(link)) {
            storyId = link.match(/id(\w+)$/)[1];
            //console.log(storyId, title, published, "\n", link);
            story = {
                id: storyId,
                title: title,
                link: link,
                published: published
            };

            daily.stories.push(story);
        }
    });

    console.log(JSON.stringify(daily, null, 4));
});

