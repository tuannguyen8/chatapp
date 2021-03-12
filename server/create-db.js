var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");

    //Create collection
  var dbo = db.db("mydb");
  /*
  dbo.createCollection("users", function(err, res) {
        if (err) throw err;
        console.log("User Collection created!");
    })

    dbo.createCollection("userhistory", function(err, res) {
        if (err) throw err;
        console.log("User Collection created!");
    })

    dbo.createCollection("rooms", function(err, res) {
        if (err) throw err;
        console.log("Room Collection created!");
   })

   dbo.createCollection("userroom", function(err, res) {
    if (err) throw err;
    console.log("Userroom Collection created!");
    })
    
    
    dbo.createCollection("broadcast", function(err, res) {
        if (err) throw err;
        console.log("Broadcast Collection created!");
        })

    */
    dbo.createCollection("usercontact", function(err, res) {
        if (err) throw err;
        console.log("UserContact Collection created!");
        })

  db.close();

});