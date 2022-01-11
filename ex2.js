let questionList = [];
let categoryList = [];
let countId = 0;



function saveForm(){

  questionList = $('#question-text').val();
  categoryList = $('#category-text').val();

  localStorage.setItem("question", JSON.stringify(questionList))
  localStorage.setItem("category", JSON.stringify(categoryList).toUpperCase())
  localStorage.setItem("date", JSON.stringify(getDate()))
  countId++;

  updateTable()
}

function updateTable(){
  let $id = $("<th>", {"scope": "row"});
  let $question = $("<th>");
  let $category = $("<th>");
  let $date = $("<th>");

  $id.prepend(countId);
  $question.prepend(getItemFromStorage("question"));
  $category.prepend(getItemFromStorage("category"));
  $date.prepend(getItemFromStorage("date"));


  let $tableRow = $("<tr>");
  $tableRow.addClass(getItemFromStorage("category").toLowerCase());
  $tableRow.addClass("t-row");
  $tableRow.prepend($id, $question, $category, $date);
  $("#table-body").prepend($tableRow);
}

function filterTable(){
  let whatToFilter = $("#filter-option option:selected").val();
  switch (whatToFilter){
    case "none":
      $(".t-row").removeClass("d-none");
      break;
    case "html":
      $(".t-row").addClass("d-none");
      $(".html").removeClass("d-none");
      break;
    case "css":
      $(".t-row").addClass("d-none");
      $(".css").removeClass("d-none");
      break;
    case "js":
      $(".t-row").addClass("d-none");
      $(".js").removeClass("d-none");
  }
}

function getDate(){
  let today = new Date();
  let date = today.getDate() + "/" + (today.getMonth()+1) + "/" + today.getFullYear();
  return date;
}

function getItemFromStorage(item){
  return JSON.parse(localStorage.getItem(item))
}