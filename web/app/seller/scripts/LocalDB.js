if (!localStorage['seller-tables']) {
    localStorage['seller-tables'] = JSON.stringify({});
}

class LocalDB {
    static field = 'seller-tables';


    static GetToken() {
        return  localStorage['token'];
    }
    static SetToken(token) {
        localStorage['token'] = token;
    }

    

    static GetObject() {
        return JSON.parse( localStorage[LocalDB.field]);
    }
    static SetObject(obj) {
        localStorage[LocalDB.field] = JSON.stringify(obj);
        LocalDB.Print()
    }


    static async CreateRow(tableName) {
        let outputRow;
        await DB.CreateRow(tableName).then(row => {
            outputRow = row;
            let obj = LocalDB.GetObject();
            obj[tableName].push(row);

            LocalDB.SetObject(obj);
        })
        return outputRow;
    }

    static UpdateRow(tableName, id, field, value) {

        let obj = LocalDB.GetObject();
        let row = LocalDB.Find(obj[tableName], id);

        if (row) row[field] = value;

        DB.UpdateRow(tableName, row);

        LocalDB.SetObject(obj);
    }

    static DeleteRow(tableName, id) {
        DB.DeleteRow(tableName, id).then(log);

        let obj = LocalDB.GetObject();
        let row = LocalDB.Find(obj[tableName], id);

        obj[tableName].splice(obj[tableName].indexOf(row), 1);

        LocalDB.SetObject(obj);
    }

    static Find(table, id) {
        if (!table) return null;
        let result = null;

        forEach(table, obj => {
            if (obj.id == id)
                return result = obj;
        });

        return result;
    }

    static Print() {
        log({Local: LocalDB.GetObject()})
    }
}