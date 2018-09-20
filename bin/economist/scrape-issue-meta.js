var Crawler = require('node-crawler/Crawler');
var fs = require('fs');

var crawler = Crawler.Crawler();

var args = process.argv.slice(2);
var issueDate = (args.length) ? args[0] : '2018-09-01';

var startUrl = "https://www.economist.com/printedition/" + issueDate;

var STATIC_CDN = "https://cdn.static-economist.com";
var BASE_DIR = "data/economist/";

crawler
    .quiet()
    .startUrl(startUrl)
    .follow(function(nextUrl, fromUrl) {
        return false;
    })
    .on('page', function(link, $page) {
        var $coverImg = $page('div.print-edition__cover-widget__image img, #cover-image img');
        var coverImages = $coverImg.attr('srcset') || '';
        var imageList = coverImages ? parseSrcsetToList(coverImages) : [$coverImg.attr('src')];

        var $header = $page('h1.print-edition__main-title-header, h1.issue-info-date');
        var coverDate = $page('span.print-edition__main-title-header__date, .issue-date', $header).text().trim();

        var $sections = $page('div.print-edition__content ul li.list__item');
        var sections = [];
        var numStories = 0;

        $sections.each(function() {
            var $section = $page(this);
            var title = $page('div.list__title', $section).text().trim();
            var stories = [];

            $page('a.list__link', $section).each(function() {
                var $story = $page(this);
                var storyUrl = $story.attr('href');
                var title = $page('span.print-edition__link-title,span.print-edition__link-title-sub', $story).text().trim();
                var subtitle = $page('span.print-edition__link-flytitle', $story).text().trim();

                var story = {
                    url: crawler.normaliseUrl(storyUrl, link.href),
                    title: title
                };

                if (subtitle) {
                    story.subtitle = subtitle;
                }

                stories.push(story);
                numStories++;
            });

            var section = {
                title: title,
                stories: stories
            };

            sections.push(section);
        });

        var issue = {
            url: link.href,
            coverDate: coverDate,
            date: issueDate,
            coverImg: imageList,
            sections: sections
        };

        // console.log(JSON.stringify(issue, null, 4));
        outputIssueMeta(issue);
    })
    .on('end', function() {
    });


function parseSrcsetToList(srcset) {
    var items = srcset.split(',').map(function(str){
        var imgset =  str.trim().split(/\s+/);
        return {
            width: parseInt(imgset[1], 10),
            src: normaliseImgUrl(imgset[0])
        };
    });
    return items;
};

function normaliseImgUrl(imgUrl) {
    return STATIC_CDN + imgUrl;
}

function saveIssueMeta(issue) {
    var issueYear = issueDate.substring(0,4);
    var issueDir = BASE_DIR + issueYear + "/" + issueDate;
    var issueFile = issueDir + "/index.json";

    if (!fs.existsSync(issueDir)) {
        console.log("New issue found:", issueDate);
        fs.mkdirSync(issueDir);
    }

    fs.writeFileSync(issueFile, JSON.stringify(issue, null, 4));
}

function outputIssueMeta(issue) {
    console.log(JSON.stringify(issue, null, 4));
}

