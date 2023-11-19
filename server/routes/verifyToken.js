require('dotenv').config();
// verifyToken.js
const jwt = require('jsonwebtoken');

// Import JWT_SECRET
JWT_SECRET = process.env.JWT_SECRET

const verifyToken = (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.headers.authorization.split(' ')[1];
    
    if (!token) {
        console.log('no token')
      return res.status(401).json({ message: 'Unauthorized' });
    }
  
    // Verify the token
    jwt.verify(token, JWT_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err)
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Token is valid; you can proceed to the protected route
      req.user = decodedToken; // Store user information in the request object
      next();
    });

};

module.exports = verifyToken;