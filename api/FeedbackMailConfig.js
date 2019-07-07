var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'viswezzz@gmail.com',
    pass: 'Pass123nstore'
  }
});

var mailOptions = {
  from: '98viswesh@gmail.com',
  to: 'viswezzz@gmail.com',
  subject: 'Sending Email using Node.js',
  text: 'That was easy!'
};

exports.mailOptions=mailOptions;
exports.transporter=transporter;