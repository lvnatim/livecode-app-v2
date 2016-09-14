var express = require('express');
var db = require('../models/index');
var router = express.Router();
var moment = require('moment');
var GitHubApi = require('github');

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

router.get('/auth/github', function(req, res, next){

  var fileName = req.query.fileName
  var content = req.query.content

  var github = new GitHubApi({
    protocol: "https",
    host: "api.github.com",
    headers: {
      "user-agent": "LiveCode"
    },
    Promise: require('bluebird'),
    timeout: 5000
  });
  
  github.authenticate({
    type: "basic",
    username: '*',
    password: '*'
    });
  
  github.authorization.create({
    scopes:["user","gist"],
    note: "LiveCode post to Gist",
    client_id: '*',
    client_secret: '*',
    headers: {
      "user-agent": "LiveCode"
    }
  }, function(err, response){
    var token = response.token;
    if(token){
      github.gists.create({
      'description': 'Code from LiveCode!',
      'public': true,
      'files': {
        [fileName]: {
        'content': content
          }
        } 
      })
     res.sendStatus(200) 
    } else {
      console.log(err);
    }
  });
});

module.exports = router;
