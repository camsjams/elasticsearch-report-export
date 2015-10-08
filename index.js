var config = require('./ere/config'),
    http = require('http'),
    server;

function handleRequest(request, response) {
    response.end('It Works!! Path Hit: ' + request.url);
}

server = http.createServer(handleRequest);
server.listen(config.port, function () {
    console.log('ERE server listening on: http://localhost:%s', config.port);
});