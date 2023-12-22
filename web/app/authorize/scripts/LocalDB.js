if (!localStorage['token']) {
    localStorage['token'] = JSON.stringify({});
}

class LocalDB {

    static GetToken() {
        return localStorage['token'];
    }
    static SetToken(token) {
        localStorage['token'] = token;
        LocalDB.Print()
    }


    static Print() {
        log({Local: LocalDB.GetToken()})
    }
}