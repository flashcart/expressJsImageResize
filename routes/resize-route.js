var express = require('express');
var router = express.Router();
const sharp = require('sharp');
const resizeService = require('../service/resize');

const fs = require('fs');


/* GET users listing. */
router.get('/', function (req, res, next) {
    
    //http://sharp.dimens.io/en/stable/api-constructor/
    //https://malcoded.com/posts/nodejs-image-resize-express-sharp

    console.log('video starts');

    //RESIZE
    // const widthString = req.query.width;
    // const heightString = req.query.height;
    // const format = req.query.format;
     // const readStream = fs.createReadStream(path);

   
    // resizeService.resize("./source/step1.jpg", "./target/target1.jpg");
    // resizeService.resize("./source/step2.jpg", "./target/target2.jpg");
    // resizeService.resize("./source/step3.jpg", "./target/target3.jpg");
    // resizeService.resize("./source/step4.jpg", "./target/target4.jpg");
    resizeService.resize("https://rukminim1.flixcart.com/image/400/400/jepzrm80/smartwatch/5/h/b/m9-black-am31-mobile-link-original-imaf2qgxwhy3m8ev.jpeg?q=90", "./target/target55.jpg");
    return;
});

module.exports = router;