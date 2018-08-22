const videService = require('../service/video-service');
var express = require('express');
var router = express.Router();
const targetDir = "./target";

/* GET users listing. */
router.get('/', function (req, res, next) {
  var pathParam = req.query.path;
  var currentItemDir = targetDir.concat('/all/').concat(pathParam);
  videService.create(currentItemDir.concat("/video"));
  
  res.send('respond with a resource');
});

module.exports = router;
