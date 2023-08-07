const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const path = require("path");

const PORT = process.env.PORT || 4001;

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Apply CORS middleware
app.use(cors());

// Create an HTTP server instance
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this to match your client's origin
  },
});

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
