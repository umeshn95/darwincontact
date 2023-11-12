// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors')
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');

const app = express();
const port = process.env.PORT || 3001;

mongoose.connect(process.env.mongouri, { useNewUrlParser: true, useUnifiedTopology: true });

// allow origin

// app.use((req, res, next) => {
//     res.setHeader(
//       "Access-Control-Allow-Origin",
//       "https:darwinanalytic.com"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Methods",
//       "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS,CONNECT,TRACE"
//     );
//     res.setHeader(
//       "Access-Control-Allow-Headers",
//       "Content-Type, Authorization, X-Content-Type-Options, Accept, X-Requested-With, Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//     );
//     res.setHeader("Access-Control-Allow-Credentials", true);
//     res.setHeader("Access-Control-Allow-Private-Network", true);
//     //  Firefox caps this at 24 hours (86400 seconds). Chromium (starting in v76) caps at 2 hours (7200 seconds). The default value is 5 seconds.
//     res.setHeader("Access-Control-Max-Age", 7200);
  
//     next();
//   });

app.use(cors())

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

    res.header('Access-Control-Allow-Origin', 'http://darwinanalytic.com');
  res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
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




