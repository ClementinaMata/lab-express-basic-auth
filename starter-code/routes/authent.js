const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
// const path = require('path');
// const debug = require('debug')('basic-auth:'+ path.basename(__filename));
const router = express.Router();
const bcryptSalt = 10;



router.get('/', (req, res) => {
  res.render('index', { title: 'INDEX' });
});
router.get('/signup', (req, res) => {
  res.render('authent/signup', { title: 'Signup' });
});

router.get('/login', (req, res) => {
  res.render('authent/login', { title: 'Login' });
});



/* GET home page. */
router.post('/signup', (req, res) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("authent/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  router.post("/signup", (req, res, next) => {
    var username = req.body.username;
    var password = req.body.password;
    var salt= bcrypt.genSaltSync(bcryptSalt);
    var hashPass = bcrypt.hashSync(password, salt);

    var newUser  = User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      res.redirect("/");
    });
  });
  User.findOne({ "username": username },
    "username",
    (err, user) => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMessage: "The username already exists"
        });
        return;
      }

      var salt     = bcrypt.genSaltSync(bcryptSalt);
      var hashPass = bcrypt.hashSync(password, salt);

      var newUser = User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        res.redirect("/");
      });
    });

});

router.post("/login", (req, res, next) => {
  var username = req.body.username;
  var password = req.body.password;

  if (username === "" || password === "") {
    res.render("authent/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("authent/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/");
      } else {
        res.render("authent/login", {
          errorMessage: "Incorrect password"
        });
      }
  });
});

module.exports = router;
