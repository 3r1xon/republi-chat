const db = require('../Database/db');

class User {

    constructor(userID) {
        this.userID = userID;
    }


    setChannel(channel, callback) {
        this.channelID = channel;

        let channelMemberID = db.query(
        `
        SELECT ID_CHANNEL_MEMBER
        FROM CHANNELS_MEMBERS
        WHERE ID_CHANNEL = ?
        AND ID_USER = ?
        `, [this.channelID, this.userID]);

        channelMemberID = channelMemberID[0].ID_CHANNEL_MEMBER;

        if (channelMemberID) {
            this.channelMemberID = channelMemberID;

            callback(undefined, this);

            return this;
        }
        else
            callback("User is not a member of this channel");
    }

    // Verifies if the user has a permission based on the current channel.
    hasPermission(permission, callback) {

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
            callback("User does not have the required permission!");
    }
}

module.exports = User;