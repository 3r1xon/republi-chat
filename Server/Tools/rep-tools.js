const REPQuery = require('../Database/rep-query');

class REPTools {
    /**
     * Generates an unique code based on the name.
     * There can't be more than 9999 people with the same name
     * 
     * @param NAME The name that needs to be checked for the code, example: username.
     *
     * @param TABLE_NAME In which table do you need to check
     * 
     * @param COLUMN_NAME The column that contains all the names
     * 
     * @param callback An error or success callback
     */
    static async generateCode(NAME, TABLE_NAME, COLUMN_NAME, callback) {

        const pk = await REPQuery.one(
        `
        SHOW KEYS 
        FROM ${TABLE_NAME} 
        WHERE Key_name = 'PRIMARY'
        `);

        let dbValue = await REPQuery.one(
        `
        SELECT
        ${COLUMN_NAME}
        FROM ${TABLE_NAME}
        WHERE NAME = ?
        ORDER BY ${pk.Column_name} DESC
        LIMIT 1
        `, [NAME]);

        dbValue ? dbValue = dbValue[COLUMN_NAME] : dbValue = "000";

        let USER_CODE = parseInt(dbValue, 10) + 1;

        USER_CODE += "";

        while (USER_CODE.length < 4) USER_CODE = "0" + USER_CODE;

        if (USER_CODE.length > 4)
            callback(new Error(`Too many names '${NAME}'`));
        else
            callback(undefined, USER_CODE);
    }

    static getVariableName(variable) {
        return Object.keys(variable)[0];
    }
}

module.exports = REPTools;