/* Import node's http module: */
var handleRequest = require('./request-handler.js');
var express = require('express');
var app = express();

app.all('/classes/messages', function(req, res){
  handleRequest(req, res);
});

app.use(express.static('../client'));

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
