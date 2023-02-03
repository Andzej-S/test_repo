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
let keyword = "dog";
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


    var queryURL = "https://the-trivia-api.com/api/questions?categories=" + categoryValue + "&limit=" + limit + "&difficulty=" + difficultyValue;
    
    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        quiz = response;
        console.log(response);
        $("#play-button").html("Quiz Started!");
        /*if(main.classList.contains('hide')){
            main.classList.remove('hide');
        }
        else
        {
            main.classList.add('hide')
        }*/
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
    /*if(questions.classList.contains('hide')){
        questions.classList.remove('hide');
    }*/
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

    // add event listener to 50/50 btn
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
        $("#fifty-fifty").addClass("btn-secondary")
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


function clearDiv() {
    try {
        $("#divGiphy").remove();
    } catch (error) {
        console.log(error)
    }
}

$("#hint").on("click", function() {
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
            $("#hint").addClass("btn-secondary")
        }); //end of .then
    }else{
        console.log("hint unavailable")
    }

   
}); //end of button event

