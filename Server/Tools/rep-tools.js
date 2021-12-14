const db = require('../Database/db');

class REPTools {

    // Summary:
    //     Generates an unique code based on the name.
    //     There can't be more than 9999 people with the same name.
    //
    // Parameters:
    //     NAME:
    //         The name that needs to be checked for the code, example: username
    //     TABLE_NAME:
    //         In which table do you need to check
    //     COLUMN_NAME:
    //         The column that contains all the names
    static async generateCode(NAME, TABLE_NAME, COLUMN_NAME, callback) {

        let pk = await db.query(
        `
        SHOW KEYS 
        FROM ${TABLE_NAME} 
        WHERE Key_name = 'PRIMARY'
        `);

        pk = pk[0].Column_name;

        let dbValue = await db.query(
        `
        SELECT
        ${COLUMN_NAME}
        FROM ${TABLE_NAME}
        WHERE NAME = ?
        ORDER BY ${pk} DESC
        LIMIT 1
        `, [NAME]);

        dbValue[0] ? dbValue = dbValue[0][COLUMN_NAME] : dbValue = "000";

        let USER_CODE = parseInt(dbValue, 10) + 1;

        USER_CODE += "";

        while (USER_CODE.length < 4) USER_CODE = "0" + USER_CODE;

        if (USER_CODE.length > 4)
            callback(`Too many names '${NAME}'`);
        else
            callback(undefined, USER_CODE);
    }

    static getVariableName(variable) {
        return Object.keys(variable)[0];
    }
}

module.exports = REPTools;