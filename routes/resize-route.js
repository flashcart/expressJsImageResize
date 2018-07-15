var express = require('express');
var router = express.Router();
const sharp = require('sharp');
const resizeService = require('../service/resize');

const fs = require('fs');


/* GET users listing. */
router.get('/', function (req, res, next) {
    //http://sharp.dimens.io/en/stable/api-constructor/

    console.log('video starts');

    //RESIZE
    // const widthString = req.query.width;
    // const heightString = req.query.height;
    // const format = req.query.format;
    let path = "step1.jpg";
    // const readStream = fs.createReadStream(path);

    target = "target1.jpg";
    resizeService.resize("step1.jpg", "target1.jpg");
    resizeService.resize("step2.jpg", "target2.jpg");
    resizeService.resize("step3.jpg", "target3.jpg");
    resizeService.resize("step4.jpg", "target4.jpg");
    return;

    // transform.toFile('resized-manju.jpg', function (err) {

    //     console.log('Failed to create');
    //     console.log(err);
    //     // output.jpg is a 300 pixels wide and 200 pixels high image
    //     // containing a scaled and cropped version of input.jpg
    // });

    // return  readStream.pipe(transform);
    // res.type(`image/${format || 'png'}`);
    // resize('step1.jpg', format, width, height).pipe(res);

    //return
    // res.render('resize', { title: 'Resizing..' });
    //res.render('resize', { title: 'Resizing..' });

});

module.exports = router;