const REPQuery       = require('../Database/rep-query');
const permissions    = require('../Authentication/permissions');
const msgSchema      = require('../Tools/schemas');
const io             = require('../start');



const nocb = () => { };



class DBUser {

    constructor(userID) {
        this.userID = userID;
    }



    async setChannel(channel, callback = nocb) {
        this.channelID = channel;

        try {

            const channelMemberID = await REPQuery.one(
            `
            SELECT
            ID_CHANNEL_MEMBER
            FROM CHANNELS_MEMBERS
            WHERE ID_CHANNEL = ?
            AND ID_USER = ?
            AND BANNED = ?
            AND KICKED = ?
            `, [this.channelID, this.userID, false, false]);

            if (channelMemberID) {
                this.channelMemberID = channelMemberID.ID_CHANNEL_MEMBER;

                callback(null, this);

                return this;
            }
            else
                callback(new Error("User is not a member of this channel!"), null);
        } catch(err) {
            callback(err, null);
        }
    }



    // Verifies if the user has a permission based on the current channel.
    async hasPermission(permission, callback = nocb) {

        if (this.channelID == undefined) throw new Error("Channel is not set. Did you call setChannel?");

        try {

            const auth = await REPQuery.one(
            `
            SELECT CP.${permission}
            FROM CHANNELS_PERMISSIONS CP
            LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CP.ID_CHANNEL_MEMBER
            WHERE CP.ID_CHANNEL_MEMBER = ?
            AND CM.BANNED = ?
            AND CM.KICKED = ?
            `, [this.channelMemberID, false, false]);

            if (!!auth[permission]) {
                callback(null, this);
                return this;
            }

            callback(new Error("User does not have the required permission!"), null);

        } catch(err) {
            callback(err, null);
        }
    }



    async msgBelong(id, callback = nocb) {

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
                    INSERT INTO CHANNELS_MESSAGES
                    (ID_CHANNEL, ID_CHANNEL_MEMBER, MESSAGE, DATE)
                    VALUES
                    (?, ?, ?, ?)
                    RETURNING ID_CHANNEL_MESSAGE
                    `, [this.channelID, this.channelMemberID, msg, new Date()]);

                    const message = await REPQuery.one(
                    `
                    SELECT
                    M.ID_CHANNEL_MESSAGE as id,
                    U.USER_CODE as code,
                    U.COLOR as color,
                    U.NAME as name,
                    CM.ID_CHANNEL_MEMBER as author,
                    TO_BASE64(U.PROFILE_PICTURE) as picture,
                    M.MESSAGE as message,
                    M.DATE as date
                    FROM CHANNELS_MESSAGES M
                    LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = M.ID_CHANNEL_MEMBER
                    LEFT JOIN USERS U ON U.ID_USER = CM.ID_USER
                    WHERE M.ID_CHANNEL_MESSAGE = ?
                    `, [chMsg.ID_CHANNEL_MESSAGE]);

                    io.to(this.channelID).emit("message", JSON.stringify(message));

                    callback(null, this);
                }
                catch (error) {
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
                DELETE FROM CHANNELS_MESSAGES 
                WHERE ID_CHANNEL_MESSAGE = ?
                `, [msgID]);

                io.to(this.channelID).emit("deleteMessage", `${msgID}`);

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
}



module.exports = DBUser;