//https://the-trivia-api.com/api/questions?categories=arts_and_literature&limit=5&difficulty=medium

var quiz;
var questionNumber = 0;
var livesAmount = 3;
var questions = $('#questions');
var scoreElement = $('#score');
var lives = $('#lives');
let submitBtn = $('#submit');
let score = [0,1,2,3,4,5,6,7,8,9,10];
let limit = score.length - 1;
let newScore = 0;
let difficultyValue;
let arrWrongAnswersSelect = []; 


function findElementByText(text) {
    let jSpot = $("button:contains("+ text +")");
    if ($(jSpot).html() == text) {
        $(jSpot).html(`<del>${text}</del>`);
        $(jSpot).addClass("d-none")
    }   
}

function DisplayQuestion(){   
    newScore = score[questionNumber];
    scoreElement.html(newScore);
    lives.html(livesAmount);
    let allAnswers = [];
    $("#choices").html("");
    $("#question-title").html(quiz[questionNumber].question);

    // loop through each incorrect answer and add to array
    for (let i = 0; i < quiz[questionNumber].incorrectAnswers.length; i++){
        allAnswers.push(quiz[questionNumber].incorrectAnswers[i]); // push incorrect answers to array
    }

    allAnswers.push(quiz[questionNumber].correctAnswer); // push correct answer to array
    allAnswers.sort(() => Math.random() - 0.5);
    
    // generate the choices
    $("#choices").html(
        `<div class="container m-20">
            <div class="row">
                <div class="col-6 text-center hints">
                    <button type="button" class="main choiceBtn btn btn-primary">${allAnswers[0]}</button>
                </div>
                <div class="col-6 text-center hints">
                    <button type="button" class="main choiceBtn btn btn-primary">${allAnswers[1]}</button>
                </div>
            </div>
            <div class="row">
                <div class="col-6 text-center hints">
                    <button type="button" class="main choiceBtn btn btn-primary">${allAnswers[2]}</button>
                </div>
                <div class="col-6 text-center hints">
                    <button type="button" class="main choiceBtn btn btn-primary">${allAnswers[3]}</button>
                </div>
            </div>
        </div>
        `);

    $(".choiceBtn").each(function(index, element) {
        $(this).on("click", function() {
            if ($(this).html() === quiz[questionNumber].correctAnswer) {
                CorrectAnswer();
                setTimeout(NextQuestion, 1000);
            } else {
                WrongAnswer();
            }
        });
    });

    // collect 2 wrong answers for 50-50
    for (let j=0; j<2; j++){
        arrWrongAnswersSelect.push(quiz[questionNumber].incorrectAnswers[j])
    }    
} // end of DisplayQuestion()

function CorrectAnswer(){
    $("#question-title").css("backgroundColor", "green");
    newScore = score[questionNumber + 1];
    scoreElement.textContent = newScore;
}

function WrongAnswer(){
    $("#question-title").css("backgroundColor", "red");
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
    $("#question-title").css("backgroundColor", "transparent");
    if(questionNumber < limit){
        DisplayQuestion();
    }
    else
        setTimeout(EndQuiz, 1000);
}

function EndQuiz() {
    //hide questions and answers, show hidden divs
    lives.innerHTML = livesAmount;
    submitBtn.on("click", saveScore);
    $("#mainQuiz").addClass("opacity-0");
    $("#submitInitials").removeClass("d-none");

    // if the user scores more points than the smallest number in the table, do this
    
    let maxScore;

    if (JSON.parse(localStorage.getItem("quizHeroHighscores")) !== null) {
        maxScore = JSON.parse(localStorage.getItem("quizHeroHighscores"))[0].score;
    }else {
        maxScore = 0;
    }

    if (newScore > maxScore) {  
        // RUN: new high score GIF modal
        var opt = {
            autoOpen: false,
            modal: true,
            title: 'New Record!'
        };

        $(document).ready(function() {
            $("#gifMaxPoints").css({
                "height": 280,    
            });
            $("#maxPoints").dialog(opt).dialog("open");
            $("#maxPoints").removeClass("d-none")
        });
        
        console.log("New Record!");
    }
}

function YouLost(){
    console.log("Quiz Ended. Wrong Answer");
}

function YouWon(){
    console.log("You Win!");
    EndQuiz();
}

function saveScore(){

        // Grab the value of the 'initials' element
        let initials = $('#initials').val();    
        // Create a new object with the current score and the initials
        let curentUser = {
            "score" : newScore,
            "user" : initials,
            "difficulty" : difficultyValue
        }


        // write curentUser to localStorage
        let arr = [];

        if (JSON.parse(localStorage.getItem("quizHeroHighscores"))) {
            arr = JSON.parse(localStorage.getItem("quizHeroHighscores")); 
            arr.push(curentUser);            
            localStorage.setItem('quizHeroHighscores', JSON.stringify(arr));  
            sortHighscores();


        } else {
            arr.push(curentUser);
            localStorage.setItem('quizHeroHighscores', JSON.stringify(arr));
        }
        $("#submitInitials").addClass("d-none");

  
}

function writeTable() {
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
                <td class="user display-8 text-center removeTag">
                    <p class="pt-2 text-secondary">${highscoresArr[i].user}</p>
                </td>
                <td class="level display-8 text-center removeTag">
                    <p class="pt-2 text-secondary">${highscoresArr[i].difficulty}</p>
                </td> 
                <td class="score display-8 text-center removeTag">              
                    <p class="pt-2 text-secondary">${highscoresArr[i].score}</p>
                </td>     
                <td class="icon display-8 text-center removeTag">
                    <p class="pt-2 text-secondary"></p>
                </td>               
                `
            ).appendTo($("#tBody"))            
        }
    } else {
        console.log("no results saved localy!")
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

function sortHighscores() {
    let highscoresSorted = JSON.parse(localStorage.getItem("quizHeroHighscores"));
    highscoresSorted.sort((a, b) => a.score - b.score).reverse();

    localStorage.setItem('quizHeroHighscores', JSON.stringify(highscoresSorted));
}


// ** MODALS **

// DEFINE: new high score GIF modal
$(function () {
    $("#dialogHelp").dialog({
        autoOpen: false,
        show: {
            effect: "blind",
            duration: 500
        },
        hide: {
            effect: "explode",
            duration: 1000
        }
        // width: 305,
        // height: 230
    });
});


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
      height: 230      
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
      title: "HIGHSCORES"
    //   height: 600,
    }).attr("class", "text-center m-2");
 
    $("#highscores").on("click", function(){
        writeTable();
        $("#highscoreTable").removeClass("d-none");
        $( "#highscoreTable" ).dialog("open");
    });
});


//  BUTTONS EVENT LISTENERS
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
    $(".wrapper .container:first-child").addClass("opacity-0");
    $(".wrapper .container:nth-child(2)").removeClass("opacity-0");
    $(".wrapper .container:nth-child(3)").removeClass("opacity-0");
  
    var queryURL = "https://the-trivia-api.com/api/questions?categories=" + categoryValue + "&limit=" + limit + "&difficulty=" + difficultyValue;
    

    $.ajax({
      url: queryURL,
      method: "GET"
    })
      .then(function(response) {
        quiz = response;
        $("#play-button").html("Quiz Started!");
        DisplayQuestion();
      });
})


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

$("#resetScores").on("click", function(){
    localStorage.clear();
    location.reload();
});

$("#resetScores").mouseover(function(){
    // INITIALIZE TOOLTIPS
    // const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
    var tooltip = new bootstrap.Tooltip($("#resetScores"));
});

const $tooltip = $('[data-bs-toggle="tooltip"]');
 $tooltip.tooltip({
   html: true,
   trigger: 'mouseleave',
   placement: 'bottom',
 });
 $tooltip.on('show.bs.tooltip', () => {
   $('.tooltip').not(this).remove();
 });