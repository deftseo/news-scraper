var Crawler = require('node-crawler/Crawler');
var fs = require('fs');

var crawler = Crawler.Crawler();

var args = process.argv.slice(2);
var year = (args.length) ? args[0] : false;

// TODO: Get Edition by command line args
var edition = "UK";
var regions = {
    "UK": "76981"
}

var regionUrl = "https://www.economist.com/printedition/covers?print_region=" + regions[edition];
var startUrl = year ? regionUrl + "&date_filter[value][year]=" + year : regionUrl
var baseDir = "data/economist/";

crawler
    .quiet()
    .startUrl(startUrl)
    .follow(function(nextUrl, fromUrl) {
        return nextUrl.startsWith(startUrl);
    })
    .on('page', function(link, $page) {
        $page("div.views-row").each(function() {
            var $issue = $page(this);
            var issueUrl = $page("div.print-cover-image a", $issue).attr("href");
            var issueDate = issueUrl.match(/\d{4}-\d{2}-\d{2}/)[0];
            var issueYear = issueDate.substring(0,4);
            var yearDir = baseDir + issueYear;
            var issueDir = yearDir + "/" + issueDate;

            if (!fs.existsSync(yearDir)) {
                fs.mkdirSync(yearDir);
            }

            if (!fs.existsSync(issueDir)) {
                console.log("New issue found:", issueDate);
                fs.mkdirSync(issueDir);

                // Add further processing here, since it's a new issue.
            }
        });
    })
    .on('end', function() {

    });
