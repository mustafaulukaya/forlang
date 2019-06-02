const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'SYSTEM-UP', update: req.app.get('BuildTime') });
});

module.exports = router;
