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
  var currentItemDir = targetDir.concat('/banggood/').concat(path);
  fs.readdirSync(currentItemDir).forEach(file => {
    if (file.indexOf(".jpg") !== -1) {
      // console.log("source: " + currentItemDir.concat(file));
      // console.log("Target: " + currentItemDir.concat("/video/").concat(file));
      resizeService.resize(currentItemDir.concat("/").concat(file), currentItemDir.concat("/video/").concat(file));
    }
  });
  
  // videService.create(currentItemDir.concat("/video"));
  
  // resizeService.resize("https://rukminim1.flixcart.com/image/400/400/jepzrm80/smartwatch/5/h/b/m9-black-am31-mobile-link-original-imaf2qgxwhy3m8ev.jpeg?q=90", "./target/target55.jpg");
  res.send('Done');
});

module.exports = router;