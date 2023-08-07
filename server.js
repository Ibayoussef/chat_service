const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 4001;

const app = express();
const server = http.createServer(app);
// Serve static files
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Apply CORS middleware
app.use(cors());

// Create an HTTP server instance

// Attach Socket.IO to the server
const io = new Server(server);

let clients = [];

// Define what happens when a client connects
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);
  clients.push(socket.id);
  io.emit("connected_clients", clients);

  // Listen for "send_message" events from clients
  socket.on("send_message", (message) => {
    io.emit("message", message);
  });

  // Listen for disconnect events
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
    clients = clients.filter((client) => client !== socket.id);
    io.emit("connected_clients", clients);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
