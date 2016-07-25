var express = require('express');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
dotenv.load();

var users = require('./routes/users');
var theBoard = require('./routes/theBoard');
var api = require("./routes/api");

// MVPlus
// var knowledge = require('./routes/knowledge');
// var leaderboards = require('./routes/leaderboards');
// var tribes = require('./routes/tribes');

var app = express();

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(__dirname + "/public"));

app.use('/users', users);
app.use('/theboard', theBoard);
app.use("/api", api);

app.use("*", (req, res) => res.sendFile(__dirname + "/pubic/index.html"));

// MVPlus
// app.use('/knowledge', knowledge);
// app.use('/leaderboards', leaderboards);
// app.use('/tribes', tribes);

// Error Handling
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {message: err.message, error: err});
});

app.listen(process.env.PORT || 3000);