var express = require('express');
var db = require('../models/index');
var router = express.Router();

router.get('/', function(req, res, next) {
  if(!req.session.user) res.redirect('/');
  var userId = req.session.user.id;
  db.User
    .findById(userId)
    .then(user=>{
      user
        .getDocuments({
          include:[{
            model: db.User,
            as: "Owner",
            attributes: ["username"]
          }]
        })
        .then(function(docs){
          res.render('app', {docs: docs, user: req.session.user });
        });
    })
    .catch(function(err){
      res.render('app', {docs: [], user: req.session.user});
  });
});

module.exports = router;
