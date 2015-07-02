var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var swig = require('swig');
var mongoose = require('mongoose');

var config = require('./config.json').server;
var hostname = process.env.HOSTNAME || config.node.hostname;
var port = process.env.PORT || config.node.port;
var app = express();

if (process.env.NODE_ENV !== 'production') {
  swig.setDefaults({ cache: false });
}

app.set('hostname', hostname);
app.set('port', port);
app.engine('html', swig.renderFile);
app.set('views', path.join(__dirname, 'server/views'));
app.set('view engine', 'html');
// http://stackoverflow.com/a/19965089
app.use(bodyParser.json({ limit: '500mb' }));
app.use(bodyParser.urlencoded({
  extended: true,
  limit: '500mb'
}));

app.use(express.static(path.join(__dirname, 'public')));

// Set our own x-powered-by header
app.use(function (req, res, next) {
  res.header('X-Powered-By', 'Blood, sweat, and tears');
  res.header('X-Clacks-Overhead', 'GNU Terry Pratchett');
  next();
});

require('./routes')(app);
//require('./error')(app);

module.exports = function (callback) {
  var db;

  mongoose.connect(
    'mongodb://' + config.mongodb.hostname + ':' + config.mongodb.port + '/' + config.mongodb.collection
  );

  db = mongoose.connection;

  db.on('error', function (error) {
    console.error('Mongo ' + error);
    callback(error);
  });

  db.once('open', function () {
    app.listen(port, hostname);
    callback(null, app);
  });
};
