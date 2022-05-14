const express    = require('express');
const { io }     = require('../start');
const DBUser     = require('../Authentication/db-user');
const userStatus = require('../Authentication/user-status');
const clc        = require('cli-color');
const router     = express.Router();


io.on("connection", async (socket) => {

  const userID = socket.auth._id;

  const user = new DBUser(userID);

  socket.join(`user${userID}`);

  await user.ready();

  user.setUserStatus(userStatus.online);

  let textRoom;

  let vocalRoom;

  let channel;

  socket.on("joinTextRoom", async (obj) => {

    const rqRoom = obj.room;
    const rqChannel = obj.channel;

    socket.leave(`rm${textRoom}`);

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
            textRoom = rqRoom;
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

  socket.on("banUser", (userID) => {

    user.banMember(userID);

  });

  socket.on("kick", (userID) => {

    user.kickMember(userID);

  });


  socket.on("changePermission", (obj) => {

    console.log(obj);
    io.to(`ch${obj.channelID}`).emit("channel", {
      emitType: "CHANGE_PERMISSION",
      permission: obj.permission
    });

  });

  socket.on("userChanges", (change) => {

    switch(change.emitType) {

      case "STATUS_CHANGE": {

        user.setUserStatus(change.status, true);

      } break;

    }

  });

  socket.on("disconnect", async () => {
    if (user.roomMemberID)
      await user.unwatch();

    user.setUserStatus(userStatus.offline);

  });



  // Vocal
  // socket.on("joinVocalRoom", async (obj) => {

  //   socket.leave(`vocalRm${vocalRoom}`);

  //   vocalRoom = obj.room;

  //   socket.join(`vocalRm${obj.room}`);

  // });

  // socket.on("voice", (audio) => {

  //   console.log(audio);
  //   io.to(`vocalRm${vocalRoom}`).emit("voice", audio);

  // });

});


module.exports = router;