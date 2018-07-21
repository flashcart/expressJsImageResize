const fs = require('fs');
const request = require('request');
const path = require('path');
const targetPath = "./target/";
var destDir = null;


var downloadImage = {

    download: function (siteUrl) {
       
        console.log("scrapping siteurl: " + siteUrl);
        destDir = targetPath;
        if (siteUrl.lastIndexOf('banggood') != -1) {
            destDir = destDir.concat("banggood/");
            mkdirSync(path.resolve(destDir));
            var folderName = siteUrl.substr(siteUrl.lastIndexOf('/') + 1);
            destDir = destDir.concat(folderName).concat("/");
            mkdirSync(path.resolve(destDir));
        }
        console.log("Dir: " + destDir);

        var scraperjs = require('scraperjs');
        scraperjs.StaticScraper.create(siteUrl)
            .scrape(function ($) {
                return $(".description img").map(function () {
                    return $(this).attr('src');
                }).get();
            })
            .then(resultHandler);

    }
}

const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}

var resultHandler = function (res) {
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



module.exports = downloadImage;