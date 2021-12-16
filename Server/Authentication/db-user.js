const db = require('../Database/db');

class DBUser {

    constructor(userID) {
        this.userID = userID;
    }


    async setChannel(channel, callback) {
        this.channelID = channel;

        let channelMemberID = await db.query(
        `
        SELECT ID_CHANNEL_MEMBER
        FROM CHANNELS_MEMBERS
        WHERE ID_CHANNEL = ?
        AND ID_USER = ?
        `, [this.channelID, this.userID]);

        if (channelMemberID[0]) {
            this.channelMemberID = channelMemberID[0].ID_CHANNEL_MEMBER;

            callback(undefined, this);

            return this;
        }
        else
            callback(new Error("User is not a member of this channel"));
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
        `, [1, this.channelID, true]);

        auth = auth[0];

        if (auth) {
            callback(undefined, this);

            return this;
        }
        else
            callback(new Error("User does not have the required permission!"));
    }
}

module.exports = DBUser;