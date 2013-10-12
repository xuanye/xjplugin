
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var sample = require('./routes/sample');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
//app.use(express.favicon(__dirname +"/static/favicon.png"));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'static')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.get('/:action',function(req, res, next){
	  if(routes[req.params.action])
	  {
	    routes[req.params.action](req, res, next);
	  }
	  else
	  {
	    res.status(404);
	    res.end();
	  }
});
app.get('/sample/:action', function(req, res, next){	
	if(sample[req.params.action])
	{
	   sample[req.params.action](req, res, next);
	}
	else
	{
	   res.status(404);
	   res.end();
	}
});
app.post('/sample/:action', function(req, res, next){
	var postAction = "do" + req.params.action;
	if(sample[postAction])
	{
	   sample[postAction](req, res, next);
	}
	else
	{
	   res.status(404);
	   res.end();
	}
});



http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
