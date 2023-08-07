const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const PORT = process.env.PORT || 4001;

const app = express();

// Apply CORS middleware to enable cross-origin requests
app.use(cors());

// Create an HTTP server instance
const server = http.createServer(app);

// Attach Socket.IO to the server
const io = socketIo(server, {
  cors: {
    origin: "*", // Adjust this to match your client' s origin
  },
});

// Define what happens when a client connects
io.on("connection", (socket) => {
  console.log("New client connected: ", socket.id);

  // Listen for "send_message" events from clients
  socket.on("send_message", (message) => {
    // Broadcast the message to all connected clients
    io.emit("message", message);
  });

  // Listen for disconnect events
  socket.on("disconnect", () => {
    console.log("Client disconnected: ", socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});