class DB {

    static async GetReplyList(link) {
        await DB.CheckToken();
        return await DB.Request(`/api/reply/byParent/${link}/`, 'GET', null, LocalDB.GetToken())
    }

    

    static async CheckToken() {
        let tokenObj = await DB.Request('/auth/token/', 'GET', null, LocalDB.GetToken());
        if (tokenObj['token'] == null) {
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