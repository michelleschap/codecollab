const express = require("express");
const path = require("path");
const socketio = require("socket.io");

const app = express();
const http = require("http").Server(app);
const io = socketio(http);

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
	//console.log("someone visited from the web");
	res.sendFile(__dirname+"/index.html");
});


var socks = [];
var starterBody = "public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";

io.sockets.on("connection", socket => {
	console.log("User connected!");
  // add new users socket to socket list
  socks.push(socket);
	// send signal to refresh editor to client
	socket.emit('refreshEditor', {body: starterBody});

	// update body when refreshEditor is recieved
	socket.on('refreshEditor', function (body_) {
		console.log('new body');
		body = body_;
	});

	// emit editor changes to all other sockets
	socket.on('editorChange', function (changesObj) {
		console.log(changesObj);
		if (changesObj.origin == '+input' || changesObj.origin == 'paste' || changesObj.origin == '+delete') {
			socks.forEach(function (sock) {
				if (sock != socket)
					sock.emit('editorChange', changesObj);
			});
		};
	});

	socket.on("disconnect", () => {
		console.log("User disconnected!");
	});

  // send users chat message
	socket.on("chat message", msg => {
		io.emit("chat message", msg);
	})
});

http.listen(PORT, () => {
	console.log("Server started on port " + PORT);
});

























// var app = require('http').createServer(handler),
//     io = require('socket.io').listen(app),
//     fs = require('fs');
//
// app.listen(3000);
//
// function handler (req, res) {
//   fs.readFile(__dirname + '/index.html',
//   function (err, data) {
//     if (err) {
//       res.writeHead(500);
//       return res.end('Error loading index.html');
//     }
//
//     res.writeHead(200);
//     res.end(data);
//   });
// }
//
// var socks = [];
// var body = "public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";
// io.sockets.on('connection', function (socket) {
//   socks.push(socket);
//   socket.emit('refresh', {body: body});
//
//   socket.on('refresh', function (body_) {
//     console.log('new body');
//     body = body_;
//   });
//
//   socket.on('change', function (op) {
//     console.log(op);
//     if (op.origin == '+input' || op.origin == 'paste' || op.origin == '+delete') {
//       socks.forEach(function (sock) {
//         if (sock != socket)
//           sock.emit('change', op);
//       });
//     };
//   });
// });
