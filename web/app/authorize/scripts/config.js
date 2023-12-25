DB.Redirect().then(() => {

    
    const $nameInput = $jsf(`#username`);
    const $passInput = $jsf(`#password`);
    const $emailInput = $jsf(`#email`);
    const $phoneInput = $jsf(`#phone`);
    const $btn = $jsf(`authorization-confirm`).find(`button`);



    $jsf(`.authorization-type`).find('div').onClick(($e) => {
        if ($e.hasClass('active')) return;

        $jsf('.active').removeClass('active');
        $e.addClass('active');

        if ($e.attr(`data-text`) == 'CONTINUE')
            $jsf(`.signup-fields`).fadeOut(0)
            && $jsf(`.authorization-card`).removeClass('signup');
        else 
            $jsf(`.signup-fields`).fadeIn(0, 'flex')
            && $jsf(`.authorization-card`).addClass('signup');


        $btn.text($e.attr(`data-text`))
    })




    $btn.onClick(async () => {
        let user = {
            login: $nameInput.value(),
            password: $passInput.value(),
            email: $emailInput.value(),
            phone: $phoneInput.value()
        }

        let responseData;
        log(responseData)

        if ($btn.text() == "CREATE ACCOUNT")
            responseData = await DB.Registry(user);
        else
            responseData = await DB.Login(user);


        if (responseData != null) {
            LocalDB.SetToken(responseData['token']);
            
            if (responseData['role'] == 'ROLE_USER')
                window.location.replace('/mypolls/')
        }


    })

});