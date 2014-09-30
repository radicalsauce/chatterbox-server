var parseUrl = require('url').parse;

var idCounter = 0;
var messageStore = [
  {
    id: idCounter++,
    username: 'Bob',
    text: 'Hello world',
    createdAt: '2014-09-29T22:35:20.481Z',
    updatedAt: '2014-09-29T22:35:20.481Z'
  }
];

var filterMessages = function(messages, filters) {
  filters = JSON.parse(filters);
  for (var prop in filters) {
    if (filters[prop]['$gt']) {
      if (filters[prop]['$gt']['__type'] && filters[prop]['$gt']['iso'])
      messages = messages.filter(function(message){
        if (Date(message.updatedAt)) {

        }
      })
    }
  }
  return messages;
}

var orderMessages = function(messages, order) {
  var reverse = false;
  if (order.charAt(0) === '-') {
    reverse = true;
    order.shift();
  }
  return messages.sort(function(a,b){
  });
}

var getMessages = function(filters) {
  var messages = messageStore;

  console.log(filters);

  // if (filters.where) {
  //   messages = filterMessages(messages, filters.where);
  // }

  // if (filters.order) {
  //   messages = orderMessages(messages, filters.order);
  // }

  return messages;
}

var handleRequest = function(request, response) {
  var pathParts = parseUrl(request.url).pathname.split('/');
  var error = '';

  var headers = defaultCorsHeaders;
  headers['Content-Type'] = "text/json";

  // Reject the request if the URL is not the one we're looking for
  if (pathParts[1] !== '1' || pathParts[2] !== 'classes' || pathParts[3] !== 'chatterbox') {
    response.writeHead(404, headers);
    return response.end();
  }

  if (request.method === 'GET') {
    response.writeHead(200, headers);
    response.end(JSON.stringify(getMessages(parseUrl(request.url, true).query)));
  }

};

var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

module.exports = handleRequest;
