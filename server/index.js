import express from 'express'
import dbConnection from './database/db.js';
import dotenv from 'dotenv';
import Router from './routes/route.js';
import cors from 'cors';
import bodyParser from 'body-parser';
import { Server } from 'socket.io';
dotenv.config();

const app = express();
app.use('/payment/post/update', express.raw({ type: 'application/json' }));
app.use(bodyParser.json({extended:true}))
app.use(bodyParser.urlencoded({extended:true}))
app.use(cors());
app.use(cors({
  origin: 'https://my-guru.vercel.app',
      methods: ['GET', 'POST', 'DELETE'],
}));
app.get('/', (req, res) => {
  res.send('hello')
})




const PORT = process.env.PORT || 8000;
const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;
const server = app.listen(PORT, () => console.log(`server is running on port ${PORT}`));
const io = new Server(server, {
    cors: {
      origin: 'https://my-guru.vercel.app',
      methods: ['GET', 'POST', 'DELETE'],
    },
  });

  io.on('connection', (socket) => {
    console.log('new socket')
      socket.on('forceDisconnect', function() {
        console.log(socket.id)
          
          socket.disconnect()
          console.log('Client disconnected'+socket.id);
      });
  
      socket.on("joinroom", (room) => {
          socket.room = room
          socket.join(room);
          console.log("User Joined Room: " + room);
          console.log('socket id is' + socket.id)
          
      });
      socket.on('send', function(msg){
        
        console.log(msg.msg)
        io.to(socket.room).emit('receive', msg);
      });
     
  });
dbConnection(USERNAME, PASSWORD);