var mysql = require('mysql');
/* If the node mysql module is not found on your system, you may
 * need to do an "sudo npm install -g mysql". */

/* You'll need to fill the following out with your mysql username and password.
 * database: "chat" specifies that we're using the database called
 * "chat", which we created by running schema.sql.*/
var dbConnection = mysql.createConnection({
  user: "root",
  password: "",
  database: "chatterbox"
});

exports.connect = function(){
  dbConnection.connect()
}

exports.disconnect = function(){
  dbConnection.end()
}

/* Now you can make queries to the Mysql database using the
 * dbConnection.query() method.
 * See https://github.com/felixge/node-mysql for more details about
 * using this module.*/




exports.findAllMessages = function(cb){
  var queryString = 'select * from messages;';
  // dbConnection.connect();
  dbConnection.query(queryString, function(err, rows){
    console.log(rows, "rows in find all messages");
    if (err) {
      console.log(err)
      cb(err, undefined)
    // dbConnection.end();
  } else {
      cb(err, rows)
      // dbConnection.end();
    };
  });
};

exports.findUser = function(username, cb){
  console.log("inside findUser: ")
  console.log(username, cb)
  var queryString = 'select * from messages where username = ' + username + ';';
  // dbConnection.connect();
  dbConnection.query(queryString, function(err, rows, fields) {
    console.log(rows, "rows in find user");
    if (err) {
      cb(err, undefined)
      // dbConnection.end();
    } else {
      cb(err, rows);
      // dbConnection.end();
    }
  });
};

exports.saveUser = function(username, cb){
  console.log(username)
  console.log('inside saveUser with username: ' + username);
  var queryString = 'INSERT into users (username) values ("' + username +'");';
  // dbConnection.connect();
  console.log("AM I CONNECTING?")
  dbConnection.query(queryString, function(err, result){
    console.log(result)
    if (err) {
      console.log(err, "ERR??????")
      cb(result.insertId)
      // dbConnection.end();
    } else {
      console.log("no error - user should be saved!")
      cb(result.insertId)
      // dbConnection.end();
    }
  });

};

exports.saveMessage = function(message, userid, roomname, cb){
  var queryString = 'INSERT into messages (userid, message, roomname) values (' + userid + ', "' + message + '", "' + roomname + '");';
  console.log(queryString)
  console.log("Saving message: user" + userid + "message: " + message + "room " + roomname)
  // dbConnection.connect();
  dbConnection.query(queryString, function(err, result){
    console.log(result);
    if (err) {
      console.log("YOU ACTUALLY FAILED THE PREVIOUS SPEC!" + err)
      cb()
      // dbConnection.end();
    } else {
      cb()
    // dbConnection.end();
  }
  });
};
