var parseUrl = require('url').parse;
var fs = require('fs');

var readFileSync = function(){
  return JSON.parse(fs.readFileSync('messages'));
};
var idCounter = 0;
var messageStore = readFileSync();

var writeFile = function(data){
  fs.writeFile('messages', JSON.stringify(data), function(err){
    if(err){
      throw err;
    }
    console.log("Saved!");
  });
};


var getResultJSON = function(filters) {
  var result = {};
  var messages = messageStore;

  result.results = messages;

  return JSON.stringify(result);
};

var postMessage = function(data){
  var message = JSON.parse(data);
  message.objectId = idCounter++;
  message.createdAt = new Date().toISOString();
  message.updatedAt = new Date().toISOString();
  messageStore.push(message);
  writeFile(messageStore);
};

var handleRequest = function(request, response) {
  var pathname = parseUrl(request.url).pathname.split('/').slice(1);
  var body = '';
  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "application/json";

  request.on('data', function(data){
    body += data;
  });

  request.on('end', function(){

    if (pathname[0] === 'log') {
      response.writeHead(200, headers);
      response.end(JSON.stringify({a: 1}));
    }

    if (pathname[0] === 'classes' && (pathname[1] === 'messages')) {
      if (request.method === 'GET' || request.method === 'OPTIONS') {
        response.writeHead(200, headers);
        var res = getResultJSON();
        response.end(res);
      } else if (request.method === 'OPTIONS') {
        response.writeHead(200, headers);
        response.end();
      } else if (request.method === 'POST') {
        postMessage(body);
        response.writeHead(201, headers);
        response.end(JSON.stringify(null));
      }
    } else {
      response.writeHead(404, headers);
      response.end();
    }

  });
};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "X-Parse-REST-API-Key, X-Parse-Application-Id, content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = handleRequest;
