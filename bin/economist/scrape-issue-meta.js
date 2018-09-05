var Crawler = require('node-crawler/Crawler');
var fs = require('fs');

var crawler = Crawler.Crawler();

var startUrl = "https://www.economist.com/printedition/2018-09-01";

var STATIC_CDN = "https://cdn.static-economist.com";

crawler
    .startUrl(startUrl)
    .follow(function(nextUrl, fromUrl) {
        return false;
    })
    .on('page', function(link, $page) {
        var $coverImg = $page('div.print-edition__cover-widget__image img');
        var coverImages = $coverImg.attr('srcset');
        var imageList = parseSrcsetToList(coverImages);

        var $header = $page('h1.print-edition__main-title-header');
        var issueDate = $page('span.print-edition__main-title-header__date', $header).text().split();


        var issue = {
            url: link.href,
            date: issueDate,
            coverImg: imageList
        };

        console.log(issue);
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
