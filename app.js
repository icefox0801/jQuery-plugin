//Module Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var jade = require('jade');
var params =require('./json/build.json');

var app = express();

//Set port, views and view engine
app.set('port', 3000);
app.set('views', path.join(__dirname, 'demo/'));
app.set('view engine', 'jade');
//app.use(express.favicon());
//app.use(express.logger('dev'));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(express.logger());
app.use(app.router);
app.use(express.static('demo/', __dirname, 'demo/'));

var routes = {
	index: function(req, res){

		res.render('index.jade', params);
		console.log(__dirname);
	}
};

app.get('/', routes.index);

http.createServer(app).listen('3000', function(){
  console.log('Express server listening on port ' + app.get('port'));
});
