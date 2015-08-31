var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var fs = require('fs');
var mongodb = require('mongodb');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/bower_components", express.static(__dirname + "/src/bower_components"));
app.use("/stylesheets", express.static(__dirname + "/src/stylesheets"));
app.use("/js", express.static(__dirname + "/src/js"));
app.use("/app", express.static(__dirname + "/src/app"));
app.use("/images", express.static(__dirname + "/src/images"));

var raw_credentials = fs.readFileSync('db_scripts/credentials.json', 'utf8');
var credentials = JSON.parse(raw_credentials);
var uri = credentials.MongoUrl;

app.get('/', function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
})

app.post('/data', function(req, res) {
  var id = req.body.id;
  var region = req.body.region;
  var patch = req.body.patch;
  mongodb.MongoClient.connect(uri, function(err, db) {
    if (err) throw err;
    var cursor = db.collection(region + "-ranked-" + patch).find( { "id": id } );
    cursor.each(function(err, doc) {
      if (err) throw err;
      if(doc != null) {
        db.close();
        res.json(doc);
      }
    });
  });
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.sendFile(__dirname + '/views/error.html')
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.sendFile(__dirname + '/views/error.html')
});


module.exports = app;
