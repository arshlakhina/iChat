// Node Server which will handle socket io connections
// import server from "../../server";
const http = require('http');
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

app.use(express.static('public'))

// app.get('/chat', (req, res) => {
//   res.sendFile(__dirname + '/public/index.html');
// })

const io = require("socket.io")(server);
const users = {};

io.on("connection", (socket) => {
  socket.on("new-user-joined", (name) => {
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", (message) => {
    socket.broadcast.emit("receive", {
      message: message,
      name: users[socket.id],
    });
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("leave", users[socket.id]);
    delete users[socket.id];
  });
});


server.listen(PORT, () => {
  console.log("Server listening on port", PORT);
})