const fs = require('fs');
var videoshow = require('videoshow');

var videoService = {

    create: function (sourceDir) {
        console.log('video starts: ' + sourceDir);

        var tempArr =sourceDir.split('/');
        var videoFileName = tempArr[tempArr.length -2];
        videoFileName = videoFileName.substr(0, 50);
        console.log('Video filename: ' + videoFileName);
        var targetVideo = sourceDir.concat("/").concat(videoFileName).concat(".mp4");
        var song = "source/song.mp3";
        var subtitle = "source/subtitles.ass";
        
        var images = [];
        fs.readdirSync(sourceDir).forEach(file => {
            console.log(file);
            if (file.indexOf(".jpg") !== -1 || file.indexOf('.jpeg') != -1 || file.indexOf('.JPG') != -1) {
                //  console.log(sourceDir.concat("/").concat(file));
                images.push(sourceDir.concat("/").concat(file));
            }
        })
        console.log(images);
        var videoOptions = {
            fps: 25,
            loop: 5, // seconds
            transition: true,
            transitionDuration: 1, // seconds
            videoBitrate: 1024,
            videoCodec: 'libx264',
            size: '840x?',
            audioBitrate: '128k',
            audioChannels: 2,
            format: 'mp4',
            pixelFormat: 'yuv420p'
        }

        videoshow(images, videoOptions)
            //.subtitles(subtitle)
            .audio(song)
            .save(targetVideo)
            .on('start', function (command) {
                console.log('ffmpeg process started:', command)
            })
            .on('error', function (err, stdout, stderr) {
                console.error('Error:', err)
                console.error('ffmpeg stderr:', stderr)
            })
            .on('end', function (output) {
                console.error('Video created in:', output)
            })

    }
}

module.exports = videoService;