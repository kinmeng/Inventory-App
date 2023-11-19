const express = require("express");
// const verifyToken = require('./verifytoken');
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
 

recordRoutes.get('/sales/', async (req, res) => {
  try {
    let db_connect = dbo.getDb("finances");
    let collection = db_connect.collection("sales")
    let results = await collection.find({}).toArray();
    res.send(results).status(200);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
  
 
// This section will help you get a single record by id
recordRoutes.get("/sales/:id", async (req, res) => {
  let db_connect = dbo.getDb("finances");
  let collection = await db_connect.collection("sales");
  console.log(req.params.id)
  let query = {_id: new ObjectId(req.params.id)};
  let result = await collection.findOne(query);

  if (!result) res.send("Not found").status(404);
  else res.send(result).status(200);
});
 
// This section will help you create a new record.
recordRoutes.post("/sales/add", async (req, res) => {
  console.log(dbo)
  let db_connect = dbo.getDb("finances");
  let myobj = {
    productName: req.body.Name,
    productDescription: req.body.Description,
    price: req.body.price,
    quantity: req.body.quantity
  };
  console.log(myobj)
  let collection = await db_connect.collection("sales")
  let result= await collection.insertOne(myobj)
    res.send(result).status(200);
 });
 
// This section will help you update a record by id.
recordRoutes.patch("/sales/update/:id", async (req, res) => {
 let db_connect = dbo.getDb("finances");
 let myquery = { _id: new ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    productName: req.body.productName,
    productDescription:req.body.productDescription,
    price: req.body.price,
    quantity: req.body.quantity
   },
 };

 console.log(newvalues)
 let collection = await db_connect.collection("sales");
 let result = await collection.updateOne(myquery, newvalues);

 res.send(result).status(200);

});
 
// This section will help you delete a record
recordRoutes.delete("/sales/:id", async (req, res) => {
 let db_connect = dbo.getDb("finances");
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect.collection("sales").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   res.status(500).json({ error: 'Internal Server Error' });
 });
});
 
module.exports = recordRoutes;