// grab ids
const counterEl = document.getElementById("counter");
const startEl = document.getElementById("start");
const nextEl = document.getElementById("next");
const mainEl = document.getElementById("main");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const timerEl = document.getElementById("timer");
const rightorwrongEl = document.getElementById("rightorwrong");
const allAnswers = Array.from(document.querySelectorAll(".answerButton"));
const optionA = document.getElementById("A");
const optionB = document.getElementById("B");
const optionC = document.getElementById("C");
const optionD = document.getElementById("D");

// declare variables
let questionCounter;
let maxQuestions = 10;
let quiz = {};
let finalScore;
let timer;
let questions = [];
let allQuestions;
let currentQuestion;
let currentQuestionIndex = 0;

function fetchQuestions() {
 fetch("https://opentdb.com/api.php?amount=10&category=23&type=multiple")
  .then((response) => {
   return response.json();
  })
  .then((data) => {
   const results = data.results;
   results.forEach(function (result) {
    answers = shuffle([...result.incorrect_answers, result.correct_answer]);
    temp = {
     question: result.question,
     allOptions: answers,
     correctAnswer: result.correct_answer,
    };
    questions.push(temp);
   });
   console.log(questions);
   startQuiz();
  })
  .catch((err) => {
   console.error(err);
  });
}

startEl.addEventListener("click", () => {
 fetchQuestions();
});

nextEl.addEventListener("click", () => {
 questionCounter++;
 if (questionCounter == maxQuestions) {
  nextEl.innerText = "FINISH QUIZ";
 }
 nextQuestion();
});

function startQuiz() {
 questionCounter = 1;
 allQuestions = [...questions];
 currentQuestion = allQuestions[currentQuestionIndex];
 startCountdown();
 nextQuestion();
 counterEl.innerText = `${questionCounter} of ${maxQuestions}`;
 startEl.classList.add("hide");
 mainEl.classList.remove("hide");
 timerEl.classList.remove("hide");
 counterEl.classList.remove("hide");
 nextEl.innerHTML = "NEXT";
 nextEl.classList.remove("hide");
 rightorwrongEl.classList.remove("hide");
 rightorwrongEl.innerHTML =
  '<i class="fa fa-question fa-3x" style="color:red"></i>';
}

function nextQuestion() {
 if (questionCounter > maxQuestions) {
  nextEl.innerText = "FINISH QUIZ";
  finishQuiz();
  clearInterval(timer);
  startEl.classList.remove("hide");
 } else {
  currentQuestion = allQuestions[currentQuestionIndex];
  showQuestion(currentQuestion);
  rightorwrongEl.innerHTML =
   '<i class="fa fa-question fa-3x" style="color:red"></i>';
  counterEl.innerText = `${questionCounter} of ${maxQuestions}`;
 }
}

function showQuestion(quiz) {
 questionEl.textContent = quiz.question;
 optionA.textContent = quiz.allOptions[0];
 optionB.textContent = quiz.allOptions[1];
 optionC.textContent = quiz.allOptions[2];
 optionD.textContent = quiz.allOptions[3];

 checkAnswer();
}

function checkAnswer() {
 allAnswers.find((answer) => {
  answer.addEventListener("click", (event) => {
   const buttonText = event.target.textContent;
   buttonText == currentQuestion.correctAnswer ? rightAnswer() : wrongAnswer();
  });
 });
 sliceQuestion();

 console.log(allQuestions);
}

function rightAnswer() {
 rightorwrongEl.innerHTML =
  '<i class="fa fa-check-circle fa-3x" style="color:green"></i>';
}

function wrongAnswer() {
 rightorwrongEl.innerHTML =
  '<i class="fa fa-times fa-3x" style="color:red"></i>';
}

function shuffle(array) {
 return array.sort(() => 0.5 - Math.random());
}

function sliceQuestion() {
 allQuestions.splice(currentQuestionIndex, 1);
}

function startCountdown() {
 const fullTime = 5;
 let time = fullTime * 60;
 timer = setInterval(() => {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  seconds = seconds < 10 ? "0" + seconds : seconds;
  if (time <= 0) {
   clearInterval(timer);
   finishQuiz();
  }
  timerEl.innerHTML = `${minutes}:${seconds} remaining`;
  time--;
 }, 1000);
}

function finishQuiz() {
 mainEl.classList.add("hide");
 nextEl.classList.add("hide");
 rightorwrongEl.classList.add("hide");
 location.reload();
}