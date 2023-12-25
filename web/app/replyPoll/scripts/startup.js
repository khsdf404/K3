$jsf(`#replyPollView`).addClass('active')

const link = window.location.href.replace(/[\s\S]+link=/g, '').replace(/\//g, '');
log(link);

DB.GetPoll(link).then(result => {

    let innerHTML = '';

    forEach(result.questions.split('|'), question => {
        innerHTML += `
            <article class="question-form">
                <section>
                    <div>${question}</div>
                </section>

                <section>
                    <div>Ответ: </div>
                    <input />
                </section>
            </article>
        `
    })

    innerHTML += `<button id="postReplyBtn">Завершить</button>`

    $jsf(`#replyPollView`).appendChild(innerHTML);


    $jsf(`#postReplyBtn`).onClick(() => {

        let answers = '';

        $jsf(`#replyPollView input`).each(e => {
            answers += e.value + '|';
        })
        answers = answers.replace(/(\|)$/g, '');

        let replyObj = {
            pollLink: link,
            answers: answers
        };

        DB.PostReply(replyObj).then(result => {
            window.location.replace(`http://localhost:81/replyView/?link=${result['link']}`)
        });
    })
})

// 62696261d09ed0bfd180d0bed18120236265627261323032332d31322d32345431353a33313a35372e3936355a