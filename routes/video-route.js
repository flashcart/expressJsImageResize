const videService = require('../service/video-service');
var express = require('express');
var router = express.Router();
const targetDir = "./target";

/* GET users listing. */
router.get('/', function (req, res, next) {
  var path = req.query.path;
  var currentItemDir = targetDir.concat('/banggood/').concat(path);
  videService.create(currentItemDir.concat("/video"), path);
  
  res.send('respond with a resource');
});

module.exports = router;
