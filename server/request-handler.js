/* You should implement your request handler function in this file.
 * And hey! This is already getting passed to http.createServer()
 * in basic-server.js. But it won't work as is.
 * You'll have to figure out a way to export this function from
 * this file and include it in basic-server.js so that it actually works.
 * *Hint* Check out the node module documentation at http://nodejs.org/api/modules.html. */
var fs = require("fs");
var mysql = require('mysql')
// var app = require("../client/scripts/app.js");
// var config = require("../client/scripts/app.js");
var index = fs.readFileSync("../client/index.html");
var css = fs.readFileSync("../client/styles/styles.css");
var app = fs.readFileSync("../client/scripts/app.js");
var config = fs.readFileSync("../client/scripts/config.js");
var _ = fs.readFileSync("../client/bower_components/underscore/underscore-min.js");
var jQuery = fs.readFileSync("../client/bower_components/jquery/jquery.min.js");

var dataStorage = {results: []};
var roomStorage = {results: []};



//Read messages from .txt file
fs.readFile("./messageData.txt", "utf-8", function(err,fileData){
  if (err) {console.log("error loading saved messags");}
  var savedMessages = fileData.split("_-_");
  savedMessages.pop()
  for (var i = 0; i < savedMessages.length; i++) {
    dataStorage.results.push(JSON.parse(savedMessages[i]))
  }
})

var handleRequest = function(request, response) {
  /* the 'request' argument comes from nodes http module. It includes info about the
  request - such as what URL the browser is requesting. */

  /* Documentation for both request and response can be found at
   * http://nodemanual.org/0.8.14/nodejs_ref_guide/http.html */

  console.log("Serving request type " + request.method + " for url " + request.url);

  var statusCode = [200,201,404];


  /* Without this line, this server wouldn't work. See the note
   * below about CORS. */
  var headers = defaultCorsHeaders;

  var usernameParam = new RegExp("\/\?username=[a-zA-Z0-9]*");


  /* .writeHead() tells our server what HTTP status code to send back */
  // response.writeHead(statusCode, headers);
  //
  if (request.method === "OPTIONS") {
    response.writeHead(statusCode[0],headers);
    headers['Content-Type'] = "text/plain";
    response.end();
  }

  if (request.method === "GET" && request.url === "/client/styles/styles.css"){
    headers["Content-Type"] = "text/css";
    response.writeHead(statusCode[0],headers);
    response.write(css);
    response.end();
  }

  //Serve files from server
  if (request.method === "GET" && request.url === "/"){
    headers["Content-Type"] = "text/html";
    response.writeHead(statusCode[0],headers);
    response.write(index);
    response.end();

  }
  if (request.method === "GET" && usernameParam.test(request.url)){
    console.log("IMPORTANT I AM BEING TRIGGERED")
    headers["Content-Type"] = "text/html";
    response.writeHead(statusCode[0],headers);
    response.write(index);
    response.end();

  }
  if (request.method === "GET" && request.url === "/client/scripts/app.js"){
    headers["Content-Type"] = "application/javascript";
    response.writeHead(statusCode[0],headers);
    response.write(app);
    response.end();
  }
  if (request.method === "GET" && request.url === "/client/scripts/config.js"){
    headers["Content-Type"] = "application/javascript";
    response.writeHead(statusCode[0],headers);
    response.write(config);
    response.end();
  }

  if (request.method === "GET" && request.url === "/client/bower_components/underscore/underscore-min.js"){
    headers["Content-Type"] = "application/javascript";
    response.writeHead(statusCode[0],headers);
    response.write(_);
    response.end();
  }

  if (request.method === "GET" && request.url === "/client/bower_components/jquery/jquery.min.js"){
    headers["Content-Type"] = "application/javascript";
    response.writeHead(statusCode[0],headers);
    response.write(jQuery);
    response.end();
  }


//Stop serving files


  if (request.method === "GET" && request.url === "/classes/messages") {
    headers["Content-Type"] = "application/json";
    response.writeHead(statusCode[0], headers);
    response.write(JSON.stringify(dataStorage));
    response.end();
  }
  if (request.method === "GET" && request.url === "/classes/room1") {
    headers["Content-Type"] = "application/json";
    response.writeHead(statusCode[0], headers);
    console.log("IMPORTANT:" + JSON.stringify(roomStorage));
    response.end(JSON.stringify(roomStorage));
  }
  /* Make sure to always call response.end() - Node will not send
   * anything back to the client until you do. The string you pass to
   * response.end() will be the body of the response - i.e. what shows
   * up in the browser.*/
  if (request.method === "POST" && request.url === "/classes/messages") {
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode[1], headers);
    var message = ""
    request.on('data', function(data){
      message += data;
      dataStorage.results.push(JSON.parse(data));
      fs.appendFile("./messageData.txt", data + '_-_',function(err) {
        if (err) {console.log('error appending message data to file')}
      })
    });
    // request.on('end', function(message){
    //   dbConnection.connect();
    //   message = JSON.parse(message);
    //   var queryArgs = [message.username, message.text, message.roomname];
    //   var queryString = 'insert into messages (username, text, roomname) values (' +
    //     queryArgs[0] + ', ' + queryArgs[1] + ', ' + queryArgs[2] + ');';
    //   dbConnection.query(queryString, function(err){
    //     if (err) throw err;
    //   });
      //split up message into three data parts.
      //pass into correct table.
    // })
    response.end();
  }
  if (request.method === "POST" && request.url === "/classes/room1") {
    headers['Content-Type'] = "text/plain";
    response.writeHead(statusCode[1], headers);
    request.on('data', function(data){
      roomStorage.results.push(JSON.parse(data));
    });
    response.end();
  }
    // response.write(JSON.stringify(data));
    //
  else if (!(request.url === "/classes/messages" || request.url === "/classes/room1" )) {
    response.writeHead(statusCode[2], headers);
    response.end();
  }

  // response.end();
};

/* These headers will allow Cross-Origin Resource Sharing (CORS).
 * This CRUCIAL code allows this server to talk to websites that
 * are on different domains. (Your chat client is running from a url
 * like file://your/chat/client/index.html, which is considered a
 * different domain.) */
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

exports.handler = handleRequest;
