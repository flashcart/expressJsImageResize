var express = require('express');
var router = express.Router();
var videoshow = require('videoshow')

/* GET users listing. */
router.get('/', function (req, res, next) {

  var targetVideo = "target/targetVideo1.mp4";
  var song = "source/song.mp3";
  var subtitle = "source/subtitles.ass";
  console.log('video starts');
  
  var images = [
    './target/target1.jpg',
    './target/target2.jpg',
    './target/target3.jpg',
    './target/target4.jpg'
  ]

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
    .subtitles(subtitle)
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

  res.send('respond with a resource');
});

module.exports = router;
