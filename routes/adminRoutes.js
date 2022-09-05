const express = require('express');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/get-all-doctors', authMiddleware, async (req, res) => {
  try {
    const doctors = await Doctor.find();

    res.status(200).send({
      message: 'Doctors fetched successfully',
      success: true,
      data: doctors,
    });
  } catch (error) {
    console.log('[GET] /get-all-doctors - error', error);

    res
      .status(500)
      .send({ message: 'Error getting doctors list', success: false, error });
  }
});

router.get('/get-all-users', authMiddleware, async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).send({
      message: 'Users fetched successfully',
      success: true,
      data: users,
    });
  } catch (error) {
    console.log('[GET] /get-all-users - error', error);

    res
      .status(500)
      .send({ message: 'Error getting users list', success: false, error });
  }
});

router.post('/change-doctor-status', authMiddleware, async (req, res) => {
  try {
    const { userId, doctorId, status } = req.body;
    const doctor = await Doctor.findByIdAndUpdate(doctorId, {
      status,
    });

    const newNotification = {
      type: 'new-doctor-request-changed',
      message: `Your doctor account has been ${status}`,
      data: {
        doctorId: doctor._id,
        name: `${doctor.firstName} ${doctor.lastName}`,
      },
      onClickPath: '/notifications',
    };

    await User.findOneAndUpdate(
      { _id: userId },
      {
        isDoctor: status === 'approved' ? true : false,
        $push: { unseenNotifications: newNotification },
      }
    );

    res.status(200).send({
      message: 'Doctor status changed successfully',
      success: true,
      data: doctor,
    });
  } catch (error) {
    console.log('[GET] /change-doctor-status - error', error);

    res
      .status(500)
      .send({ message: 'Error changing doctor status', success: false, error });
  }
});

module.exports = router;
