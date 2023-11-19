const User = require('../models/User'); // Import the User model
const express = require("express");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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


recordRoutes.post('/register', async (req, res) => {
  try {
    let db_connect = dbo.getDb("finances");
    let collection = await db_connect.collection("users");
    // const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newUser = new User({ username: req.body.username, password: hashedPassword });
    const existingUser = await collection.findOne({ username: newUser.username });

    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    else{
    let result= await collection.insertOne(newUser)
    res.send(result).status(200);
   

    return res.status(201).json({ message: 'Registration successful' });
    }


  } catch (error) {
    console.log(error)
    return res.status(500).json({ message: 'Registration failed' });
  }
});




module.exports = recordRoutes;