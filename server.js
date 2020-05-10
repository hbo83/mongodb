//express
const express = require('express')
const app = express()
const port = 3000
//mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/insertOne', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");//databaze dochazka, po pripojeni se sama vytvori
        var myobj = { name: "sub", lastname: "zero", address: "podsveti" };
        dbo.collection("users").insertOne(myobj, function(err, res) {//kolekce users se taky sama vytvori
          if (err) throw err;
          console.log("vložil jsem dokument");
          db.close();
         //res.end()
        });
      });
})


app.get('/', (req, res) => res.send('Hello Worldld!'))

app.get('/findOne', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").findOne({}, function(err, result) {//prvni parametr je dotazovaci objekt, nyni je prazdny a tim padem vybere vsechny dokumenty v kolekci, ale vrati jen jeden
          if (err) throw err;
          console.log(result.name);
          db.close();
          res.send("našel jsem " + result.name)
        });
      });
})

app.get('/find', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").find({}).toArray(function(err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
          if (err) throw err;
          console.log(result);
          db.close();
          res.send("našel jsem " + result)
        });
      });
})

//prvni argument u metody find je query object a druhym je objekt projekce, to co nam bude zobrazeno
app.get('/find/projection', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").find({}, { projection: { _id: 0, name: 1 }}).toArray(function(err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            //neni dovoleno sprecifikovat 0 a 1 ve stejnem objektu, krom pole _id- Pokud zadame 0, pak vsechny ostatni maji automaticky 1 a naopak
          if (err) throw err;
          console.log(result);
          db.close();
          res.send("našel jsem " + result)
        });
      });
})

app.get('/find/query', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var query = { name: "sub"}
        dbo.collection("users").find(query, { projection: { _id: 0, lastname: 1 }}).toArray(function(err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            //zde jsem pouzil query objekt, kde hledam jen objekty kde je name "sub"
          if (err) throw err;
          console.log(result);
          db.close();
          res.send("našel jsem " + result)
        });
      });
})

app.get('/html', function(req, res) {
    res.sendFile('views/index.html', {root: __dirname })
});

app.post('/create', function(req, res) {
    db.users.insertOne(
        {
            name: "martin",
            age: 36
        }
    )
    res.sendFile('views/index.html', {root: __dirname })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))