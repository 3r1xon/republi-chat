const REPQuery      = require('../Database/rep-query');
const REPTools      = require('../Tools/rep-tools');
const permissions   = require('./permissions');
const userStatus    = require('./user-status');
const { msgSchema } = require('../Tools/schemas');
const { io }        = require('../start');



const nocb = () => { };



class DBUser {

  constructor(userID) {
    this.userID = userID;
  }

  userID;

  channelID;
  channelMemberID;
  channelJoinDate;
  channelPermissions;

  roomID;
  roomMemberID;
  roomJoinDate;


  async setChannel(channel, callback = nocb) {

    try {

      const channelUser = await REPQuery.one(
      `
      SELECT CM.ID_CHANNEL_MEMBER as channelMemberID,
             CM.JOIN_DATE         as joinDate
      FROM CHANNELS_MEMBERS CM
      WHERE CM.ID_CHANNEL = ?
        AND CM.ID_USER = ?
        AND CM.BANNED = ?
        AND CM.KICKED = ?
      `, [channel, this.userID, false, false]);

      if (channelUser) {
        this.channelID = channel;

        this.channelMemberID = channelUser.channelMemberID;
        this.channelJoinDate = channelUser.joinDate;

        callback(null, this);

        return this;
      }
      else
        callback(new Error("User is not a member of this channel!"), null);
    } catch(err) {
      callback(err, null);
    }
  }



  async setRoom(roomID, callback = nocb) {

    if (this.channelID == undefined)
      return callback(new Error("Channel is not set. Did you call setChannel?"), null);

    try {

      const roomMember = await REPQuery.one(
      `
      SELECT CRM.ID_CHANNEL_ROOM_MEMBER as roomMemberID,
             CRM.JOIN_DATE              as joinDate
      FROM CHANNELS_ROOMS_MEMBERS CRM
      WHERE CRM.ID_CHANNEL_ROOM = ?
        AND CRM.ID_CHANNEL_MEMBER = ?
      `, [roomID, this.channelMemberID]);

      if (roomMember) {
        this.roomID = roomID;

        this.roomMemberID = roomMember.roomMemberID;
        this.roomJoinDate = roomMember.joinDate;

        callback(null, this);

      } else callback(new Error("User is not a member of this room!"), null);

    } catch(err) {
      callback(err, null);
    }
  }



  // Verifies if the user has a permission based on the current channel.
  async hasPermission(permission, callback = nocb) {

    if (this.roomID == undefined) 
      return callback(new Error("Room is not set. Did you call setRoom?"), null);

    try {

      const global = await REPQuery.one(
      `
      SELECT CP.DELETE_MESSAGES,
             CP.KICK_MEMBERS,
             CP.BAN_MEMBERS,
             CP.SEND_MESSAGES
      FROM CHANNELS_PERMISSIONS CP
               INNER JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CP.ID_CHANNEL_MEMBER
      WHERE CP.ID_CHANNEL_MEMBER = ?
        AND CM.BANNED = ?
        AND CM.KICKED = ?
      `, [this.channelMemberID, false, false]);

      const room = await REPQuery.one(
      `
      SELECT CRP.${permission}
      FROM CHANNELS_ROOMS_PERMISSIONS CRP
               INNER JOIN CHANNELS_ROOMS_MEMBERS CRM ON CRM.ID_CHANNEL_ROOM_MEMBER = CRP.ID_CHANNEL_ROOM_MEMBER
      WHERE CRM.ID_CHANNEL_ROOM_MEMBER = ?
      `, [this.roomMemberID]);

      REPTools.keysToBool(global, room);

      if (room[permission] == null) {

        if (global[permission] == true) {
          callback(null, this);
          return;
        }
      } else {

        if (room[permission] == true) {
          callback(null, this);
          return;
        }
      }

      callback(new Error("User does not have the required permission!"), null);

    } catch(err) {
      callback(err, null);
    }
  }



  async msgBelong(id, callback = nocb) {

    if (this.channelID == undefined)
      return callback(new Error("Channel is not set. Did you call setChannel?"), null);

    try {

      const chMbr = await REPQuery.one(
      `
      SELECT ID_CHANNEL_ROOM_MEMBER
      FROM CHANNELS_ROOMS_MESSAGES
      WHERE ID_CHANNEL_ROOM_MESSAGE = ?
      `, [id]);

      if (chMbr.ID_CHANNEL_ROOM_MEMBER == this.roomMemberID) {
        callback(null, this);
      } else {
        callback(new Error("Message not belonging to user!"), null);
      }
    } catch(err) {
      callback(err, null);
    }
  }



  async sendMessage(msg, callback = nocb) {
    this.hasPermission(permissions.sendMessages, async (err) => {
      if (err) {
        callback(err, null);
      } else {

        try {

          const { error } = msgSchema.validate({ message: msg });

          if (error) return;

          const chMsg = await REPQuery.one(
          `
          INSERT INTO CHANNELS_ROOMS_MESSAGES
              (ID_CHANNEL_ROOM, ID_CHANNEL_ROOM_MEMBER, MESSAGE, DATE)
          VALUES (?, ?, ?, ?)
          RETURNING ID_CHANNEL_ROOM_MESSAGE
          `, [this.roomID, this.roomMemberID, msg, new Date()]);


          const message = await REPQuery.one(
          `
          SELECT CRM.ID_CHANNEL_ROOM_MESSAGE  as id,
                 U.USER_CODE                  as code,
                 U.COLOR                      as color,
                 U.BACKGROUND_COLOR           as backgroundColor,
                 U.NAME                       as name,
                 CM.ID_CHANNEL_MEMBER         as author,
                 TO_BASE64(U.PROFILE_PICTURE) as picture,
                 CRM.MESSAGE                  as message,
                 CRM.DATE                     as date
          FROM CHANNELS_ROOMS_MESSAGES CRM
                   INNER JOIN CHANNELS_ROOMS_MEMBERS CRMB ON CRMB.ID_CHANNEL_ROOM_MEMBER = CRM.ID_CHANNEL_ROOM_MEMBER
                   INNER JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CRMB.ID_CHANNEL_MEMBER
                   INNER JOIN USERS U ON U.ID_USER = CM.ID_USER
          WHERE CRM.ID_CHANNEL_ROOM_MESSAGE = ?
          `, [chMsg.ID_CHANNEL_ROOM_MESSAGE]);

          io.to(`rm${this.roomID}`).emit("message", JSON.stringify(message));

          io.to(`ch${this.channelID}`).emit("rmNotifications", JSON.stringify({
            room: this.roomID,
            type: "+"
          }));

          callback(null, this);
        }
        catch (error) {
          console.log(error)

          callback(error, null);
        }
      }
    });
  }



  async highlightMessage(msgID, callback = nocb) {

    try {

      await REPQuery.exec(
      `
      UPDATE CHANNELS_ROOMS_MESSAGES
      SET HIGHLIGHTED = !HIGHLIGHTED
      WHERE ID_CHANNEL_ROOM_MESSAGE = ?
      `, [msgID]);

      const state = await REPQuery.one(
      `
      SELECT HIGHLIGHTED as highlighted
      FROM CHANNELS_ROOMS_MESSAGES
      WHERE ID_CHANNEL_ROOM_MESSAGE = ?
      `, [msgID]);

      io.to(`rm${this.roomID}`).emit("highlightMessage", JSON.stringify({ msgID: msgID, state: state.highlighted }));

      callback(null, this);

    } catch(error) {
      callback(error, null);
    }

  }



  async deleteMessage(msgID, callback = nocb) {
    this.msgBelong(msgID, (noAuth) => {

      const delMsg = async () => {
        try {
          await REPQuery.exec(
          `
          DELETE
          FROM CHANNELS_ROOMS_MESSAGES
          WHERE ID_CHANNEL_ROOM_MESSAGE = ?
          `, [msgID]);

          io.to(`rm${this.roomID}`).emit("deleteMessage", `${msgID}`);

          io.to(`ch${this.channelID}`).emit("rmNotifications", JSON.stringify({
            room: this.roomID,
            type: "-"
          }));

          callback(null, this);

        } catch(error) {
          callback(error, null);
        }
      }

      if (noAuth) {
        // If the message does not belong to the user then the latter
        // must be authorized to delete other people messages
        this.hasPermission(permissions.deleteMessage, async (err) => {
          if (err) {
            callback(err, null);
          } else {
            delMsg();
          }
        });
      } else {
        delMsg();
      }
    });
  }



  async banMember(memberID) {
    this.hasPermission(permissions.banMembers, async (err) => {
      if (err) {
        console.log(clc.red(err));
      } else {

        if (this.channelMemberID != memberID) {
          try {
            // await REPQuery.exec(
            // `
            // UPDATE 
            // CHANNELS_MEMBERS
            // SET
            // BANNED = ?
            // WHERE ID_CHANNEL_MEMBER = ?
            // AND ID_CHANNEL = ?
            // `, [true, memberID, rqRoom]);

            const user = await REPQuery.one(
            `
            SELECT ID_USER
            FROM CHANNELS_MEMBERS
            WHERE ID_CHANNEL_MEMBER = ?
            `, [memberID]);

            io.to(`ch${this.channelID}`).emit("ban", memberID);

          } catch(error) {
            console.log(clc.red(error));
          }
        }
      }
    });
  }



  async kickMember() {

  }



  async watch(callback = nocb) {
    try {
      await REPQuery.exec(
      `
      UPDATE CHANNELS_ROOMS_MEMBERS
      SET WATCHING = ?
      WHERE ID_CHANNEL_MEMBER = ?
      `, [false, this.channelMemberID]);

      await REPQuery.exec(
      `
      UPDATE CHANNELS_ROOMS_MEMBERS
      SET WATCHING        = ?,
          UNREAD_MESSAGES = 0
      WHERE ID_CHANNEL_ROOM_MEMBER = ?
      `, [true, this.roomMemberID]);

      callback(null, this);

    } catch(error) {

      callback(error, null);
    }
  }



  async unwatch(callback = nocb) {
    try {
      await REPQuery.exec(
      `
      UPDATE CHANNELS_ROOMS_MEMBERS
      SET WATCHING = ?
      WHERE ID_CHANNEL_ROOM_MEMBER = ?
      `, [false, this.roomMemberID]);

      callback(null, this);

    } catch(error) {

      callback(error, null);
    }
  }



  async setLastJoinedChannel(callback = nocb) {

    try {

      await REPQuery.exec(
      `
      UPDATE USERS
      SET LAST_JOINED_CHANNEL = ?
      WHERE ID_USER = ?
      `, [this.channelID, this.userID]);

      callback(null, this);

    } catch(error) {

      callback(error, null);

    }
  }



  async setLastJoinedRoom(callback = nocb) {

    try {

      await REPQuery.exec(
      `
      UPDATE USERS
      SET LAST_JOINED_ROOM = ?
      WHERE ID_USER = ?
      `, [this.roomID, this.userID]);

      callback(null, this);

    } catch(error) {

      callback(error, null);
    }
  }


  async getJoinedChannels() {

    return await REPQuery.load(
    `
    SELECT CM.ID_CHANNEL as channelID
    FROM CHANNELS_MEMBERS CM
    WHERE CM.ID_USER = ?
      AND CM.BANNED = ?
      AND CM.KICKED = ?
    `, [this.userID, false, false]);
  }



  async setOnline() {

    await REPQuery.exec(
    `
    UPDATE USERS
    SET USER_STATUS = ?
    WHERE ID_USER = ?
    `, [userStatus.online, this.userID]);

    this.joinedChannels = await this.getJoinedChannels();

    this.joinedChannels.forEach((ch) => {
      io.to(`ch${ch.channelID}`).emit("members", {
        emitType: "MEMBER_STATUS",
        userID: this.userID,
        status: userStatus.online
      });
    });

  }



  async setOffline() {

    await REPQuery.exec(
    `
    UPDATE USERS
    SET USER_STATUS = ?
    WHERE ID_USER = ?
    `, [userStatus.offline, this.userID]);

    this.joinedChannels = await this.getJoinedChannels();

    this.joinedChannels.forEach((ch) => {
      io.to(`ch${ch.channelID}`).emit("members", {
        emitType: "MEMBER_STATUS",
        userID: this.userID,
        status: userStatus.offline
      });
    });

  }
}



module.exports = DBUser;