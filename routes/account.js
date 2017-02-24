var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});


router.post('/login', function(req, res) {
 
  console.log(req.body); 
  res.send(req.body);

});



module.exports = router;
