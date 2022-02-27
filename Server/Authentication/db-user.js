const REPQuery      = require('../Database/rep-query');
const REPTools      = require('../Tools/rep-tools');
const permissions   = require('../Authentication/permissions');
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
               LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CP.ID_CHANNEL_MEMBER
      WHERE CP.ID_CHANNEL_MEMBER = ?
        AND CM.BANNED = ?
        AND CM.KICKED = ?
      `, [this.channelMemberID, false, false]);

      const room = await REPQuery.one(
      `
      SELECT CRP.${permission}
      FROM CHANNELS_ROOMS_PERMISSIONS CRP
               LEFT JOIN CHANNELS_ROOMS_MEMBERS CRM ON CRM.ID_CHANNEL_ROOM_MEMBER = CRP.ID_CHANNEL_ROOM_MEMBER
      WHERE CRM.ID_CHANNEL_ROOM_MEMBER = ?
      `, [this.roomMemberID]);

      REPTools.keysToBool(global);

      REPTools.keysToBool(room);

      if (!global[permission]) {
        callback(new Error("User does not have the required permission!"), null);
        return;
      }

      if (!room[permission]) {
        callback(null, this);
        return;
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
      SELECT ID_CHANNEL_MEMBER
      FROM CHANNELS_MESSAGES
      WHERE ID_CHANNEL_MESSAGE = ?
      `, [id]);

      if (chMbr.ID_CHANNEL_MEMBER == this.channelMemberID) {
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
                   LEFT JOIN channels_rooms_members CRMB ON CRMB.ID_CHANNEL_ROOM_MEMBER = CRM.ID_CHANNEL_ROOM_MEMBER
                   LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CRMB.ID_CHANNEL_MEMBER
                   LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
          WHERE CRM.ID_CHANNEL_ROOM_MESSAGE = ?
          `, [chMsg.ID_CHANNEL_ROOM_MESSAGE]);

          io.to(this.roomID).emit("message", JSON.stringify(message));

          callback(null, this);
        }
        catch (error) {
          console.log(error)

          callback(error, null);
        }
      }
    });
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

          io.to(this.roomID).emit("deleteMessage", `${msgID}`);

          callback(null, this);

        } catch (error) {
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

            io.to(this.channelID).emit("ban", memberID);

          } catch(error) {
            console.log(clc.red(error));
          }
        }
      }
    });
  }



  async kickMember() {

  }
}



module.exports = DBUser;