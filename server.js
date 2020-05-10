//express
const express = require('express')
const app = express()
const port = 3000
//mongodb
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

app.get('/insertOne', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");//databaze dochazka, po pripojeni se sama vytvori
        var myobj = { name: "sub", lastname: "zero", address: "podsveti" };
        dbo.collection("users").insertOne(myobj, function (err, res) {//kolekce users se taky sama vytvori
            if (err) throw err;
            console.log("vložil jsem dokument");
            db.close();
            //res.end()
        });
    });
})


app.get('/', (req, res) => res.send('Hello Worldld!'))

app.get('/findOne', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").findOne({}, function (err, result) {//prvni parametr je dotazovaci objekt, nyni je prazdny a tim padem vybere vsechny dokumenty v kolekci, ale vrati jen jeden
            if (err) throw err;
            console.log(result.name);
            db.close();
            res.send("našel jsem " + result.name)
        });
    });
})

app.get('/find', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").find({}).toArray(function (err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            if (err) throw err;
            console.log(result);
            db.close();
            res.send("našel jsem " + result)
        });
    });
})

//prvni argument u metody find je query object a druhym je objekt projekce, to co nam bude zobrazeno
app.get('/find/projection', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").find({}, { projection: { _id: 0, name: 1 } }).toArray(function (err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            //neni dovoleno sprecifikovat 0 a 1 ve stejnem objektu, krom pole _id- Pokud zadame 0, pak vsechny ostatni maji automaticky 1 a naopak
            if (err) throw err;
            console.log(result);
            db.close();
            res.send("našel jsem " + result)
        });
    });
})

app.get('/find/query', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var query = { name: "sub" }
        // var query = { address: /^S/ }; - regularni vyraz vybere vsechny objekty s adresou zacinajici na S
        dbo.collection("users").find(query, { projection: { _id: 0, lastname: 1 } }).toArray(function (err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            //zde jsem pouzil query objekt, kde hledam jen objekty kde je name "sub"
            if (err) throw err;
            console.log(result);
            db.close();
            res.send("našel jsem " + result)
        });
    });
})

app.get('/find/sort', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var mysort = { name: 1 };//bude radit podle abecedy klice name vzsestupne, kdyz dam -1 tak sestupne
        dbo.collection("users").find().sort(mysort).toArray(function (err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            if (err) throw err;
            console.log(result);
            db.close();
            res.send("našel jsem " + result)
        });
    });
})

app.get('/find/limit', (req, res) => {//metoda limit jen redukuje pocet nalezenych objektu
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var mysort = { name: 1 };//bude radit podle abecedy klice name vzsestupne, kdyz dam -1 tak sestupne
        dbo.collection("users").find().limit(2).sort(mysort).toArray(function (err, result) {//vraci pole objektu samy jako SELECT * in MySQL.
            if (err) throw err;
            console.log(result);
            db.close();
            res.send("našel jsem " + result)
        });
    });
})

app.get('/deleteone', (req, res) => {//smaze dokument, ktery najde na zaklade query, pokud najde vic dokumentu, smaze jen ten prvni
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var myquery = { name: 'sub' };
        dbo.collection("users").deleteOne(myquery, function (err, obj) {
            if (err) throw err;
            console.log("1 document deleted");
            db.close();
        });
    });
})

// /tato metoda vraci objekt obsahujici informace o provedeni a efektu na databazi, zajmat by nas meli jen klice n a ok { n: 2, ok: 1} - smazany dva dokumenty ano
app.get('/deletemany', (req, res) => {//smaze vsechny nalezene dokumenty na zaklade query
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var myquery = { name: /^s/ };
        dbo.collection("users").deleteMany(myquery, function (err, obj) {
            if (err) throw err;
            console.log(obj.result.n + " document(s) deleted");
            db.close();
        });
    });
})

app.get('/drop', (req, res) => {//smaze kolekci
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.collection("users").drop(function (err, delOK) {//drop metoda pracuje s callbackem obsahujico error objekt a result. ktery vraci true nebo false
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
        });
    });
})

app.get('/dropCollection', (req, res) => {//smaze kolekci, hmm je to to samy
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        dbo.dropCollection("users", function (err, delOK) {//tato metoda ma dva parametry, kolekci a callback
            if (err) throw err;
            if (delOK) console.log("Collection deleted");
            db.close();
        });
    });
})

//updatuje koleci. Prvni parametr je query definujici objekt jenz se ma updatovat, kdyz najde vic objektu, tak se aplikuje jen ta prvni
//druhy parametr urcuje nove hodnoty
//updatovaci metody vraci objekt obsahujici informace o provedeni a efektu na databazi, zajmat by nas meli jen klice n a ok { n: 2, nModified: 2, ok: 1} - smazany dva dokumenty ano
app.get('/updateOne', (req, res) => {
    MongoClient.connect(url, function (err, db) {
        if (err) throw err;
        var dbo = db.db("dochazka");
        var myquery = { name: "sub" };
        var newvalues = { $set: { name: "scorpion", address: "nebe" } };
        dbo.collection("users").updateOne(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log("1 document updated");
            db.close();
        });
    });
})

app.get('/updateMany', (req, res) => {//tady to hlasi nakou chybu, tahle metoda nepremava nejak
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true }, function (err, db) {//{ useUnifiedTopology: true } kvuli hlasce deprecated, ale nepomaha
        if (err) throw err;
        var dbo = db.db("dochazka");
        var myquery = { name: "sub" };
        var newvalues = { $set: { name: "Minnie" } };
        dbo.collection("users").updateMany(myquery, newvalues, function (err, res) {
            if (err) throw err;
            console.log(res.result.nModified + " document(s) updated");
            db.close();
        });
    });
})

//https://www.w3schools.com/nodejs/nodejs_mongodb_join.asp - join kolekci sem neresil

app.get('/html', function (req, res) {
    res.sendFile('views/index.html', { root: __dirname })
});

app.post('/create', function (req, res) {
    db.users.insertOne(
        {
            name: "martin",
            age: 36
        }
    )
    res.sendFile('views/index.html', { root: __dirname })
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))