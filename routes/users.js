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

router.post('/register', function(req, res, next) {
  db.User
    .create(req.body)
    .then(user=>{
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

module.exports = router;
