const fs = require('fs');
const request = require('request');
const path = require('path');
const scraperjs = require('scraperjs');
const targetPath = "./target/";
var destDir = null;
var currentSiteUrl = null;
 
var download = {
    images: function (siteUrl) {
        downloadImages(siteUrl);
    },
    description: function (siteUrl) {
        downloadDescription(siteUrl);
    }
}

module.exports = download;

var downloadDescription = function (siteUrl) {

    console.log("scrapping description from: " + siteUrl);
    destDir = targetPath;
    currentSiteUrl = siteUrl;
    synchDirectory(siteUrl);

    scraperjs.StaticScraper.create(siteUrl)
        .scrape(function ($) {
            return $("div#productDetails").map(function () {
                return $(this).html();
            }).get();
        })
        .then(descriptionResultHandler);

}

var descriptionResultHandler = function (res) {
    console.log("destDir");
    console.log(destDir);
    // console.log(res);
    var resString = String(res);
    resString=  decodeURIComponent(escape(resString));

    resString = resString.replace(/&#xA0;/gm, ' ');
    resString = resString.replace(/&#x2466;/gm, ' ');
    resString = resString.replace(/(\t)/gm, ""); // remove tab
    
    var filePath = destDir.concat('description.txt');
    var writeStream = fs.createWriteStream(filePath);
    writeStream.write(currentSiteUrl);
    writeStream.write(resString);
    writeStream.end();

    // FORMATTED
    resString = resString.replace(/<(?:.|\n)*?>/gm, '\n');

    resString = resString.replace(/(\r\n|\r|\n){2,}/g, '\n'); // remove newline if more than 1
    // resString = resString.replace(/(\r\n\t|\n|\r\t)/gm, "");
    
    var filePath = destDir.concat('formated-description.txt');
    var writeStream = fs.createWriteStream(filePath);
    writeStream.write("BUY " + currentSiteUrl + "\n\r") ;
    writeStream.write(resString);
    writeStream.write("BUY " + currentSiteUrl + "\n\r") ;
    
    writeStream.end();

    // fs.readFile(filePath, 'utf8', function(err, data) {
    //     console.log(data);
    // });
}
 

var downloadImages = function (siteUrl) {

    console.log("scrapping images");
    destDir = targetPath;
    synchDirectory(siteUrl);

    scraperjs.StaticScraper.create(siteUrl)
        .scrape(function ($) {
            return $(".description img").map(function () {
                return $(this).attr('src');
            }).get();
        })
        .then(imageResultHandler);
}

var imageResultHandler = function (res) {
    console.log("destDir");
    console.log(destDir);
    for (var i = 0; i <= res.length - 1; i++) {
        console.log("Downloading image: " + res[i]);
        var imageUrl = res[i];
        if (isBlank(imageUrl)) {
            continue;
        }
        var fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var filePath = destDir.concat(fileName);
        download(imageUrl, filePath, function () {
            console.log('Dowloaded File: ' + filePath);
        });
    }

}

function synchDirectory(siteUrl) {
    if (siteUrl.lastIndexOf('banggood') != -1) {
        destDir = destDir.concat("banggood/");
        mkdirSync(path.resolve(destDir));
        var folderName = siteUrl.substr(siteUrl.lastIndexOf('/') + 1);
        destDir = destDir.concat(folderName).concat("/");
        mkdirSync(path.resolve(destDir));
    }
}

function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

var download = function (uri, filename, callback) {

    request.head(uri, function (err, res, body) {
        // console.log('content-type:', res.headers['content-type']);
        // console.log('content-length:', res.headers['content-length']);
        request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
};

const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}


