const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//load validator
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

//load user model
const User = require('../../models/Users');
const keys = require('../../config/keys');
const passport = require('passport');

//*****************
// @route    GET api/users/register
// @desc     register Users
// @access   Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      return res.status(400).json({ email: 'Email already exist' });
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: '200',
        r: 'pg',
        d: 'mm',
      });
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
    }
  });
});

//*****************
// @route    GET api/users/login
// @desc     Login user / Return JWT Token
// @access   Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  //check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  //find user by email
  User.findOne({ email }).then((user) => {
    // check for user
    if (!user) {
      errors.email = 'User not Found';
      return res.status(404).json(errors);
    }
    //Check Password
    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        //user Matched
        const payload = { id: user.id, name: user.name, avatar: user.avatar };
        //sign JWT
        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: 'Bearer ' + token,
            });
          }
        );
      } else {
        errors.password = 'password incorrect';
        return res.status(400).json(errors);
      }
    });
  });
});

//*****************
// @route    GET api/users/current
// @desc     Get current logged in user
// @access   Private
router.get(
  '/current',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
    });
  }
);

module.exports = router;
