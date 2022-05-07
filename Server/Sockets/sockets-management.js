const express    = require('express');
const { io }     = require('../start');
const DBUser     = require('../Authentication/db-user');
const userStatus = require('../Authentication/user-status');
const clc        = require('cli-color');
const router     = express.Router();


io.on("connection", (socket) => {

  const userID = socket.auth._id;

  const user = new DBUser(userID);
  socket.join(`user${userID}`);

  user.setUserStatus(userStatus.online);

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

  socket.on("banUser", (memberID) => {

    user.banMember(memberID);

  });

  socket.on("userChanges", (change) => {

    switch(change.emitType) {

      case "STATUS_CHANGE": {

        user.setUserStatus(change.status, true);

      } break;

    }

  })


  socket.on("disconnect", async () => {
    if (user.roomMemberID)
      await user.unwatch();

    user.setUserStatus(userStatus.offline);

  });

});


module.exports = router;