//https://the-trivia-api.com/api/questions?categories=arts_and_literature&limit=5&difficulty=medium

var catagory = "history";
var difficulty = "medium";
var quiz;
var questionNumber = 0;
var livesAmount = 3;
var main = document.getElementById('main');
var questions = document.getElementById('questions');
var scoreElement = document.getElementById('score');
var lives = document.getElementById('lives');
var submitBtn = document.getElementById('submit');
var score = [0,10,100,500,1000,5000,10000,50000,100000,10000000];
var limit = score.length;
var newScore = 0;

$("#button1").on("click", function() {
    var queryURL = "https://the-trivia-api.com/api/questions?categories=" + catagory + "&limit=" + limit + "&difficulty=" + difficulty;
    
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        quiz = response;
        console.log(response);
        $("#button1").html("Quiz Started!");
        if(main.classList.contains('hide')){
            main.classList.remove('hide');
        }
        else
        {
            main.classList.add('hide')
        }
        // hide main div, show questions
        DisplayQuestion();
      });
      $("#button2").on("click", function() {
        console.log("The answer to the question is : " + quiz[questionNumber].correctAnswer);
        if (questionNumber >= quiz.length){
            console.log("quiz finished");
        }
    })

});

function DisplayQuestion(){
    newScore = score[questionNumber];
    scoreElement.textContent = newScore;
    lives.innerHTML = livesAmount;
    if(questions.classList.contains('hide')){
        questions.classList.remove('hide');
    }
    var allAnswers = [];
    choices.innerHTML = "";
    document.getElementById("question-title").innerHTML = quiz[questionNumber].question;

    // loop through each incorrect answer and add to array
    for (var i = 0; i < quiz[questionNumber].incorrectAnswers.length; i++){
        allAnswers.push(quiz[questionNumber].incorrectAnswers[i]); // push incorrect answers to array
    }

    allAnswers.push(quiz[questionNumber].correctAnswer); // push correct answer to array
    allAnswers.sort(() => Math.random() - 0.5);
    
    for (var i = 0; i < allAnswers.length; i++){
        var choiceBtn = document.createElement("button");
        choiceBtn.textContent = allAnswers[i];
        choices.appendChild(choiceBtn);
        if(quiz[questionNumber].correctAnswer == allAnswers[i]){
            $(choiceBtn).on("click", function() {
                CorrectAnswer();
                NextQuestion();
            })
        }
        else{
            $(choiceBtn).on("click", function() {
                WrongAnswer();
            })
        }
    }
}

function CorrectAnswer(){
    alert("Correct!");
    newScore = score[questionNumber + 1];
    scoreElement.textContent = newScore;
    console.log(newScore);
}


function WrongAnswer(){
    alert("Incorrect!");
    if(livesAmount <= 1){
      EndQuiz();
    }
    livesAmount--;
    lives.innerHTML = livesAmount;
}

function NextQuestion(){
    questionNumber++
    if(questionNumber < limit){
        DisplayQuestion();
    }
    else
        EndQuiz();
}

function EndQuiz(){
    //hide questions and answers, show hidden divs
    alert("you lost the quiz!");
    submitBtn.addEventListener("click", saveScore());
}

function saveScore(){
  submitBtn.onclick = function(){
    // Grab the value of the 'initials' element
    var initials = document.getElementById('initials').value;
    // Create a new object with the current score and the initials
    var newScores = {
        "score" : newScore,
        "initials" : initials
    }
    // get existing data from local storage
    var existingScores = JSON.parse(localStorage.getItem("newScores")) || [];
    // add new score to existing data
    existingScores.push(newScores);
    // save updated data to local storage
    localStorage.setItem("newScores", JSON.stringify(existingScores));
    console.log(localStorage.getItem('newScores'));
  }

}

