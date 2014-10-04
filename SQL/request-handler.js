var db = require('./db');
var serverHelpers = require('./server-helpers');
// wham! magic.
var parseData = serverHelpers.collectData;
var saveMessage = db.saveMessage;
var saveUser = db.saveUser;
var findMessages = db.findAllMessages;
var findUser = db.findUser;


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
