const express = require('express');
const Doctor = require('../models/doctorModel');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/get-doctor-info-by-user-id', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ userId: req.body?.userId });

    res.status(200).send({
      success: true,
      message: 'Doctor info fetched successfully',
      data: doctor,
    });
  } catch (error) {
    console.log('[POST] /get-doctor-info-by-user-id - error', error);

    res
      .status(500)
      .send({ message: 'Error getting doctor info', success: false, error });
  }
});

router.post('/update-doctor-profile', authMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body?.userId },
      { ...req.body },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: 'Doctor info updated successfully',
      data: doctor,
    });
  } catch (error) {
    console.log('[POST] /update-doctor-profile - error', error);

    res
      .status(500)
      .send({ message: 'Error updating doctor info', success: false, error });
  }
});

module.exports = router;
