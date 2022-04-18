const db = require('./db');



class REPQuery {

    static one = async (query, params) => {
        let row = await db.query(query, params);

        return row[0];
    }



    static load = async (query, params) => {
        const rows = await db.query(query, params);

        return rows;
    }



    static exec = async (query, params) => {
        await db.query(query, params);
    }



    static manageUpdateSQL = (TABLE_NAME, equivalentFields, values) => {
        let SQL_UPDATE =
        `
        UPDATE
          ${TABLE_NAME}
        SET
        `;

        const orderedValues = [];

        const last = Object.keys(values).length;

        let i = 0;
        for (const key in values) {
            SQL_UPDATE += `${equivalentFields[key]} = ?`;

            if (i + 1 != last) {
                SQL_UPDATE += ",\n";
            }

            orderedValues.push(values[key]);
            i++;
        }

        return {
            SQL: SQL_UPDATE,
            orderedValues: orderedValues
        };
    }
}



module.exports = REPQuery;