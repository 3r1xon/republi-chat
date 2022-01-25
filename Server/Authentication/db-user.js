const REPQuery = require('../Database/rep-query');


class DBUser {

    constructor(userID) {
        this.userID = userID;
    }


    async setChannel(channel, callback) {
        this.channelID = channel;

        try {

            const channelMemberID = await REPQuery.one(
            `
            SELECT ID_CHANNEL_MEMBER
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
    async hasPermission(permission, callback) {

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

            callback(new Error("User does not have the required permission!"), null)

        } catch(err) {
            callback(err, null);
        }
    }

    async msgBelong(id, callback) {

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
                callback(new Error("Message not belonging to user!"), null)
            }
        } catch(err) {
            callback(err, null);
        }
    }
}

module.exports = DBUser;