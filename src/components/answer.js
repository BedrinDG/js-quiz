import {urlManager} from "../utils/url-manager.js";

export class Answer {
    constructor() {
        this.quiz = null;
        this.testId = sessionStorage.getItem('id');
        this.rightAnswer = null;
        this.name = sessionStorage.getItem('name');
        this.lastName = sessionStorage.getItem('lastName');
        this.email = sessionStorage.getItem('email');

        urlManager.checkUserData()
        if (this.testId) {
            const xhr = new XMLHttpRequest();
            xhr.open('GET', 'https://testologia.ru/get-quiz?id=' + this.testId, false);
            xhr.send();

            if (xhr.status === 200 && xhr.responseText) {
                try {
                    this.quiz = JSON.parse(xhr.responseText);
                } catch (e) {
                    location.href = '#/';
                }
                this.getRightAnswers();
                this.showQuestionsAndAnswers();
            } else {
                location.href = '#/';
            }
        } else {
            location.href = '#/';
        }

    }

    getRightAnswers() {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://testologia.ru/get-quiz-right?id=' + this.testId, false);
        xhr.send();

        if (xhr.status === 200 && xhr.responseText) {
            try {
                this.rightAnswer = JSON.parse(xhr.responseText);
            } catch (e) {
                location.href = '#/';
            }

        } else {
            location.href = '#/';
        }
    }

    showQuestionsAndAnswers() {
        const that = this;
        let userAnswers = JSON.parse(sessionStorage.getItem("answers"));

        document.getElementById('test-name').innerText = this.quiz.name;

        document.getElementById('user-data').innerText = `${this.name} ${this.lastName}, ${this.email}`;

        let questionsContainer = document.getElementsByClassName('answer-test-questions')[0];

        this.quiz.questions.forEach((question, index) => {
            const questionBlock = document.createElement('div');
            questionBlock.className = 'answer-test-question';

            const questionName = document.createElement('div')
            questionName.className = 'question-name';
            questionName.innerHTML = '<span> Вопрос ' + (index + 1) + ': </span> ' + question.question;

            const questionVariables = document.createElement('ul');
            questionVariables.className = 'question-variables';

            question.answers.forEach(answer => {
                const answerBlock = document.createElement('li');

                const marker = document.createElement('div');
                marker.className = 'marker';

                const answerName = document.createElement('p');
                answerName.innerText = answer.answer;

                if (answer.id === userAnswers[index].chosenAnswerId) {
                    if (answer.id === that.rightAnswer[index]) {
                        answerBlock.className = 'green-text'
                        marker.className += ' marker-green'
                    } else {
                        answerBlock.className = 'red-text'
                        marker.className += ' marker-red'
                    }
                }

                answerBlock.appendChild(marker);
                answerBlock.appendChild(answerName);

                questionVariables.appendChild(answerBlock);
            })

            questionBlock.appendChild(questionName);
            questionBlock.appendChild(questionVariables);

            questionsContainer.appendChild(questionBlock);
        })

    }


}
