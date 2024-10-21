const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const authController = require('../controllers/auth');

router.post(
  '/signup',
  [
    body('name').trim().not().isEmpty(),
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email.')
      .custom(async (email) => {
        const user = await User.find(email);
        if (user[0].length > 0) {
          // Throw an error if email already exists
          throw new Error('Email address already exists!');
        }
      })
      .normalizeEmail(),
    body('password').trim().isLength({ min: 7 }),
  ],
  async (req, res, next) => {
    // Validate the input fields
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Map the errors to a simple array of error messages
      const errorMessages = errors.array().map((error) => error.msg);
      return res.status(422).json({ errors: errorMessages });
    }

    // Proceed with signup logic in the auth controller
    try {
      await authController.signup(req, res, next);
    } catch (err) {
      // Handle any unexpected errors
      next(err);
    }
  }
);

router.post('/login', authController.login);

module.exports = router;
