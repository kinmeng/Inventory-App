const User = require('../models/User'); // Import the User model
const express = require("express");

const ObjectId = require("mongodb").ObjectId

// This will help us connect to the database
const dbo = require("../db/conn");
// console.log(dbo.collection('products'))
// This help convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

  JWT_SECRET = process.env.JWT_SECRET

  recordRoutes.post('/login', async (req, res) => {
    try {
      let db_connect = dbo.getDb("finances");
      let collection = await db_connect.collection("users");
      let query = {username: req.body.username};
      const user = await collection.findOne(query);
      console.log(user)
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }
  
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
      console.log(isPasswordValid)
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid password' });
      }
      console.log(isPasswordValid)
      // Generate JWT token
      console.log(JWT_SECRET)
      const token = jwt.sign({ username: user.username }, JWT_SECRET);
      return res.status(200).json({ token });
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: 'Login failed' });
    }
  });

  module.exports = recordRoutes;