// Importing the required libraries
require('dotenv').config();
const { sign, verify } = require('jsonwebtoken');

// Function to create a token using a user object
function createToken(user) {
  // Sign the user data with the SECRET_KEY from .env file
  return sign({
    email: user.email,
    password: user.password
  },
  process.env.SECRET_KEY,
  {
    expiresIn: '1h' // The token will expire in 1 hour
  });
}

// Middleware function to verify an authentication token
function verifyToken(req, res, next) {
  try {
    // Get the authentication token from cookies or set it to "Please register" if it's not available
    const token = req.cookies["LegitUser"] !== null ? req.cookies["LegitUser"] : "Please register";
    let isValid = null;

    // Verify the token using the SECRET_KEY from .env file
    if (token !== "Please register") {
      isValid = verify(token, process.env.SECRET_KEY);
      if (isValid) {
        req.authenticated = true; // Set a flag to indicate that the user is authenticated
        next(); // Call the next middleware function
      } else {
        res.status(400).json({err: "Please register"}); // Return an error response if the token is invalid
      }
    } else {
      res.status(400).json({err: "Please register"}); // Return an error response if the token is not available
    }
  } catch (e) {
    res.status(400).json({err: e.message}); // Return an error response if an exception is thrown
  }
}

// Export the functions for use in other modules
module.exports = { createToken, verifyToken };
