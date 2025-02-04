document.addEventListener("DOMContentLoaded", () => {
    const startPage = document.getElementById("start-page");
    const questionsPage = document.getElementById("questions-page");
    const scorePage = document.getElementById("score-page");
    const startButton = document.getElementById("start-quiz");
    const questionsDisplay =document.getElementById("questions");
    const scoreDisplay =document.getElementById("display-score");

    let questions = [];
    let index= 0;
    let score=0;

    startButton.addEventListener("click", startQuiz);
    
    
    function fetchQuestions() {
        fetch("/questions")
            .then(response => response.json())
            .then(data => {
                questions = data.sort(() => Math.random() - 0.5).slice(0, 10); 
                displayQuestions();
            })
            .catch(error => console.error("Error fetching questions:", error));
    }


    function startQuiz(){
        startPage.style.display="none";
        questionsPage.style.display="flex";
        fetchQuestions();
    }


    
    function displayQuestions() {
        if (index < questions.length) {
            questionsDisplay.innerHTML = ""; // Clear previous question

            const questionData = questions[index];
            const questionText = document.createElement("h3");
            questionText.innerText = questionData.question;
            questionsDisplay.appendChild(questionText);

            const optionsContainer = document.createElement("div");
            questionData.options.forEach(option => {
                const button = document.createElement("button");
                button.innerText = option;
                button.classList.add("option-btn");
                button.addEventListener("click", () => checkAnswer(option, questionData.answer));
                optionsContainer.appendChild(button);
            });

            questionsDisplay.appendChild(optionsContainer);
        } else {
            endQuiz();
        }
    }

    function checkAnswer(selectedOption, correctAnswer) {
        if (selectedOption === correctAnswer) {
            score++;
        }
        index++;
        displayQuestions();
    }

    function endQuiz() {
        questionsPage.style.display = "none";
        scorePage.style.display = "flex";
        scoreDisplay.innerHTML = `<h1>Quiz Completed!</h1>
                               <p>Your Score: ${score} / 10</p>
                               <button onclick="restartQuiz()">Play Again</button>`;
    }

    window.restartQuiz = function () {
        index = 0;
        score = 0;
        scorePage.style.display = "none";
        startPage.style.display = "block";
    };
});
