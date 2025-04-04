// utils/socket.js
import { Server } from 'socket.io';

const socketIo = (server) => {
  const io = new Server(server);
  
  io.on('connection', (socket) => {
    console.log('a user connected');
    
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};

export default socketIo;
