const bodyParser = require('body-parser');
var express = require('express');
var app = express();
var urlencodedParser = bodyParser.urlencoded({extended: false});

// log info on user
app.use((req, res, next) => {
  console.log(req.method + " " + req.path +" - " + req.ip);
  next();
});

// attach css
app.use('/public', express.static(__dirname + "/public"));

// instantiate body parser
app.use(urlencodedParser);

// '/' route - returns an html page
app.get('/', ( req, res, next) => {
  res.sendFile(__dirname + "/views/index.html");
});

// '/json' route - returns a json
app.get('/json', (req, res) => {
  if(process.env.MESSAGE_STYLE == "uppercase") {
    res.json({
      "message": "HELLO JSON"
      });
  }
  else {
    res.json({
      "message": "Hello json"
      });
  }
});

// '/now' route - links middleware to main function
app.get('/now', (req, res, next) => {
  req.time = new Date().toString();
  console.log(req.time);
  next();
}, (req, res) => {
  res.json({
    time: req.time
  })
});

// /:word/echo route - :word is a paramater taken from the url and passed into this middleware
app.get('/:word/echo', (req, res) => {
  res.json({echo: req.params.word});
})

// '/name' route - parses query string for data
app.route('/name').get((req, res) => {
  res.json({
    name: req.query.first + ' ' + req.query.last
    })
}).post(urlencodedParser, (req, res) => {
  res.json({
    name: req.body.first + ' ' + req.body.last
    })
});

 module.exports = app;
