const db = require('../Database/db');

class DBUser {

    constructor(userID) {
        this.userID = userID;
    }


    async setChannel(channel, callback) {
        this.channelID = channel;

        try {

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
        } catch(err) {
            callback(err, null);
        }
    }

    // Verifies if the user has a permission based on the current channel.
    async hasPermission(permission, callback) {

        if (this.channelID == undefined) throw new Error("Channel is not set. Did you call setChannel?");

        try {

            let auth = await db.query(
            `
            SELECT CP.${permission}
            FROM CHANNELS_PERMISSIONS CP
            WHERE CP.ID_CHANNEL_MEMBER = ?
            AND CP.${permission} = ?
            `, [this.channelMemberID, true]);
    
            try {
                auth = !!auth[0][permission];
    
                callback(null, this);
    
                return this;
            } catch {
                callback(new Error("User does not have the required permission!"), null)
            }
        } catch(err) {
            callback(err, null);
        }
    }

    async msgBelong(id, callback) {

        try {

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
        } catch(err) {
            callback(err, null);
        }
    }
}

module.exports = DBUser;