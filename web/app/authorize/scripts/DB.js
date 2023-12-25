class DB {

    static async Registry(user) {
        return await DB.Request(`/auth/reg/`, 'POST', user);
    }

    static async Login(user) {
        return await DB.Request(`/auth/login/`, 'POST', user);
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
                LocalDB.SetToken('');
                return;
            }

            LocalDB.SetToken(responseData['token']);
    
            if (responseData['role'] == 'ROLE_USER')
                changeWindowLocation('/mypolls/')
        });
        
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