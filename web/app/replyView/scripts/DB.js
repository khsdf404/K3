class DB {

    static async GetReply(link) {
        let obj = {};

        let reply = await DB.Request(`/api/reply/${link}/`);
        obj['answers'] = reply.answers;

        log(reply)

        let poll = await DB.Request(`/api/polls/public/${reply.pollLink}/`);
        obj['questions'] = poll.questions;

        return obj;
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