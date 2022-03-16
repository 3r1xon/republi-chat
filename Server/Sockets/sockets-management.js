const express = require('express');
const { io }  = require('../start');
const DBUser  = require('../Authentication/db-user');
const router  = express.Router();


io.on("connection", (socket) => {

    const userID = socket.auth._id;

    const user = new DBUser(userID);

    let room;

    let channel;

    socket.on("joinRoom", async (obj) => {

      const rqRoom = obj.room;
      const rqChannel = obj.channel;

      socket.leave(`rm${room}`);

      if (user.roomMemberID)
        await user.unwatch();

      user.setChannel(rqChannel, (chErr) => {
        if (chErr) {
          console.log(clc.yellow(chErr));
        } else {
          socket.leave(`ch${channel}`);

          socket.join(`ch${rqChannel}`);
          user.setLastJoinedChannel();

          user.setRoom(rqRoom, async (roomErr) => {
            if (roomErr) {
              console.log(clc.yellow(roomErr));
            } else {

              socket.join(`rm${rqRoom}`);
              room = rqRoom;
              user.watch();
              user.setLastJoinedRoom();
              console.log(socket.rooms);
            }
          });
        }
      });
    });

    socket.on("message", (msg) => {

      user.sendMessage(msg);

    });

    socket.on("deleteMessage", (msgID) => {

      user.deleteMessage(msgID);

    });

    socket.on("highlightMessage", (msgID) => {

      user.highlightMessage(msgID);

    });

    socket.on("disconnect", async () => {
      if (user.roomMemberID)
        await user.unwatch();
    });

  });


module.exports = router;