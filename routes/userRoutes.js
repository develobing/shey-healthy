const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    console.log('userExist', userExist);
    if (userExist) {
      return res
        .status(200)
        .send({ message: 'User already exists', success: false });
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    req.body.password = hashedPassword;
    const newUser = new User(req.body);

    await newUser.save();

    res
      .status(201)
      .send({ message: 'User created successfully', success: true });
  } catch (error) {
    console.log('/register - error', error);

    res
      .status(500)
      .send({ message: 'Error creating user', success: false, error });
  }
});

router.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res
        .status(200)
        .send({ message: 'user does not exist', success: false });
    }

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      return res
        .status(200)
        .send({ message: 'Password is incorrect', success: false });
    } else {
      const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1d',
      });

      console.log('token', token);

      res
        .status(200)
        .send({ message: 'Login successful', success: true, token });
    }
  } catch (error) {
    console.log('/login - error', error);
  }
});

router.post('/get-user-info-by-id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    if (!user) {
      return res
        .status(200)
        .send({ message: 'User does not exist', success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    console.log('/get-user-info-by-id - error', error);

    res
      .status(500)
      .send({ message: 'Error getting user info', success: false, error });
  }
});

module.exports = router;
