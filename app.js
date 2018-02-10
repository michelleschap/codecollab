// Following gist repository was used as an example to build the real-time changes for the text editor: https://gist.github.com/danopia/5424963
// Following tutorial was used to help build the chat functionality: https://socket.io/get-started/chat/

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

// starting text for the code editor
var starterBody = "public class HelloWorld {\n\tpublic static void main(String[] args) {\n\t\tSystem.out.println(\"Hello, World\");\n\t}\n}";

// listener for when a user connects
io.sockets.on("connection", socket => {
	//add user to a room named 'chatroom'
	socket.join('chatroom');
	console.log("User connected!");

	// send signal to refresh editor to client
	socket.emit('refreshEditor', {body: starterBody});

	// update body when refreshEditor is recieved
	socket.on('refreshEditor', function (body_) {
		console.log('new body');
		body = body_;
	});

	// emit editor changes to all others in chatroom
	socket.on('editorChange', function (changesObj) {
		console.log(changesObj);
		if (changesObj.origin == '+input' || changesObj.origin == 'paste' || changesObj.origin == '+delete') {
			// broadcasts chages to all other sockets in chatroom
			socket.broadcast.to('chatroom').emit('editorChange', changesObj);
			});
		};
	});

	socket.on("disconnect", () => {
		console.log("User disconnected!");
	});

  // send all users chat message
	socket.on("chat message", msg => {
		io.to('chatroom').emit("chat message", msg);
	})
});

http.listen(PORT, () => {
	console.log("Server started on port " + PORT);
});
