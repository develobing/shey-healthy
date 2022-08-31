const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');

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
    const user = await User.findById(req.userId).select('-password');

    if (!user) {
      return res
        .status(200)
        .send({ message: 'User does not exist', success: false });
    } else {
      res.status(200).send({
        success: true,
        data: { ...user?._doc },
      });
    }
  } catch (error) {
    console.log('/get-user-info-by-id - error', error);

    res
      .status(500)
      .send({ message: 'Error getting user info', success: false, error });
  }
});

router.post('/apply-doctor-account', authMiddleware, async (req, res) => {
  try {
    const newDoctor = new Doctor({ ...req.body, status: 'pending' });
    await newDoctor.save();

    const adminUser = await User.findOne({ isAdmin: true });

    const unseenNotifications = adminUser.unseenNotifications;
    unseenNotifications.push({
      type: 'new-doctor-request',
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: `${newDoctor.firstName} ${newDoctor.lastName}`,
      },
      onClickPath: '/admin/doctors',
    });

    await adminUser.save();

    res.status(200).send({
      message: 'Doctor account applied successfully',
      success: true,
    });
  } catch (error) {
    console.log('/apply-doctor-account - error', error);

    res.status(500).send({
      message: 'Error applying doctor account',
      success: false,
      error,
    });
  }
});

module.exports = router;
