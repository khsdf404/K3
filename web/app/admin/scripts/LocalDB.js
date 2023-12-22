
let $viewBtns = $jsf(`aside article, header section button, .header-logo`);
$viewBtns.onClick($e => {
    $viewBtns.removeClass('active');
    $e.addClass('active');
    ShowView($e.attr('data-name'));
})

function ShowView(tableName) {
    // arr = getStuff(name) ......
    $jsf('.active').eachJSF($e => {
        if ($e.id() == 'cartView') {
            Views.RedrawViews();
        }
    })

    $jsf(`#views section`).removeClass('active');
    $jsf(`#${tableName}View`).addClass('active');
}


class LocalDB {


    static GetToken() {
        return  localStorage['token'];
    }
    static SetToken(token) {
        localStorage['token'] = token;
    }

    
}
