const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: true, // Aktualizuj to zgodnie z adresem, z którego korzystasz
    methods: ["GET", "POST"],
    credentials: true
  }
});

const port = 4000;

// Uruchamianie serwera HTTP
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });

// Konfiguracja Socket.IO

const userIo = io.of('/user');

userIo.on('connection', (socket) => {
  //console.log("connected as: " + socket.username);
});

userIo.use((socket, next) => {
  if (socket.handshake.auth.token) {
    socket.username = getUsernameFromToken(socket.handshake.auth.token);
    next();
  } else {
    next(new Error("Please send token"));
  }
});

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.on('send-message', (message, room) => {
    if (room === '') {
      socket.broadcast.emit('receive-message', message);
    } else {
      socket.to(room).emit('receive-message', message);
    }
  });

  socket.on('join-room', (room, cb) => {
    socket.join(room);
    cb(`Joined ${room}`);
  });

  socket.on('ping', (n) => console.log(n));
});

// Konfiguracja Express

const __dirname1 = path.resolve();

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname1, "/client/start")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "client", "start", "apitest.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is Running Successfully");
  });
}


