function DrawAsideButtons(buttonsInfo) {

    forEach(buttonsInfo, btnInfo => {
        let viewName = btnInfo.name;
        let viewImage = btnInfo.image;
        let buttonSign = btnInfo.sign;

        $jsf('aside').appendChild(`
            <article data-name="${viewName}">
                <span class="sidebar-icon" style="background-image: url('${viewImage}')"></span>
                <span class="sidebar-label non-select">${buttonSign}</span>
            </article>
        `);
    })

    let $viewBtns = $jsf(`aside article, header section button, .header-logo`);
    $viewBtns.onClick($e => {
        $viewBtns.removeClass('active');
        $e.addClass('active');

        $jsf(`#views section`).removeClass('active');
        $jsf(`#${$e.attr('data-name')}View`).addClass('active');

        if ($e.attr('data-name') == 'listPoll') {
            $jsf(`#listPollView`).empty();
            ListPollsView();
        }
    })
    
}


DB.CheckToken().then(() => {

    DrawAsideButtons([
        { 
            name: 'addPoll', 
            image: '/src/icons/add.svg', 
            sign:'New Poll'
        },
        { 
            name: 'listPoll', 
            image: '/src/icons/list.svg', 
            sign:'My Polls'
        }
    ])

    AddPollView()

});