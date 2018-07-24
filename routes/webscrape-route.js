const downloadService = require('../service/download-images');
var express = require('express');
var router = express.Router();

router.post('/', function (req, res, next) { 
    var data= req.body;
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
    downloadService.images(url);
    downloadService.description(url);
    var resString = 'Url : <a target="_blank" href="' + url + '" >' + url + '</a>';
    var folderName = url.substr(url.lastIndexOf('/') + 1);
    resString += '<br> Next step : <a target="_blank" href="/resize?path=' + folderName + '" >Resize</a>';
    return resString;
}
