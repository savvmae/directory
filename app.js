const express = require('express');
const data = require('./data.js');
const mustacheExpress = require('mustache-express');

const app = express();



app.engine('mustache', mustacheExpress());
app.set('views', './views');
app.set('view engine', 'mustache');



app.use('/public', express.static('./public'));
app.get('/', function(req, res){
    res.render('index', data );
});

 app.get('/:id', function(req, res) {
    var id = parseInt(req.params.id);
    var singleRobot = data.users.filter(function(obj, index){
        if(obj.id === id){
            return true
        }else {
            return false
        }
    })

    res.render('single', singleRobot[0]);
  });

app.listen(3000, 'localhost');