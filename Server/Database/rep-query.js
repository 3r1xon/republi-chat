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
        `;

        const orderedValues = [];

        for (const key in values) {
            SQL_UPDATE += `SET ${equivalentFields[key]} = ?`;

            orderedValues.push(values[key]);
        }

        return {
            SQL: SQL_UPDATE,
            orderedValues: orderedValues
        };
    }
}



module.exports = REPQuery;