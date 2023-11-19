const { MongoClient } = require("mongodb");
require('dotenv').config();
const Db = process.env.ATLAS_URI; // Replace with your actual connection string
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let _db;

module.exports = {
  connectToServer: function () {
    return new Promise((resolve, reject) => {
      if (_db) {
        resolve();
      } else {
        client.connect()
          .then(() => {
            _db = client.db("finances");
            console.log("Successfully connected to MongoDB.");
            resolve();
          })
          .catch((err) => {
            console.log("Error connecting to MongoDB:");
            console.log(err);
            reject(err);
          });
      }
    });
  },

  getDb: function () {
    return _db;
  },
};

