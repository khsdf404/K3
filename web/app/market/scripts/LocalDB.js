class LocalDB {
    isEmpty = true;


    static GetToken() {
        return  localStorage['token'];
    }
    static SetToken(token) {
        localStorage['token'] = token;
    }


    static GetObject() {
        return JSON.parse( localStorage['cart'] );
    }
    static SetObject(cartObj) {
        LocalDB.SetEmpty(Object.keys(cartObj).length == 0);

        localStorage['cart'] = JSON.stringify(cartObj);
        LocalDB.Print()
    }

    static SetEmpty(anyKeys) {
        if (anyKeys != LocalDB.isEmpty) {
            let $cartBtn = $jsf('#cartBtn');
            LocalDB.isEmpty = anyKeys;
            LocalDB.isEmpty ? $cartBtn.removeClass('new-in-cart') : $cartBtn.addClass('new-in-cart');
        }
    }

    static CreateRow(tableName, obj) {
        let cartObj = LocalDB.GetObject();
        if (!cartObj[tableName]) cartObj[tableName] = [];
        
        cartObj[tableName].push(obj);
        LocalDB.SetObject(cartObj);
    }
    static IncreaseAmount(tableName, id) {
        let cartObj = LocalDB.GetObject();
        let row = LocalDB.Find(cartObj[tableName], id);

        if (row) row['amount'] += 1;

        LocalDB.SetObject(cartObj);
    }
    static DecreaseAmount(tableName, id) {
        let cartObj = LocalDB.GetObject();
        let row = LocalDB.Find(cartObj[tableName], id);
        
        if (row) row['amount'] -= 1;
        if (row['amount'] == 0)
            cartObj[tableName].splice(cartObj[tableName].indexOf(row), 1);
        if (cartObj[tableName].length == 0) 
            delete cartObj[tableName]

        LocalDB.SetObject(cartObj);
    }

    static SetAmount(tableName, id, amount) {
        let cartObj = LocalDB.GetObject();
        let row = LocalDB.Find(cartObj[tableName], id);

        if (row) row['amount'] = amount;
        if (row['amount'] == 0)
            cartObj[tableName].splice(cartObj[tableName].indexOf(row), 1);
        if (cartObj[tableName].length == 0) 
            delete cartObj[tableName]

        LocalDB.SetObject(cartObj);
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
        log(LocalDB.GetObject())
    }
}
