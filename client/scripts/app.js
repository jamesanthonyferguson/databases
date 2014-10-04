// YOUR CODE HERE:
var app = {
  init: function(){
    this.server = 'http://127.0.0.1:3000';
    this.fetch();
    $('#main').on('click', '.username', function(){
      // console.log(this.text())
      var username1 = $(this).text();
      app.addFriend(username1);
    });
    $('#myForm').on('submit', function(){
      event.stopPropagation();
      event.preventDefault();
      app.handleSubmit();
    });
    $('.update').on('click', function(){
      app.clearMessages();
      app.fetch();
    });
    $('.div').on('click', '.username', function(){
      console.log(this);
      app.addFriend();
    })
  },
  send: function(message){
    $.ajax({
      // always use this url
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'POST',
      data: JSON.stringify(message),
      contentType: 'application/json',
      success: function (data) {
        console.log('chatterbox: Message sent: ' + message.text);
      },
      error: function (data) {
        console.error('chatterbox: Failed to send message');
      }
    })
  },
  fetch: function(){
    $.ajax({
      // always use this url
      url: 'http://127.0.0.1:3000/classes/messages',
      type: 'GET',
      // data: {'order': '-createdAt'},
      contentType: 'json',
      success: function (data) {
        console.log('chatterbox: Message received: ' + data);
        app.addMessage(data);
      },
      error: function (data) {
        console.error('chatterbox: Failed to fetch');
      }
    })
  },

  clearMessages: function(){
    $('#chats').children().remove();
  },

  addMessage: function(data){

    var entityMap = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': '&quot;',
    "'": '&#39;',
    "/": '&#x2F;'
  };

  function escapeHtml(string) {
    return String(string).replace(/[&<>"'\/]/g, function (s) {
      return entityMap[s];
    });
  }

    for (var i = 0; i < data.results.length; i++) {
      var text = escapeHtml(data.results[i].text);
      var user = escapeHtml(data.results[i].username);
      if (app.friends.indexOf(user)!==-1) {
        user = '<strong>' + user + '</strong>'
      }
      $('#chats').append(("<div><div class='message'>" +text+ "</div><div class='username'>" +user+ "</div><br/>"))
    }
  },

  room: 'lobby',
  addRoom: function(room){
    var temp = "<div class="+room+">" +room+ "</div>";
    $('#roomSelect').append(temp);
  },
  friends: [],
  addFriend: function(friend){
    console.log("trigger1")
    if (app.friends.indexOf(friend)===-1) {
         console.log("trigger2")
      app.friends.push(friend);
    }
  },
  handleSubmit: function(){
    var messagePart = $('#myForm :input')[0].value
    var userpart = String.prototype.slice.call(window.location.search, 10)
    console.log(messagePart);
    var message = {
          username: userpart,
          text: messagePart,
          roomname: '<script>$("body").remove()</script>'
        };
    app.send(message)
  }

};
$(document).ready(function() {
    app.init();
    setInterval(function(){
      $('.update').trigger('click');
    }, 5000);
});


