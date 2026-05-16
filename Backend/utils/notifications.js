const nodemailer = require('nodemailer');
const twilio = require('twilio');

const sendEmailNotification = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Beauty Bliss Nad" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}`);
  } catch (error) {
    console.error('Email error:', error.message);
  }
};

const sendSMSNotification = async (phone, message) => {
  // SMS/WhatsApp functionality is currently disabled.
  // To enable, uncomment the code below and ensure Twilio credentials are set in .env.
  /*
  try {
    if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN || !process.env.TWILIO_PHONE) {
      console.log('Twilio credentials missing. SMS/WhatsApp skipped.');
      return;
    }

    const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
    
    // Ensure phone number is in international format (e.g., +91...)
    const formattedPhone = phone.startsWith('+') ? phone : `+91${phone.replace(/\s/g, '')}`;

    // 1. Send SMS
    await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE,
      to: formattedPhone
    });
    console.log(`Real SMS sent to ${formattedPhone}`);

    // 2. Send WhatsApp (Twilio Sandbox requires 'whatsapp:' prefix)
    await client.messages.create({
      from: `whatsapp:${process.env.TWILIO_PHONE}`,
      body: message,
      to: `whatsapp:${formattedPhone}`
    });
    console.log(`Real WhatsApp message sent to ${formattedPhone}`);

  } catch (error) {
    console.error('Twilio Error:', error.message);
  }
  */
  console.log(`SMS/WhatsApp notification skipped for ${phone}`);
};

const notifyStatusUpdate = async (booking) => {
  const { name, phone, email, date, timeSlot, status, service } = booking;
  const serviceName = service?.name || 'Service';

  let subject = '';
  let message = '';

  switch (status) {
    case 'confirmed':
      subject = 'Booking Confirmed - Beauty Bliss Nad';
      message = `Hi ${name}, your booking for ${serviceName} on ${date} at ${timeSlot} has been CONFIRMED. We look forward to seeing you!`;
      break;
    case 'completed':
      subject = 'Service Completed - Beauty Bliss Nad';
      message = `Hi ${name}, thank you for visiting Beauty Bliss Nad! Your ${serviceName} service is completed. We hope you enjoyed it!`;
      break;
    case 'cancelled':
      subject = 'Booking Cancelled - Beauty Bliss Nad';
      message = `Hi ${name}, your booking for ${serviceName} on ${date} at ${timeSlot} has been CANCELLED. If this was a mistake, please contact us.`;
      break;
    default:
      return;
  }

  // Send Email if provided
  if (email) {
    await sendEmailNotification(email, subject, message);
  }

  // Send SMS
  await sendSMSNotification(phone, message);
};

module.exports = { notifyStatusUpdate, sendEmailNotification, sendSMSNotification };
