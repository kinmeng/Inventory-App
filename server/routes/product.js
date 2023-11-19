const express = require("express");
require('dotenv').config();
const ObjectId = require("mongodb").ObjectId

// This will help us connect to the database
const dbo = require("../db/conn");

const bwipjs = require('bwip-js');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const verifyToken = require('./verifytoken');
// This help convert the id from string to ObjectId for the _id.
// const ObjectId = require("mongodb").ObjectId;
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();


recordRoutes.post("/products/add",verifyToken, async (req, res) => {

  let db_connect = dbo.getDb("finances");

  let barcodeBufferData;

  try {
    if(req.user){
    const barcodeImage = await new Promise((resolve, reject) => {
      bwipjs.toBuffer({
        bcid: 'code128',
        text: req.body.sku,
        scale: 3,
        height: 10,
        includetext: true,
        textxalign: 'center',
      }, (err, barcodeImage) => {
        if (err) {
          console.log('error');
          reject(err);
        } else {
          fs.writeFileSync('barcode.png', barcodeImage);
          barcodeBufferData = barcodeImage;
          resolve(barcodeImage);
        }
      });
    });

    // let binaryProductImage ="123155"
    // console.log(barcodeBufferData);
    const convertFileToBinary = (selectedFile) => {
      let filePath=process.env.FOLDER_BASE_PATH + selectedFile
      console.log(filePath, 'filePath')
      let binaryProductImage = fs.readFileSync(filePath, 'base64')
      return binaryProductImage
    }
    let binaryProductImage = convertFileToBinary(req.body.productImage)  

  let myobj = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    sku: barcodeBufferData,
    productImage: binaryProductImage
  };

  let collection = await db_connect.collection("products")
  let result= await collection.insertOne(myobj)
    res.send(result).status(200);
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).send('Error occurred');
  }
 });


recordRoutes.get('/products/',verifyToken, async (req, res) => {
  try {

    if (req.user) {


    let db_connect = dbo.getDb("finances");
    let collection = db_connect.collection("products")
    let results = await collection.find({}).toArray();
    
    
    results.forEach((element) => {
      const base64Data = element.sku.toString('base64');
      element.sku = `data:image/jpeg;base64,${base64Data}`;
      const productImage = element.productImage;
      element.productImage = `data:image/jpeg;base64,${productImage}`;
    });

    res.send(results).status(200);
  }else {
    // User is not authorized
    console.log('user is not authorized')
    res.status(403).json({ message: 'You are not authorized to access this resource' });
  }

  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
 
// This section will help you get a single record by id
recordRoutes.get("/products/:id", async (req, res) => {
  let db_connect = dbo.getDb("finances");
  let collection = await db_connect.collection("products");
  console.log('check id')
  console.log(req.params.id)
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);
  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
 
// This section will help you create a new record.
recordRoutes.post("/products/add", async (req, res) => {
  console.log(dbo)
  let db_connect = dbo.getDb("finances");
  let myobj = {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    sku: req.body.sku
  };

  let collection = await db_connect.collection("products")
  let result= await collection.insertOne(myobj)
    res.send(result).status(200);
 });
 
// This section will help you update a record by id.
recordRoutes.patch("/products/update/:id",  async (req, res) => {
 let db_connect = dbo.getDb("finances");
 let myquery = { _id: new ObjectId(req.params.id) };
 console.log('update product')
 console.log(myquery)
 let newvalues = {
   $set: {
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    sku: req.body.sku
   },
 };


 let collection = await db_connect.collection("products");
 let result = await collection.updateOne(myquery, newvalues);

 res.send(result).status(200);

});
 
// This section will help you delete a record
recordRoutes.delete("/products/:id",   async (req, res) => {
 let db_connect = dbo.getDb("finances");
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect.collection("products").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   res.status(500).json({ error: 'Internal Server Error' });
 });
});
 
module.exports = recordRoutes;