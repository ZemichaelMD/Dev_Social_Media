const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');

//load profile model
const Profile = require('../../models/Profile');

//Validation for Profile
const validateProfileInput = require('../../validation/profile');
const validateExperienceInput = require('../../validation/experience');
const validateEducationInput = require('../../validation/education');

//load user model
const User = require('../../models/Users');
const profile = require('../../validation/profile');

//************
// @route    GET api/profile/all
// @desc     Get all profiles
// @access   public

router.get('/all', (req, res) => {
  Profile.find()
    .populate('user', ['name', 'avatar'])
    .then((profiles) => {
      if (!profiles) {
        errors.profile = 'There are no profiles';
        res.status(400).json(errors);
      }
      res.json(profiles);
    })
    .catch((err) => {
      res.status(400).json({ msg: 'There is no profile' });
    });
});

//************
// @route    GET api/profile/handle/:handle
// @desc     Get profile by handle
// @access   public
router.get('/handle/:handle', (req, res) => {
  errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        (errors.noprofile = 'There is no profile'),
          res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json(err);
    });
});

//************
// @route    GET api/profile/user/:user_id
// @desc     Get profile by user Id
// @access   public
router.get('/user/:user_id', (req, res) => {
  errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate('user', ['name', 'avatar'])
    .then((profile) => {
      if (!profile) {
        (errors.noprofile = 'There is no profile'),
          res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) => {
      res.status(404).json({ profile: ' There is no profile fo this user' });
    });
});

//************
// @route    GET api/profile
// @desc     Get the current logged in user
// @access   Private
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(400).json(err));
  }
);

//************
// @route    POST api/profile
// @desc     Create a user profile
// @access   Private
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);

    //check Validation
    if (!isValid) {
      return res.status(400).json(errors);
    }

    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //skills separated by comma
    if (typeof req.body.skills !== undefined) {
      profileFields.skills = req.body.skills.split(',');
    }
    //social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linedin) profileFields.social.linedin = req.body.linedin;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //update
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => res.json(profile));
      } else {
        //Create
        //check if hundle exists
        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          errors.handle = 'That handle is already taken';
          res.status(400).json(error);
        });
        //save profile
        new Profile(profileFields).save().then((profile) => {
          res.json(profile);
        });
      }
    });
  }
);

//************
// @route    POST api/profile/experience
// @desc     Update experience of current user
// @access   Private
router.post(
  '/experience',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then((profile) => {
        if (!profile) {
          errors.noProfile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
        const newExp = {
          title: req.body.title,
          company: req.body.company,
          location: req.body.location,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };
        //Add to exp array
        profile.experience.unshift(newExp);
        profile
          .save()
          .then((profile) => res.json(profile))
          .catch((err) => console.log(err));
      })
      .catch((err) => res.status(400).json(err));
  }
);

//************
// @route    POST api/profile/education
// @desc     Update experience of current user
// @access   Private
router.post(
  '/education',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);

    if (!isValid) {
      res.status(400).json(errors);
    }

    Profile.findOne({ user: req.user.id })
      .populate('user', ['name', 'avatar'])
      .then((profile) => {
        if (!profile) {
          errors.noProfile = 'There is no profile for this user';
          res.status(404).json(errors);
        }
        const newEdu = {
          school: req.body.school,
          degree: req.body.degree,
          fieldofstudy: req.body.fieldofstudy,
          from: req.body.from,
          to: req.body.to,
          current: req.body.current,
          description: req.body.description,
        };
        //Add to exp array
        profile.education.unshift(newEdu);
        profile.save().then((profile) => res.json(profile));
        // .catch((err) => console.log(err));
      })
      .catch((err) => res.status(400).json(err));
  }
);

module.exports = router;
