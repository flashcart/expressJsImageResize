var express = require('express');
var router = express.Router();
const fs = require('fs');
const path = require('path');
const downloadService = require('../service/download-images');
const resizeService = require('../service/resize');
const videoService = require('../service/video-service');

const targetDir = "./target";

router.post('/', function (req, res, next) {
    var data = req.body;
    console.log(data.siteUrl);
    var resString = doAction(data.siteUrl);
    res.send(resString);
});

router.get('/', function (req, res, next) {

    //https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express
    //If you want to get a query parameter ?tagId=5, then use req.query
    //To get a URL parameter's value, use req.params
    console.log("Scrape route...");
    // console.log(req.query);
    console.log(req.query.url);
    let url = req.query.url;
    var resString = doAction(url);
    res.send(resString);
});

module.exports = router;

function doAction(url) {
    var folderName = url.substr(url.lastIndexOf('/') + 1);
    synchDirectory(folderName);
    var prodDir = targetDir.concat("/all/").concat(folderName);
    downloadService.images(url, prodDir);
    // downloadService.description(url, folderName.concat("/video"));
    setTimeout(() => resizeService.resizeAll(prodDir, prodDir.concat('/video')), 8000);
    setTimeout(() => videoService.create(prodDir.concat('/video')), 20000);

    var resString = 'Url : <a target="_blank" href="' + url + '" >' + url + '</a>';
    var folderName = url.substr(url.lastIndexOf('/') + 1);
    resString += '<br> Next step : <a target="_blank" href="/resize?path=' + folderName + '" >Resize</a>';
    resString += '<br> Next step : <a target="_blank" href="/video?path=' + path+'" >Video</a>' ;
     
    return resString;
}


function synchDirectory(folderName) {
    // if (siteUrl.lastIndexOf('banggood') != -1) {
        var destDir = targetDir.concat("/all/");
        mkdirSync(path.resolve(destDir));
        destDir = destDir.concat(folderName);
        mkdirSync(path.resolve(destDir));
        mkdirSync(path.resolve(destDir.concat('/video')));
    // }
}

const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}
