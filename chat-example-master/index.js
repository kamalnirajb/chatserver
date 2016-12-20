var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var sockets = {};
var users = [];
var messages = [];

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log("connected");
	
  	socket.on('login', function(userobj){
  		console.log(userobj);
    	sockets[userobj["name"]] = socket;
    	users[users.length] = userobj["name"];
    	io.emit("logged in", users);
  	});


  	// message packet: {sourceUser: "", destinationUser: "", messageBody: ""}

  	socket.on('message', function(msgpacket){
  		console.log(msgpacket);
  		if (msgpacket["destinationUser"] != "" && sockets[msgpacket["destinationUser"]] != null) {
  			sockets[msgpacket["destinationUser"]].emit("message", msgpacket);
  		}
  	});


});

http.listen(3000, function(){
  console.log('listening on *:5000');
});
