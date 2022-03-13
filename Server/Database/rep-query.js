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
}



module.exports = REPQuery;