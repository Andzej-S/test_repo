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
let keyword = "dog"

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


function clearDiv() {
    try {
        $("#divGiphy").remove();
    } catch (error) {
        console.log(error)
    }
}

$("#button10").on("click", function() {
    let queryUrlGiphy = `https://api.giphy.com/v1/gifs/search?api_key=XJlgVWxiis4H5jkFrxubKXWwMy9SjyEd&q=${keyword}&limit=20&offset=0&rating=g&lang=en`;
  
    $.ajax({
      url: queryUrlGiphy,
      method: "GET"
    })
      .then(function(response) {
        // clear div container with the gif
        clearDiv();

        // create new div container
        let divGiphy = $("<div/>")    
        divGiphy.attr("id", "divGiphy")
        divGiphy.appendTo("body");     
        
        $("<img/>", {
            // get a random image from the search result
            src: response.data[Math.floor(Math.random() * 4) + 1].images.downsized_medium.url,
            alt: keyword,
            class: "giphyImg"
        }).appendTo(divGiphy);

        // create modal
        $( function() {
            $( "#divGiphy" ).dialog({
              modal: true,
              buttons: {
                Ok: function() {
                  $( this ).dialog( "close" );
                }
              }
            });
        });   

      }); //end of .then
   
}); //end of button event

