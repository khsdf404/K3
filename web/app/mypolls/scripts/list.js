function PollElem(row, index) {
    return `
        <div class="poll-elem">
            <h3>${row.name} 
                <span class="deleteIcon" onClick="
                    DB.DeletePoll('${row.link}');
                    $jsf('.poll-elem').get(${index}).outerHTML = '';
                "></span>
            </h3>
            <span>Количество ответов: ${row.replyAmount}</span>
            <span>Дата создания: ${row.creationTime.replace(/T[\s\S]+/g, '')}</span>
            <span>Дата окончания: ${row.expirationTime.replace(/T[\s\S]+/g, '')}</span>

            <div>
                <button onClick="navigator.clipboard.writeText('http://localhost:81/reply/?link=${row.link}'); alert('Скопировано')">Скопировать ссылку</button>
                <button onClick="window.open('http://localhost:81/reply/?link=${row.link}', '_blank')">Пройти опрос</button>
                <button onClick="window.open('http://localhost:81/replyList/?link=${row.link}', '_blank')">Посмотреть ответы</button>
            </div>
        </div> 
    `
}
function ListPollsView() {

    DB.GetUserPolls().then(result => {

        let html = `<div>Мои опросы:</div>`

        forEach(result, (row, index) => {
            html += PollElem(row, index);
        })

        $jsf(`#listPollView`).appendChild(html);
    })
}
