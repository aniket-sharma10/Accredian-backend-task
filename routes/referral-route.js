const express = require('express');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require('nodemailer');

const prisma = new PrismaClient();
const router = express.Router();

// Create a referral
router.post('/', async (req, res) => {
  try {
    const { referrerName, referrerEmail, refereeName, refereeEmail, courseName } = req.body;

    if (!referrerName || !referrerEmail || !refereeName || !refereeEmail || !courseName) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Save referral data
    const referral = await prisma.referral.create({
      data: {
        referrerName,
        referrerEmail,
        refereeName,
        refereeEmail,
        courseName,
      },
    });

    // Send referral email
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: refereeEmail,
      subject: `Referral for ${courseName}`,
      text: `You have been referred by ${referrerName} (${referrerEmail}) for the course: ${courseName}.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          return res.status(500).json({ error: 'Failed to send referral email' });
        }
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Referral created and email sent!', referral });
      });
  
  } catch (error) {
    console.error('Internal Server Error: ', error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
