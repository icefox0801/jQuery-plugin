//Module Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var jade = require('jade');
var params =require('./json/build.json');
var data = require('./json/data.json');

var app = express();

//Set port, views and view engine
app.set('port', 8089);
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
	},
	page: function(req, res){
		var pageNo = req.params.pageNo;
		var jsn = {
			list: data.list.slice((pageNo - 1) * 5, pageNo * 5)
		}
		res.render('template/page.jade', jsn);
	},
	addTag: function(req, res){
		res.send({success: true});
	},
	removeTag: function(req, res){
		res.send({success: true});
	}
};

app.get('/', routes.index);
// Production
app.get('/page/:pageNo', routes.page);
app.post('/addTag', routes.addTag);
app.post('/removeTag', routes.removeTag);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
