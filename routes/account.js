var express = require('express');
var router = express.Router();
var UserService = require("../service/account/UserService");

let us = new UserService();


/* GET users listing. */
router.get('/', function (req, res) {
  res.send('respond with a resource');
});


router.post('/login', function (req, res) {
  us.userLogin({ username: req.body.phone, password: req.body.password }).then(data => {
    res.send(data);
  }).catch(err => {
    res.send(err);
  });
});

router.get("/list", (req, res) => {
  us.getAllUser().then(data => {
    res.send(data);
  }).catch(err => {
    res.send(err);
  });
});


module.exports = router;
