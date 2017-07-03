const express = require('express');
// const data = require('./data.js');
const mustacheExpress = require('mustache-express');
const mongo = require('mongodb');
const MongoClient = require('mongodb').MongoClient, assert = require('assert');

var dbCall = function (db, callback) {
    var collection = db.collection('users').find().toArray(function (err, result) {
        callback(result);
    })
};


const app = express();



app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');

app.use('/public', express.static('./public'));

app.get('/', function (req, res) {
    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        assert.equal(err, null);
        dbCall(db, function (result) {
            res.render('index', { users: result });
        })
    })
});

app.get('/employed', function (req, res) {
    
    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        db.collection('users').find({job: {$ne: null}}).toArray(function (err, result) {
            res.render('index', { users: result });
        })
    })
});

app.get('/available', function (req, res) {
    
    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        db.collection('users').find({ job : null }).toArray(function (err, result) {
            res.render('index', { users: result });
        })
    })
});

app.get('/:id', function (req, res) {
    var id = parseInt(req.params.id);
    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        db.collection('users').find({ id: id }).toArray(function (err, result) {
            res.render('single', result[0]);
        })
    })
});


app.listen(3000, 'localhost');