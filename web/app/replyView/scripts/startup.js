$jsf(`#replyPollView`).addClass('active')

const link = window.location.href.replace(/[\s\S]+link=/g, '').replace(/\//g, '');
log(link);


DB.GetReply(link).then(result => {

    let innerHTML = '';

    let questions = result.questions.split('|');
    let answers = result.answers.split('|');

    log(result)

    forEach(answers, (answer, index) => {
        innerHTML += `
            <article class="question-form">
                <section>
                    <div>Вопрос: ${questions[index]}</div>
                </section>

                <section>
                    <div>Ответ: ${answer}</div>
                </section>
            </article>
        `
    })

    $jsf(`#replyPollView`).appendChild(innerHTML);
})
