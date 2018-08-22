var express = require('express');
var router = express.Router();
const sharp = require('sharp');
const resizeService = require('../service/resize');
const videService = require('../service/video-service');
const fs = require('fs');
const targetDir = "./target";

/* GET users listing. */
router.get('/', function (req, res, next) {

  //http://sharp.dimens.io/en/stable/api-constructor/
  //https://malcoded.com/posts/nodejs-image-resize-express-sharp

  console.log('video starts');
 var path = req.query.path;
  var currentItemDir = targetDir.concat('/all/').concat(path);
  var videoDir = currentItemDir.concat("/video/");
  mkdirSync(videoDir);
  fs.readdirSync(currentItemDir).forEach(file => {
    if (file.indexOf(".jpg") !== -1 || file.indexOf('.jpeg') != -1 || file.indexOf('.JPG') != -1) {
      // console.log("source: " + currentItemDir.concat(file));
      // console.log("Target: " + currentItemDir.concat("/video/").concat(file));
      resizeService.resize(currentItemDir.concat("/").concat(file), videoDir.concat("/").concat(file));
    }
  });
  
  // videService.create(videoDir);
  
  // resizeService.resize("https://rukminim1.flixcart.com/image/400/400/jepzrm80/smartwatch/5/h/b/m9-black-am31-mobile-link-original-imaf2qgxwhy3m8ev.jpeg?q=90", "./target/target55.jpg");
  var resString = '<br> Next step : <a target="_blank" href="/video?path=' + path+'" >Video</a>' ;
  res.send(resString);
});

const mkdirSync = function (dirPath) {
    try {
        fs.mkdirSync(dirPath)
    } catch (err) {
        if (err.code !== 'EEXIST') throw err
    }
}


module.exports = router;