
const sharp = require('sharp');
// const fs = require('fs');

var resizeService = {
    // const readStream = fs.createReadStream(path);
    // return readStream;
    resize: function (path, output) {



        const widthString = "1200";
        const heightString = "1200";

        let transform = sharp(path);
        const format = "jpg";
        if (format) {

            transform = transform.toFormat(format);
            console.log("setting format done");
        }

        let width, height;
        if (widthString) {
            width = parseInt(widthString);
        }
        if (heightString) {
            height = parseInt(heightString);
        }

        if (width || height) {
            console.log("Resize started");
            transform = transform.resize(width, height);
            transform = transform.background({ r: 0, g: 0, b: 0, alpha: 0 });
            transform = transform.embed();

            // transform = transform.crop(sharp.strategy.entropy);
            // console.log("Resize started finished");
        }
        transform.toFile(output).then(info => {
            console.log('Successfull to create ' + output);
        }).catch(err => {
            console.log('Failed to create ' + output);
        });
    }
}

module.exports = resizeService;