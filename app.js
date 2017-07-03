const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
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
app.use(bodyParser.urlencoded());

app.get('/', function (req, res) {
    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        assert.equal(err, null);
        dbCall(db, function (result) {
            var model = {users: result};
            var countries = [];
            for (i = 0; i < model.users.length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                }
            }   
            res.render('index', { users: result , countries: countries}); 
        })
    })
});

app.post('/country', function (req, res) {
    var country = req.body.country;
    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        db.collection('users').find({ "address.country": country }).toArray(function (err, result) {
            var model = {users: result};
            var countries = [];
            for (i = 0; i < model.users.length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                }
            }
            res.render('index', { users: result, countries: countries });
        })
    })
});

app.get('/employed', function (req, res) {

    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        db.collection('users').find({ job: { $ne: null } }).toArray(function (err, result) {
            var model = {users: result};
            var countries = [];
            for (i = 0; i < model.users.length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                }
            }
            res.render('index', { users: result, countries: countries });
        })
    })
});

app.get('/available', function (req, res) {

    MongoClient.connect('mongodb://localhost:27017/robots', function (err, db) {
        db.collection('users').find({ job: null }).toArray(function (err, result) {
            var model = {users: result};
            var countries = [];
            for (i = 0; i < model.users.length; i++) {
                if (countries.indexOf(model.users[i].address.country) === -1) {
                    countries.push(model.users[i].address.country);
                }
            }
            res.render('index', { users: result, countries: countries });
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