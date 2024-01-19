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

// Registration Model
const Registration = mongoose.model('Registration', {
  iam: String,
  state: String,
  municipalType: String,
  schoolType: String,
  organizationType: String,
  role: String,
  firstname: String,
  lastname: String,
  email: String,
  password: String,
});

// Validation middleware for registration
const validateRegistrationForm = [
  body('iam').notEmpty().withMessage('I am field is required.'),
  // Add more validation rules for other fields
  body('email').isEmail().withMessage('Invalid email address.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long.')
];

// Endpoint for registration form
app.post('/api/register', validateRegistrationForm, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const newRegistration = new Registration(req.body);
    await newRegistration.save();
    res.json({ success: true, message: 'Registration successful!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Registration.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Logged in successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
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




