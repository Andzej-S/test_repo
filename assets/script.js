let index = 0;
let limit = 4;
let queryURL = `https://the-trivia-api.com/api/questions?limit=${limit}&categories=science,history`;

$.ajax({
  url: queryURL,
  method: "GET"
}).then(function (response) {
  $("#button1").on("click", function () {
    index++;
    $(".question").text("");
    $(".answer").text("");
    drawQuestion(response, index);
  });
  console.log(response);
  drawQuestion(response, index);
});

function drawQuestion(collector, index) {
  if (index < limit) {
    $("<h3/>", {
      class: "question",
      html: collector[index].question
    }).appendTo("body");

    let allAnswers = [];
    allAnswers = [...collector[index].incorrectAnswers];
    allAnswers.push(collector[index].correctAnswer);
    allAnswers.sort(() => Math.random() - 0.5);

    allAnswers.forEach(function (element) {
      $("<h5/>", {
        class: "answer",
        html: element
      }).appendTo("body");
    });

    console.log(allAnswers);
  } else {
    console.log("Questions finished");
  }
}