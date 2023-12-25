// DB.Request(`http://localhost:81/api/polls/public/62696261d09ed0bfd180d0bed18120233131323032332d31322d32345431313a33393a32392e3739345a/`, 
// 'GET', null, LocalDB.GetToken());

class DB {

    static async GetUserdata() {
        await DB.CheckToken();
        return await DB.Request('/auth/users/', 'GET', null, LocalDB.GetToken());
    }

    static async PostUserdata(obj) {
        await DB.CheckToken();
        return await DB.Request('/auth/users/', 'PUT', obj, LocalDB.GetToken());
    }

    static async DeletePoll(link) {
        await DB.CheckToken();
        return await DB.Request(`/api/polls/${link}/`, 'DELETE', null, LocalDB.GetToken());
    }
    static async PostPoll(obj) {
        await DB.CheckToken();
        return await DB.Request('/api/polls/', 'POST', obj, LocalDB.GetToken());
    }

    static async GetUserPolls() {
        await DB.CheckToken();
        return await DB.Request('/api/polls/all/', 'GET', null, LocalDB.GetToken());
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