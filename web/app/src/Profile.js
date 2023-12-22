class Profile {

    static SetUp(user) {
        Profile.SetFields(user)
        Profile.SetListeners(user);
    }

    static SetFields(user) {
        const $view = $jsf(`#profileView`);

        $view.find('#login').value(user['login'])
        $view.find('#password').value(user['password'])
        $view.find('#email').value(user['email'])
        $view.find('#phone').value(user['phone'])
    }

    static SetListeners(user) {
        $jsf(`#profileConfirm`).onClick(() => {
            const $view = $jsf(`#profileView`);

            user['login'] = $view.find('#login').value()
            user['password'] = $view.find('#password').value()
            user['email'] = $view.find('#email').value()
            user['phone'] = $view.find('#phone').value()

            DB.PostUserdata(user);

            // DB.post(user) ....
        })

        $jsf(`#profileLogout`).onClick(async () => {
            await DB.PostCart();

            delete localStorage['token'];
            delete localStorage['cart'];
            

            window.location.replace('/');
        })        
    }
}


DB.GetUserdata().then(data => {
    Profile.SetUp(data);
})