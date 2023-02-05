//https://the-trivia-api.com/api/questions?categories=arts_and_literature&limit=5&difficulty=medium

var quiz;
var questionNumber = 0;
var livesAmount = 3;
//var main = document.getElementById('main');
var questions = document.getElementById('questions');
var scoreElement = document.getElementById('score');
var lives = document.getElementById('lives');
var submitBtn = document.getElementById('submit');
var score = [0,10,100,500,1000,5000,10000,50000,100000,10000000];
var limit = score.length;
var newScore = 0;
let fiftyCount = 1;
let hintCount = 1;

$("#play-button").on("click", function() {
    var categorySelect = document.getElementById('category');
    var categoryValue = categorySelect.value;
    var difficulty = document.getElementById('difficulty');
    var difficultyValue = difficulty.value;

    if(categoryValue == "Category" || difficultyValue == "Difficulty Level"){
        console.log("Please select a category and difficulty!");
        return;
    }

    // when play button is clicked hides a div with play button and unhides divs with quiz and score code
    $(".wrapper .container:first-child").addClass("d-none");
    $(".wrapper .container:nth-child(2)").removeClass("d-none");
    $(".wrapper .container:nth-child(3)").removeClass("d-none");

    var queryURL = "https://the-trivia-api.com/api/questions?categories=" + categoryValue + "&limit=" + limit + "&difficulty=" + difficultyValue;
    
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        quiz = response;
        console.log(response);
        $("#play-button").html("Quiz Started!");
        DisplayQuestion();
      });
      $("#button2").on("click", function() {
        console.log("The answer to the question is : " + quiz[questionNumber].correctAnswer);
        if (questionNumber >= quiz.length){
            console.log("quiz finished");
        }
    })

});

function findElementByText(text) {
    let jSpot = $("button:contains("+ text +")");
    if ($(jSpot).html() == text) {
        $(jSpot).html(`<del>${text}</del>`);
    }      
    
}


function DisplayQuestion(){    
    newScore = score[questionNumber];
    scoreElement.textContent = newScore;
    lives.innerHTML = livesAmount;
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


    // begin add event listener to 50/50 btn
    $("#fifty-fifty").on("click", function(){        
        let arr = []; // select 2 wrong answers 

        for (let j=0; j<2; j++){
            arr.push(quiz[questionNumber].incorrectAnswers[j])
        }

        if (fiftyCount === 1){
            console.log(arr)
            arr.forEach(element => {       
                findElementByText(element);
            })
        }else {
            console.log("help disabled")
        }
        fiftyCount--;
        $("#fifty-fifty").addClass("btn-secondary");
    });

    // begin hint btn add event listener
    $("#hint").on("click", function() {
        let keyword = quiz[questionNumber].correctAnswer;
        let queryUrlGiphy = `https://api.giphy.com/v1/gifs/search?api_key=XJlgVWxiis4H5jkFrxubKXWwMy9SjyEd&q=${keyword}&limit=20&offset=0&rating=g&lang=en`;
        if (hintCount === 1){
            $.ajax({
            url: queryUrlGiphy,
            method: "GET"
            })
            .then(function(response) {
                // clear div container with the gif
                clearDiv();

                // create new div container
                let divGiphy = $("<div/>");    
                divGiphy.attr("id", "divGiphy");
                divGiphy.appendTo("body");     
                
                $("<img/>", {
                    // get a random image from the search result
                    src: response.data[Math.floor(Math.random() * 4) + 1].images.downsized_medium.url,
                    alt: keyword,
                    class: "giphyImg"
                }).appendTo(divGiphy);

                // begin GIF image modal
                $( function() {
                    $( "#divGiphy" ).dialog({
                    modal: true,
                    width: 400,                 

                    });
                });   
                $("#hint").addClass("btn-secondary")
                hintCount--;
            }); //end of .then
        }else{
            console.log("hint unavailable");
            // begin GIF info modal
            $( function() {
                $( "#divGiphyInfo" ).dialog({
                modal: true,         
                });
            });   
            $("#hint").addClass("btn-secondary")   
        }; //end of hint btn event
    });
} // end of DisplayQuestion()

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

// clear old gif from div tag
function clearDiv() {
    try {
        $("#divGiphy").remove();
    } catch (error) {
        console.log(error)
    }
}


// begin How to play modal
$( function() {
    $( "#dialogHelp" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 500
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
      width: 305,
      height: 190,
    });
 
    $( "#help" ).on( "click", function() {
      $( "#dialogHelp" ).dialog( "open" );
    });
});

// Let's start button function and hide functionality
$("#startBtn").on("click", function() {
    // When Let's start button is clicked it changes text and unhides play button div
    $(this).text("Restart Quiz");
    $(".wrapper").removeClass("d-none");

    // When Restart Quiz button is clicked it reloads the page
    $(this).click(function() {
        $(this).text("Let's start");
        location.reload();
    });
});
