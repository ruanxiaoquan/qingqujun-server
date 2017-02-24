var express = require('express');
var router = express.Router();
var UserService = require("../service/account/UserService");
let security = require("../common/security");

let us = new UserService();



/* GET home page. */

router.get('/', function (req, res) {

  // us.userLogin({ username: "18500516066", password: "123456" }).then(data => {
  //   console.log(data);
  // }).catch(err => {
  //   console.log(err);
  // })

  res.render('index', { title: 'Express' });
});

module.exports = router;
