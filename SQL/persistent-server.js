
/* You already know how to create an http server from the previous
 * assignment; you can re-use most of that code here. */

var http = require("http");
var url = require('url');

var handlers = require('./request-handler');
var serverHelpers = require('./server-helpers');

var port = 3000;
var ip = "127.0.0.1";
 var usernameParam = new RegExp("\/\?username=[a-zA-Z0-9]*");

var router = function(req, res) {

  var path = url.parse(req.url).pathname;
  var method = req.method;

  console.log("%s -- %s", method, path);

  if (path === '/classes/messages') {
    if (method === 'POST') {
      handlers.postMessage(req, res);
    } else if (method === 'GET') {
      handlers.getMessages(req, res);
    } else if (method === 'OPTIONS') {
      handlers.sendOptionsResponse(req, res);
    }
  } else if (method === "GET" && path === "/"){
    handlers.serveStatic(req, res, "index", "text/html")
  } else if (method === "GET" && usernameParam.test(path)){
    handlers.serveStatic(req, res, "index", "text/html")
  } else if (method === "GET" && path === "/client/scripts/app.js"){
    handlers.serveStatic(req, res, "app", "application/javascript")
  } else if (method === "GET" && path === "/client/scripts/config.js"){
    handlers.serveStatic(req, res, "config", "application/javascript")
  } else if (method === "GET" && path === "/client/bower_components/underscore/underscore-min.js"){
    handlers.serveStatic(req, res, "_", "application/javascript")
  } else if (method === "GET" && path === "/client/bower_components/jquery/jquery.min.js"){
    handlers.serveStatic(req, res, "jQuery", "application/javascript")
  } else if (method === "GET" && path === "/client/styles/styles.css") {
    handlers.serveStatic(req, res, "css", "text/css")
  } else {
    serverHelpers.sendResponse(res, '', 404);
  }
};

var server = http.createServer(router);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

