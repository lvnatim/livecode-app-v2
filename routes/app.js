var express = require('express');
var db = require('../models/index');
var router = express.Router();
var moment = require('moment');
var dotenv = require('dotenv');
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
  dotenv.load();
  var username = process.env.GITHUB_USERNAME;
  var password = process.env.GITHUB_PASSWORD;
  var clientId = process.env.GITHUB_CLIENT_ID;
  var clientSecret = process.env.GITHUB_CLIENT_SECRET;

  var fileName = req.query.fileName
  var content = req.query.content

  var github = new GitHubApi({
    protocol: "https",
    host: "api.github.com",
    headers: {
      "user-agent": "LiveCode"
    }
  });
  
  github.authenticate({
    type: "basic",
    username: username,
    password: password
    });
  
  github.authorization.create({
    scopes:["user","gist"],
    note: "LiveCode post to Gist",
    client_id: clientId,
    client_secret: clientSecret,
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
