const db = require('../Database/db');

class DBUser {

    constructor(userID) {
        this.userID = userID;
    }


    async setChannel(channel, callback) {
        this.channelID = channel;

        const channelMemberID = await db.query(
        `
        SELECT ID_CHANNEL_MEMBER
        FROM CHANNELS_MEMBERS
        WHERE ID_CHANNEL = ?
        AND ID_USER = ?
        `, [this.channelID, this.userID]);

        if (channelMemberID[0]) {
            this.channelMemberID = channelMemberID[0].ID_CHANNEL_MEMBER;

            callback(null, this);

            return this;
        }
        else
            callback(new Error("User is not a member of this channel!"), null);
    }

    // Verifies if the user has a permission based on the current channel.
    async hasPermission(permission, callback) {

        if (this.channelID == undefined) throw new Error("Channel is not set. Did you call setChannel?");

        let auth = await db.query(
        `
        SELECT CP.${permission}
        FROM CHANNELS_PERMISSIONS CP
        LEFT JOIN CHANNELS_MEMBERS CM ON CM.ID_CHANNEL_MEMBER = CP.ID_CHANNEL_MEMBER
        LEFT JOIN CHANNELS C ON C.ID_CHANNEL = CM.ID_CHANNEL
        WHERE CP.ID_CHANNEL_MEMBER = ?
        AND C.ID_CHANNEL = ?
        AND CP.${permission} = ?
        `, [this.channelMemberID, this.channelID, true]);
        
        try {
            auth = !!auth[0][permission];

            callback(null, this);

            return this;
        } catch {
            callback(new Error("User does not have the required permission!"), null)
        }
    }

    async msgBelong(id, callback) {

        let chMbr = await db.query(
        `
        SELECT ID_CHANNEL_MEMBER
        FROM CHANNELS_MESSAGES
        WHERE ID_CHANNEL_MESSAGE = ?
        `, [id]);

        chMbr = chMbr[0];

        if (chMbr.ID_CHANNEL_MEMBER == this.channelMemberID) {
            callback(null, this);
        } else {
            callback(new Error("Message not belonging to user!"), null)
        }
    }
}

module.exports = DBUser;