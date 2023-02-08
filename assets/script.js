//https://the-trivia-api.com/api/questions?categories=arts_and_literature&limit=5&difficulty=medium

var quiz;
var questionNumber = 0;
var livesAmount = 3;
//var main = document.getElementById('main');
var questions = document.getElementById('questions');
var scoreElement = document.getElementById('score');
var lives = document.getElementById('lives');
// var submitBtn = document.getElementById('submit');
var submitBtn = $('#submit');
var score = [0,1,2,3,4,5,6,7,8,9,10];
var limit = score.length - 1;
var newScore = 0;
let difficultyValue;
let arrWrongAnswersSelect = []; 
// localStorage.clear();


function findElementByText(text) {
    let jSpot = $("button:contains("+ text +")");
    if ($(jSpot).html() == text) {
        $(jSpot).html(`<del>${text}</del>`);
        $(jSpot).addClass("d-none")
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
                setTimeout(NextQuestion, 1000);
            })
        }
        else{
            $(choiceBtn).on("click", function() {
                WrongAnswer();
            })
        }
    }

    // collect 2 wrong answers for 50-50
    for (let j=0; j<2; j++){
        arrWrongAnswersSelect.push(quiz[questionNumber].incorrectAnswers[j])
    }    
} // end of DisplayQuestion()

function CorrectAnswer(){
    document.getElementById("question-title").style.backgroundColor = "green";
    newScore = score[questionNumber + 1];
    scoreElement.textContent = newScore;
}

function WrongAnswer(){
    document.getElementById("question-title").style.backgroundColor = "red";
    if(livesAmount <= 1){
        livesAmount--;
        setTimeout(YouLost, 1000);
        setTimeout(EndQuiz, 1000);
        return;
    }
    livesAmount--;
    lives.innerHTML = livesAmount;
    setTimeout(NextQuestion, 1000);
}

function NextQuestion(){
    questionNumber++
    $("#question-title").css("backgroundColor", "white");
    if(questionNumber < limit){
        DisplayQuestion();
    }
    else
        setTimeout(EndQuiz, 1000);
}

function EndQuiz(){
    //hide questions and answers, show hidden divs
    lives.innerHTML = livesAmount;
    submitBtn.on("click", saveScore);
    $("#mainQuiz").addClass("d-none");
    $("#submitInitials").removeClass("d-none");
    // if the user wins, do this
    if(newScore == 10){
        // TODO ----------------------------------------------- INSERT COOL GIF OR ANIMATION OR SOMETHING FOR GETTING 10!!!
        console.log("You Won!");
    }
}

function YouLost(){
    console.log("you lost");
}

function YouWon(){
    console.log("You Win!");
    EndQuiz();
}

function saveScore(){
    // submitBtn.on = ("click", function(){
        // Grab the value of the 'initials' element
        let initials = $('#initials').val();    
        // Create a new object with the current score and the initials
        let curentUser = {
            "score" : newScore,
            "user" : initials,
            "difficulty" : difficultyValue
        }

        console.log(curentUser)

        // write curentUser to localStorage
        let arr = [];

        if (JSON.parse(localStorage.getItem("quizHeroHighscores"))) {
            arr = JSON.parse(localStorage.getItem("quizHeroHighscores")); 
            arr.push(curentUser);  
            localStorage.setItem('quizHeroHighscores', JSON.stringify(arr));  


        } else {
            arr.push(curentUser);
            localStorage.setItem('quizHeroHighscores', JSON.stringify(arr));
        }
        $("#submitInitials").addClass("d-none");
    // });
  
}

function writeTable(){
     // remove existing values in table    
    $(".removeTag").each(function(){ $(this).remove()})

    // add from local storage
    // $("#highscoreTable").removeClass("d-none");
    let highscoresArr = JSON.parse(localStorage.getItem('quizHeroHighscores'));

    if (localStorage.getItem('quizHeroHighscores')) {
        
        for(let i = 0; i < highscoresArr.length; i++){
            let tableRows = $("<tr/>");
            tableRows.html( 
                `
                <td class="user display-6 text-center removeTag">
                    <p class="pt-2 text-info">${highscoresArr[i].user}</p>
                </td>
                <td class="level display-6 text-center removeTag">
                    <p class="pt-2 text-info">${highscoresArr[i].difficulty}</p>
                </td> 
                <td class="score display-6 text-center removeTag">              
                    <p class="pt-2 text-info">${highscoresArr[i].score}</p>
                </td>     
                <td class="icon display-6 text-center removeTag">
                    <p class="pt-2 text-info"></p>
                </td>               
                `
            ).appendTo($("#tBody"))            
        }
    } else {
        console.log("no results saved!")
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


// ** MODALS **

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
      height: 230,
    }).attr("class", "text-center m-2");
 
    $( "#help" ).on( "click", function() {
      $( "#dialogHelp" ).dialog("open");
    });
});

// begin GIF hint modal
$( function() {
    $( "#divGiphy" ).dialog({
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
 
    $("#hint").on( "click", function() {
        if($("#hint").attr("class") === "main btn btn-secondary"){
            $( "#divError" ).dialog( "open" );           
        } else {
            let keyword = quiz[questionNumber].correctAnswer;
            let queryUrlGiphy = `https://api.giphy.com/v1/gifs/search?api_key=XJlgVWxiis4H5jkFrxubKXWwMy9SjyEd&q=${keyword}&limit=20&offset=0&rating=g&lang=en`;

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

                $("#hint").removeClass("btn-primary")
                $("#hint").addClass("main btn btn-secondary")
                
            }); //end of .then           
        }
    });
});

// begin 50-50 modal
$( function() {
    $( "#divError" ).dialog({
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


 
    $("#fifty-fifty").on( "click", function() {
        if($("#fifty-fifty").attr("class") === "main btn btn-secondary"){
            $( "#divError" ).dialog("open");       
 
        }else{
            arrWrongAnswersSelect.forEach(element => {       
                findElementByText(element);
            });

            $("#fifty-fifty").removeClass("btn-primary")
            $("#fifty-fifty").addClass("btn-secondary");
        }
    });
});

// begin highscores modal
$( function() {
    $( "#highscoreTable" ).dialog({
      autoOpen: false,
      show: {
        effect: "blind",
        duration: 500
      },
      hide: {
        effect: "explode",
        duration: 1000
      },
      width: 600,
    //   height: 600,
    }).attr("class", "text-center m-2");
 
    $("#highscores").on("click", function(){
        writeTable();
        $("#highscoreTable").removeClass("d-none");
        $( "#highscoreTable" ).dialog("open");
    });
});


//  BTN EVENT LISTENERS
$("#play-button").on("click", function() {
    var categorySelect = $('#category');
    var categoryValue = categorySelect.val();
    var difficulty = $('#difficulty');
    difficultyValue = difficulty.val();

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
    })


// Let's start button function and hide functionality
$("#startBtn").on("click", function () {
  
    // When Let's start button is clicked it changes text and unhides play button div
    $(this).text("Restart Quiz");
    $(".wrapper").removeClass("d-none");

    // When Restart Quiz button is clicked it reloads the page
    $(this).click(function() {
        $(this).text("Let's start");
        location.reload();
    });
});

// show highscores
// $("#highscores").on("click", writeTable);
