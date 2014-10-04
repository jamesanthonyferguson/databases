var db = require('./db');
var serverHelpers = require('./server-helpers');
// wham! magic.
var parseData = serverHelpers.collectData;
var saveMessage = db.saveMessage;
var saveUser = db.saveUser;
var findMessages = db.findAllMessages;
var findUser = db.findUser;
var fs = require("fs");

var index = fs.readFileSync("../client/index.html");
var css = fs.readFileSync("../client/styles/styles.css");
var app = fs.readFileSync("../client/scripts/app.js");
var config = fs.readFileSync("../client/scripts/config.js");
var _ = fs.readFileSync("../client/bower_components/underscore/underscore-min.js");
var jQuery = fs.readFileSync("../client/bower_components/jquery/jquery.min.js");

exports.serveStatic = function(req, res, path, type) {
  var file = '';
  switch (path) {
    case "index":
      file = index;
      console.log(index)
      break
    case "css":
      file = css
      break
    case "app":
      file = app
      break
    case "config":
      file = config
      break
    case "_":
      file = _
      break
    case "jQuery":
      file = jQuery
      break
    }

  serverHelpers.sendResponse(res, file, 200, type)
}



exports.postMessage = function(req, res) {
  // declare this variable so we can retain access to it throughout the entire promise chain.
  var message;
  db.connect();


  var resultsCallback = function (results) {
      var chat = {
        message: message.text,
        userid: results,
        roomname: message.roomname
      };
      console.log(typeof chat.userid)

      saveMessage(chat.message, chat.userid, chat.roomname, function () {
        serverHelpers.sendResponse(res, message);
      });
  };

  parseData(req, function(_, msg) {
      message = msg;
      console.log("1st: parsing data where msg:" + msg)
      findUser(msg.username, function (err, results) {
        // no results/0 results
        if (!results || !results.length) {
          console.log('HANDLER: no results - save user')
          // create the user, then post the message
          saveUser(message.username, resultsCallback);
        } else {
          console.log('not going to trigger')
          // user exists, post the message to this user
          resultsCallback(results);
        }
      });
  });
  // db.disconnect();
};

exports.getMessages = function(req, res) {
  // db.connect()
  findMessages(function(err, messages) {
      serverHelpers.sendResponse(res, messages);
  });
  // db.disconnect();
};

exports.sendOptionsResponse = function(req, res) {
  serverHelpers.sendResponse(res, null);
};
