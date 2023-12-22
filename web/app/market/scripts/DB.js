class DB {


    static async GetCart() {
        await DB.CheckToken();
        return await DB.Request('/api/carts/bytoken/', 'GET', null, LocalDB.GetToken());
    }

    static async PostCart() {
        await DB.CheckToken();
        return await DB.Request('/api/carts/', 'POST', { 'json': JSON.stringify(LocalDB.GetObject()) }, LocalDB.GetToken());
    }



    static async GetUserdata() {
        await DB.CheckToken();
        return await DB.Request('/auth/users/', 'GET', null, LocalDB.GetToken());
    }

    static async PostUserdata(obj) {
        await DB.CheckToken();
        return await DB.Request('/auth/users/', 'POST', obj, LocalDB.GetToken());
    }




    static async GetTables() {
        await DB.CheckToken();
        return await DB.Request('/api/products/', 'GET', null, LocalDB.GetToken());
    }


    static async CreateOrder() {

        await DB.CheckToken();;

        let order = LocalDB.GetObject();

        // for easy parsing in java
        let keys = Object.keys(order);
        let counter = 0;
        let productsArray = [];

        forEach(order, table => {
            forEach(table, item => {
                item['table'] = keys[counter];
            })
            productsArray = [...productsArray, ...table];
            counter++;
        });


        return await DB.Request('/api/orders/', 'POST', {
            'json': JSON.stringify(productsArray),
            'list': productsArray
        }, LocalDB.GetToken());

    }




    static async Redirect() {

        function changeWindowLocation(location) {
            let currentLocation = window.location.href.replace('http://localhost:81', '');
            if (currentLocation != location) {
                window.location.replace(location)
            }
        }

        await DB.Request('/auth/token/', 'GET', null, LocalDB.GetToken()).then(responseData => {
            if (responseData == null || responseData['token'] == null) {
                delete localStorage['token'];
                delete localStorage['cart'];
                
                changeWindowLocation('/');
                return;
            }

            LocalDB.SetToken(responseData['token']);
    
            if (responseData['role'] == 'ROLE_USER')
                changeWindowLocation('/market/')
            if (responseData['role'] == 'ROLE_SELLER')
                changeWindowLocation('/seller/')
            if (responseData['role'] == 'ROLE_ADMIN')
                changeWindowLocation('/admin/');
            
        });
    }

    static async CheckToken() {
        let tokenObj = await DB.Request('/auth/token/', 'GET', null, LocalDB.GetToken());
        if (tokenObj['token'] == null) {
            delete localStorage['token'];
            delete localStorage['cart'];
            
            window.location.replace('/');
            return;
        }
        LocalDB.SetToken(tokenObj['token']);
    }
    static async Request(url, method = 'GET', bodyObj = null, token = null) {
        
        let result = null;
        let obj = {};

        obj['method'] = method;
        
        obj['headers'] = {};
        obj['headers']['Content-type'] = 'application/json';
        if (token) obj['headers']['Authorization'] = `Bearer ${token}`;
            
        if (bodyObj) obj['body'] = JSON.stringify(bodyObj);
        
        await fetch(url, obj).then(async (response) => {
            console.log(response)
            if (response.ok)
                await response.json().then(data => {
                    console.log(data);
                    result = data;
                })
            else 
                response.text().then(console.log)
        });

        return result;
    }

} 