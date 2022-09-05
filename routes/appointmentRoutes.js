const express = require('express');
const User = require('../models/userModel');
const Doctor = require('../models/doctorModel');
const Appointment = require('../models/appointmentModel');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/get-appointments-by-user-id', authMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      user: req.userId,
    }).populate('user doctor');

    res.status(200).send({
      message: 'Appointments fetched successfully',
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.log('[GET] /get-appointments-by-user-id - error', error);

    res
      .status(500)
      .send({ message: 'Error fetching appointments', success: false, error });
  }
});

router.get(
  '/get-appointments-by-doctor-id',
  authMiddleware,
  async (req, res) => {
    try {
      const doctor = await Doctor.findOne({ userId: req.userId });
      const appointments = await Appointment.find({
        doctor: doctor._id,
      }).populate('user doctor');

      res.status(200).send({
        message: 'Appointments fetched successfully',
        success: true,
        data: appointments,
      });
    } catch (error) {
      console.log('[GET] /get-appointments-by-doctor-id - error', error);

      res.status(500).send({
        message: 'Error fetching appointments',
        success: false,
        error,
      });
    }
  }
);

router.post('/book-appointment', authMiddleware, async (req, res) => {
  try {
    const { userId, doctorId, dateTime } = req.body;

    const isAvailable = await Appointment.checkAvailability(req.body);

    if (!isAvailable) {
      return res.status(200).send({
        message: 'The selected time is not available',
        success: false,
      });
    }

    const newAppointment = await Appointment.create({
      user: userId,
      doctor: doctorId,
      dateTime,
    });

    await newAppointment.populate('user');

    const newNotification = {
      type: 'new-appointment-request',
      message: `You have a new appointment request from ${newAppointment?.user?.name}`,
      onClickPath: '/doctor/appointments',
    };

    const doctor = await Doctor.findById(doctorId);

    await User.findOneAndUpdate(
      { _id: doctor.user },
      { $push: { unseenNotifications: newNotification } }
    );

    res.status(200).send({
      message: 'Appointment requested successfully',
      success: true,
      data: newAppointment,
    });
  } catch (error) {
    console.log('[POST] /book-appointment - error', error);

    res
      .status(500)
      .send({ message: 'Error booking appointment', success: false, error });
  }
});

router.post('/check-booking-availability', authMiddleware, async (req, res) => {
  try {
    const isAvailable = await Appointment.checkAvailability(req.body);

    const message = isAvailable
      ? 'Selected time is available'
      : 'Selected time is not available';

    res.status(200).send({
      message,
      success: isAvailable,
    });
  } catch (error) {
    console.log('[POST] /check-booking-availability - error', error);

    res
      .status(500)
      .send({ message: 'Error checking availability', success: false, error });
  }
});

router.post('/change-appointment-status', authMiddleware, async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(appointmentId, {
      status,
    });

    const newNotification = {
      type: 'appointment-status-changed',
      message: `Your appointment status has been ${status}`,
      onClickPath: '/appointments',
    };

    await User.findOneAndUpdate(
      { _id: appointment.user },
      { $push: { unseenNotifications: newNotification } }
    );

    res.status(200).send({
      message: 'Appointment status changed successfully',
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.log('[GET] /change-appointment-status - error', error);

    res.status(500).send({
      message: 'Error changing appointment status',
      success: false,
      error,
    });
  }
});

module.exports = router;
