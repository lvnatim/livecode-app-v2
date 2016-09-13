var express = require('express');
var db = require('../models/index');
var router = express.Router();

// These are all API routes.

router.get('/new', function(req, res, next) {
  if(!req.session.user) res.sendStatus(404);
  var userId = req.session.user.id
  db.Document
    .create(
      {OwnerId: userId}
    )
    .then(doc=>{ 
      db.User
        .findById(userId)
        .then(user=>{
          doc.addUser(user);
          res.send(doc);
        })
        .catch(err=>{
          res.sendStatus(404);
        });
    })
    .catch(err=>{
      res.sendStatus(404);
    })
});

router.get('/', function(req, res, next) {
  if(!req.session.user) res.sendStatus(404);
  var docId = req.query.docId;
  db.Document
    .findById(docId,{
      include: [{
        model: db.User,
        as: "Owner",
        attributes: ["id", "username", "firstName", "lastName"]
      },{
        model: db.User,
        attributes: ["id", "username", "firstName", "lastName"]
      }]
    })
    .then(doc=>{
      req.session.activeDocId = docId;
      res.send(doc);
    })
    .catch(err=>{
      res.sendStatus(404);
    });
});

router.put('/', function(req, res, next) {
  if(!req.session.user) res.sendStatus(404);
  var docId = req.session.activeDocId;
  var content = req.body.content;
  db.Document
    .findById(docId)
    .then(doc=>{
      doc.content = content;
      doc.save()
        .then(doc=>res.sendStatus(200))
        .catch(err=>res.sendStatus(404));
    })
    .catch(err=>{
      res.sendStatus(404);
    })
});

router.delete('/', function(req, res, next) {
  if(!req.session.user) res.sendStatus(404);
  var userId = req.session.user.id;
  var docId = req.body.docId;
  db.Document
    .findById(docId)
    .then(doc=>{
      if(doc.OwnerId === userId){
        doc.destroy();
        res.sendStatus(200);
      } else {
        res.sendStatus(404);
      }
    })
    .catch(err=>{
      res.sendStatus(404);
    })
})

router.post('/editors', function(req, res, next){
  if(!req.session.user) res.sendStatus(404);
  var docId = req.session.activeDocId;
  var userId = req.body.userId;
  db.Document
    .findById(docId)
    .then(doc=>{
    if(doc.OwnerId === req.session.user.id){
      db.User
        .findById(userId)
        .then(user=>{
          doc.addUser(user);
          res.send(user);
        })
    } else res.sendStatus(404);
  });
});

router.delete('/editors', function(req, res, next){
  if(!req.session.user) res.sendStatus(404);
  var docId = req.session.activeDocId;
  var userId = req.body.userId;
  db.Document
    .findById(docId)
    .then(doc=>{
    if(doc.OwnerId === req.session.user.id){
      db.User
        .findById(userId)
        .then(user=>{
          doc.removeUser(user);
          res.sendStatus(200);
        })
    } else res.sendStatus(404);
  });
});

module.exports = router;