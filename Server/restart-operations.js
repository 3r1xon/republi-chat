const REPQuery = require('./Database/rep-query');
const userStatus = require('./Authentication/user-status');

// All operations regarding the application
// that should be done when server crashes or shut down
// must be done here

const restoreUserStatuses = () => {

    REPQuery.exec(
    `
    UPDATE USERS
    SET USER_STATUS = ?
    `, [userStatus.offline]);
};

restoreUserStatuses();