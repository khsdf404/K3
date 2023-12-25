$jsf(`#replyListView`).addClass('active')

const link = window.location.href.replace(/[\s\S]+link=/g, '').replace(/\//g, '');
log(link);

DB.GetReplyList(link).then(result => {

    let html = '';

    forEach(result, (row, index) => {
        html += `<a target="_blank" rel="noopener noreferrer"  href="http://localhost:81/replyView/?link=${row.link}">${index + 1}. Ответ от ${row.creationTime.replace(/T[\s\S]+/g, '')}</a>`
    })

    $jsf(`#replyListView`).appendChild(html);
    
})
