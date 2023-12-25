function AddPollView() {
    let html = `
            <input class="poll-name-input" value="Опрос #" placeholder="Название опроса">
            <input class="poll-date-input" value="2024-01-01" placeholder="Дата окончания">
            <div class="addPoll-buttons">
                <button id="addQuestionBtn">Добавить вопрос</button>
                <button id="postPollBtn">Опубликовать</button>
            </div>
    `;
    $jsf(`#addPollView`).appendChild(html);

    $jsf(`#addQuestionBtn`).onClick(() => {
        $jsf('#addPollView').appendChild(`
            <article class="question-form">
                <section>
                    <div>Вопрос: </div>
                    <input />
                </section>

                <section>
                    <div>Правильный ответ: </div>
                    <input />
                </section>
            </article>
        `);
    })

    $jsf(`#postPollBtn`).onClick(() => {
        let questionsStr = '';
        let answersStr = '';

        $jsf(`.question-form`).eachJSF($e => {
            $inputs = $e.find('input');
            questionsStr += $inputs.get(0).value + '|'
            answersStr += $inputs.get(1).value + '|'
        })
        questionsStr = questionsStr.replace(/(\|)$/g, '');
        answersStr = answersStr.replace(/(\|)$/g, '');



        let pollObj = {
            name: $jsf(`.poll-name-input`).value(),
            expirationTime: $jsf(`.poll-date-input`).value(),
            answers: answersStr,
            questions: questionsStr
        };


        DB.PostPoll(pollObj).then((result) => {
            $jsf(`.question-form`).ohtml('');

            navigator.clipboard.writeText(result.link)
            alert('Ссылка на опрос скопирована!');
        });

        
    })
}
