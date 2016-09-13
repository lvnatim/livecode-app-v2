var express = require('express');
var db = require('../models/index');
var router = express.Router();
var moment = require('moment')

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
          res.render('app', {docs: docs, user: req.session.user, moment: moment});
        });
    })
    .catch(function(err){
      res.render('app', {docs: [], user: req.session.user});
  });
});

router.post('/rename', function(req, res, next){
  var title = req.body
  var docId = title.docId || req.session.activeDocId
  db.Document
  .findById(docId)
  .then(function(doc){
    if (doc.OwnerId === req.session.user.id){
      doc.updateAttributes({
        name: title.newTitle
      })
    }else{
      console.log("Only owners can edit title")
    }
  })
  .then(function(){
    res.sendStatus(200);
  })
  .catch(function(err){
    res.sendStatus(500);
  });
});

module.exports = router;
