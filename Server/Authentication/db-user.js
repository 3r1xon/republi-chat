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

        let auth = db.query(
        `
        SELECT 1
        FROM CHANNELS_PERMISSIONS
        WHERE ID_CHANNEL_MEMBER = ?
        AND ID_CHANNEL = ?
        AND ${permission} = ?
        `, [this.channelMemberID, this.channelID, true]);

        auth = auth[0];

        if (auth) {
            callback(null, this);

            return this;
        }
        else
            callback(new Error("User does not have the required permission!"), null);
    }
}

module.exports = DBUser;