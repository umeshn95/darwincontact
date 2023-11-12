// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true });

const Contact = mongoose.model('Contact', {
  fullName: String,
  email: String,
  seeking: String,
  howDidYouHear: String,
  message: String,
});

app.use(bodyParser.json());

// Validation middleware
const validateContactForm = [
  body('fullName').notEmpty().withMessage('Full Name is required.'),
  body('email').isEmail().withMessage('Invalid email address.'),
  body('seeking').notEmpty().withMessage('Please specify what you are seeking.'),
  body('howDidYouHear').notEmpty().withMessage('Please specify how you heard about us.'),
  body('message').notEmpty().withMessage('Message cannot be empty.'),
];

// Endpoint to handle contact form submissions with validation
app.post('/api/contact', validateContactForm, async (req, res) => {
  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    const { fullName, email, seeking, howDidYouHear, message } = req.body;

    const newContact = new Contact({
      fullName,
      email,
      seeking,
      howDidYouHear,
      message,
    });

    await newContact.save();

    res.json({ success: true, message: 'Submission received successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




