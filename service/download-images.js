const fs = require('fs');
const request = require('request');
const path = require('path');
const scraperjs = require('scraperjs');
// const targetPath = "./target/";
var destDir = null;
var currentSiteUrl = null;
 
var download = {
    images: function (siteUrl, tarDir) {
        downloadImages(siteUrl, tarDir);
    },
    description: function (siteUrl) {
        downloadDescription(siteUrl);
    }
}

module.exports = download;

// var downloadDescription = function (siteUrl) {

//     console.log("scrapping description from: " + siteUrl);
//     destDir = targetPath;
//     currentSiteUrl = siteUrl;
//     synchDirectory(siteUrl);

//     scraperjs.StaticScraper.create(siteUrl)
//         .scrape(function ($) {
//             return $("div#productDetails").map(function () {
//                 return $(this).html();
//             }).get();
//         })
//         .then(descriptionResultHandler);

// }


var downloadImages = function (siteUrl, tarDir) {

    console.log("scrapping images");
    destDir = tarDir;
    currentSiteUrl = siteUrl;

    scraperjs.StaticScraper.create(siteUrl)
        .scrape(function ($) {

            var title = $("h1 span").map(function () {
                return $(this).html();
            }).get();

            var images = $(".description img").map(function () {
                return $(this).attr('data-src');
            }).get();

            if(images.length == 0){

            images = $(".description img").map(function () {
                    return $(this).attr('src');
                }).get();
            }

            var description = $("div#productDetails").map(function () {
                return $(this).html();
            }).get();
            
            return { title: title, images: images, description: description };

        })
        .then(resultHandler);
}

var resultHandler = function (res) {
    imageResultHandler(res.images);
    descriptionResultHandler(res.description, res.title);
}

var imageResultHandler = function (res) {
    console.log("destDir");
    console.log(destDir);
    for (var i = 0; i <= res.length - 1; i++) {
        console.log("Downloading image: " + res[i]);
        var imageUrl = res[i];
        if(imageUrl.includes('png')){
            continue;
        }

        if (isBlank(imageUrl)) {
            continue;
        }
        var fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
        var filePath = destDir.concat('/').concat(fileName);
        download(imageUrl, filePath, function () {
            console.log('Dowloaded File: ' + filePath);
        });
    }

}


var descriptionResultHandler = function (res, title) {
    var destDescDir = destDir.concat("/video");
    console.log("destDescDir: " + destDescDir);
    // console.log(res);
    var resString = String(res);
    resString=  decodeURIComponent(escape(resString));

    resString = resString.replace(/&#xA0;/gm, ' ');
    resString = resString.replace(/&#x2466;/gm, ' ');
    resString = resString.replace(/&#x2022;/gm, ' ');
    resString = resString.replace(/&#x25CF;/gm, ' ');
    resString = resString.replace(/&#x2019;/gm, '\'');
    resString = resString.replace(/    /gm, '');
                
    resString = resString.replace(/(\t)/gm, ""); // remove tab
    
    var filePath = destDescDir.concat('/description.txt');
    var writeStream = fs.createWriteStream(filePath);
    writeStream.write(currentSiteUrl);
    writeStream.write(resString);
    writeStream.end();

    // FORMATTED
    resString = resString.replace(/<(?:.|\n)*?>/gm, '\n');

    resString = resString.replace(/(\r\n|\r|\n){2,}/g, '\n'); // remove newline if more than 1
    // resString = resString.replace(/(\r\n\t|\n|\r\t)/gm, "");
    
    var filePath = destDescDir.concat('/formated-description.txt');
    var writeStream = fs.createWriteStream(filePath);
    writeStream.write("BUY " + currentSiteUrl + "\n\r") ;
    writeStream.write(title + "\n") ;
    
    writeStream.write(resString);
    writeStream.write("BUY " + currentSiteUrl + "\n\r") ;
    writeStream.end();
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


