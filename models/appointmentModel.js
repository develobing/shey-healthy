const mongoose = require('mongoose');
const moment = require('moment');

const appointmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
      required: true,
    },
    doctor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'doctors',
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      default: 'pending',
    },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

appointmentSchema.statics.checkAvailability = async function (appointment) {
  const { doctorId, dateTime } = appointment;

  const targetDateMoment = moment(dateTime, 'MM-DD-YYYY HH:mm');
  const fromTime = targetDateMoment.clone().subtract(60, 'minutes').toDate();
  const toTime = targetDateMoment.clone().add(60, 'minutes').toDate();

  const appointments = await this.find({
    doctor: doctorId,
    dateTime: { $gte: fromTime, $lte: toTime },
    // status: 'approved',
  });

  if (appointments.length > 0) return false;
  else return true;
};

const appointmentModel = mongoose.model('appointments', appointmentSchema);

module.exports = appointmentModel;
