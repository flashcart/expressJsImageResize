const downloadService = require('../service/download-images');
var express = require('express');
var router = express.Router();
 
router.get('/', function (req, res, next) { 

    //https://stackoverflow.com/questions/20089582/how-to-get-a-url-parameter-in-express
    //If you want to get a query parameter ?tagId=5, then use req.query
    //To get a URL parameter's value, use req.params
    console.log("Scrape route...");
    // console.log(req.query);
    console.log(req.query.url);
    let url = req.query.url;
    downloadService.download(url);
    res.send('Url : <a target="_blank" href="' + url+'" >' + url + '</a>');
});

module.exports = router;