var express = require('express');
var db = require('../models/index');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  db.User
    .findAll({
      attributes: ["id", "username", "firstName", "lastName"], 
      where:{
        username: {
          $like: req.query.username
        }
      },
      limit: 10
    })
    .then(users=>{
      res.send(users);
    })
    .catch(err=>{
      res.sendStatus(404);
    });
});

router.get('/profile', function(req, res, next) {
  var userId;
  if(req.query.userId){
    userId = req.query.userId;
  } else {
    userId = req.session.user.id;
  }
  db.User
    .findById(userId,{
      attributes: ["id", "username", "email","firstName", "lastName"], 
      include: [db.Document, db.Profile]
    })
    .then(user=>{
      res.send(user);
    })
    .catch(err=>{
      res.sendStatus(404);
    });
})

router.get('/profiles', function(req, res, next) {
  db.User
    .findAll({
      attributes: ["id", "username", "email","firstName", "lastName"], 
      include: [db.Document, db.Profile],
      where:{
        username: {
          $like: req.query.username
        }
      },
      limit: 10
    })
    .then(user=>{
      res.send(user);
    })
    .catch(err=>{
      res.sendStatus(404);
    });
})

router.post('/register', function(req, res, next) {
  db.User
    .create(req.body)
    .then(user=>{
      db.Profile
        .create()
        .then(profile=>{
          user.setProfile(profile);
        })
      res.sendStatus(200);
    })
    .catch(err=>{
      res.sendStatus(404);
    })
});

router.post('/login', function(req, res, next) {
  db.User
    .findOne(
      {
        where: req.body,
        attributes: ["id", "username"]
      }
    )
    .then(user=>{
      if(user){
        req.session.user = user,
        res.sendStatus(200)
      } else res.sendStatus(404);
    })
    .catch(err=>{
      res.sendStatus(404);
    })
});

router.get('/logout', function(req, res, next) {
  req.session.user = null;
  if(!req.session.user){
    res.sendStatus(200);
  }
});

module.exports = router;
