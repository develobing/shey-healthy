const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI);
const connection = mongoose.connection;

connection.on('connected', () => {
  console.log(`MongoDB is connected!`);
});
connection.on('error', (err) => {
  console.log(`Error in MongoDB connection - ${err}`);
});
