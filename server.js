const express = require('express');
const bodyParser= require('body-parser')
const MongoClient = require('mongodb').MongoClient
const app = express();

// Body parsing
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.set('view engine', 'ejs')
app.use(express.static('public'))


var db

MongoClient.connect('mongodb://localhost:27017/starwars', function(err, database) {
  if (err) return console.log(err)
  db = database
  app.listen(3000, function() {
    console.log('listening on 3000')
  })
})

app.get('/', function(req, res) {
 	db.collection('quotes').find().toArray(function(err, results) {
  res.render('index.ejs', {quotes: results})
  // send HTML file populated with quotes here
	})
})

app.post('/quotes', function(req, res) {
	  db.collection('quotes').save(req.body, function(err, result) {
    if (err) return console.log(err)
    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/quotes', function(req, res) {
	db.collection('quotes')
  .findOneAndUpdate({name: 'Sarkozy'}, {
    $set: {
      name: req.body.name,
      quote: req.body.quote
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
  	res.send(result);
  })
})
// Note: request and response are usually written as req and res respectively.

