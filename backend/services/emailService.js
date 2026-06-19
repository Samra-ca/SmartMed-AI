const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendDoctorNotification = async (doctorEmail, patientData) => {
  try {
    await transporter.sendMail({
      from:    process.env.EMAIL_USER,
      to:      doctorEmail,
      subject: 'New Patient Message - SmartDoctor',
      html: `
        <h2>New Patient Inquiry</h2>
        <p><strong>Name:</strong> ${patientData.senderName}</p>
        <p><strong>Email:</strong> ${patientData.senderEmail}</p>
        <p><strong>Phone:</strong> ${patientData.senderPhone}</p>
        <p><strong>Problem:</strong> ${patientData.problem}</p>
        <p>Please login to SmartDoctor to respond.</p>
      `
    });
    console.log('Email sent to doctor');
  } catch (err) {
    console.error('Email error:', err.message);
  }
};

module.exports = { sendDoctorNotification };