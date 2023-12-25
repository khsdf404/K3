class LocalDB {


    static GetToken() {
        return  localStorage['token'];
    }
    static SetToken(token) {
        localStorage['token'] = token;
    }

    
}
