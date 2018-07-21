const fs = require('fs');
const request = require('request');
const path = require('path');
const scraperjs = require('scraperjs');
const targetPath = "./target/";
var destDir = null;

var download = {
    images: function (siteUrl) {
       downloadImages(siteUrl);
    },
    description: function(siteUrl){
        downloadDescription(siteUrl);
    }
}

module.exports = download;

var downloadDescription = function (siteUrl) {
       
    console.log("scrapping description from: " + siteUrl);
    destDir = targetPath;
    synchDirectory(siteUrl);
       
    scraperjs.StaticScraper.create(siteUrl)
        .scrape(function ($) {
            return $("div#specification").map(function () {
                return $(this).val()
            }).get();
        })
        .then(descriptionResultHandler);

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

var descriptionResultHandler = function (res) {
    console.log("destDir");
    console.log(destDir);
    console.log(res);

    // for (var i = 0; i <= res.length - 1; i++) {
    //     console.log("Downloading image: " + res[i]);
    //     var imageUrl = res[i];
    //     if(isBlank(imageUrl)){
    //         continue;
    //     }
    //     var fileName = imageUrl.substr(imageUrl.lastIndexOf('/') + 1);
    //     var filePath = destDir.concat(fileName);
    //     download(imageUrl, filePath, function () {
    //         console.log('Dowloaded File: ' + filePath);
    //     });
    // }

}
var imageResultHandler = function (res) {
    console.log("destDir");
    console.log(destDir);
    for (var i = 0; i <= res.length - 1; i++) {
        console.log("Downloading image: " + res[i]);
        var imageUrl = res[i];
        if(isBlank(imageUrl)){
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


