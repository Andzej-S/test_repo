//https://the-trivia-api.com/api/questions?categories=arts_and_literature&limit=5&difficulty=medium

var catagory = "history";
var limit = "5";
var difficulty = "medium";
var quiz;
var questionNumber = 0;
var livesAmount = 3;
var main = document.getElementById('main');
var questions = document.getElementById('questions');
var lives = document.getElementById('lives');

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
}


function WrongAnswer(){
    alert("Incorrect!");
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
}