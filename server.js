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
  firstname: String,
  lastname: String,
  email: String,
  organization: String,
  message: String,
});
const Newsletter = mongoose.model('Newsletter', {
  firstname: String,
  lastname: String,
  email: String,
  
});


app.use(bodyParser.json());

// Validation middleware

const validateContactForm = [
  body('firstname').notEmpty().withMessage('First Name is required.'),
  body('lastname').notEmpty().withMessage('Last Name is required.'),
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .custom((value) => {
      if (value.includes('@gmail.com')) {
        throw new Error('Email address cannot be from gmail.com');
      }
      return true;
    }),
  body('organization').notEmpty().withMessage('Organization is required.'),
  body('message').notEmpty().withMessage('Message cannot be empty.'),
];
const validateContactFormNewsletter = [
  body('firstname').notEmpty().withMessage('First Name is required.'),
  body('lastname').notEmpty().withMessage('Last Name is required.'),
  body('email')
    .isEmail().withMessage('Invalid email address.')
    .custom((value) => {
      if (value.includes('@gmail.com')) {
        throw new Error('Email address cannot be from gmail.com');
      }
      return true;
    }),
];





// Endpoint to handle contact form submissions with validation
app.post('/api/contact', validateContactForm, async (req, res) => {
  // ...

  try {
    const { firstname, lastname, email, organization, message } = req.body;

    const newContact = new Contact({
      firstname,
      lastname,
      email,
      organization,
      message,
    });

    await newContact.save();

    res.json({ success: true, message: 'Submission received successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/newsletter', validateContactFormNewsletter, async (req, res) => {
  // ...

  try {
    const { firstname, lastname, email } = req.body;

    const newNewsletter = new Newsletter({
      firstname,
      lastname,
      email,
      
    });

    await newNewsletter.save();

    res.json({ success: true, message: 'Submission received successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




