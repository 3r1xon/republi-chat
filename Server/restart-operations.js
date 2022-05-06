const REPQuery = require('./Database/rep-query');
const userStatus = require('./Authentication/user-status');

// All operations regarding the application
// that should be done when the server crashes or shuts down
// must be done here

const restoreUserStatuses = async () => {

    await REPQuery.exec(
    `
    UPDATE USERS
    SET USER_STATUS = ?
    `, [userStatus.offline]);
};

restoreUserStatuses();