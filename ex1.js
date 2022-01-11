let text = "";
let count = 0;
let birdNames = ['duck', 'woodpecker', 'whitethroat', 'swan', 'harrier', 'sandpiper', 'wren', 'linnet', 'tern', 'sparrow'];
let placeHolder1 = "d";
let placeHolder2 = "k";
let isItFirst = true;

// List the birds
let birdList = birdNames.slice(count);
updateList();

// Show the user what they should type in the box
guideBird();

// In case of emergency, break glass
const result = document.getElementById('result');

// Input field
const inputBird = document.getElementById('inputBird');
inputBird.addEventListener('keydown', (e) => {
  if (((isItFirst) ? placeHolder1 : placeHolder2) == e.key.toLowerCase()) {
    result.textContent = "Proceed to next character";
    isItFirst = !isItFirst;
    setTimeout(() => {document.getElementById('inputBird').value = "", 750});
    if (isItFirst) progressBird();
  } else {
    result.textContent = "Please re-check the name of the animal.";
    setTimeout(() => {document.getElementById('inputBird').value = "", 750});
  }
})

function guideBird(){
  const pointToBird = document.getElementById('pointToBird');
  const birdImage = document.getElementById('birdImage');
  let thisBird = birdNames[count].charAt(0).toUpperCase() + birdNames[count].slice(1)
  pointToBird.textContent = thisBird;
  birdImage.src = "/assets/" + thisBird + ".png";
}

function updateList(){
  birdList = birdNames.slice(count);
  birdList.forEach(listThemAll);
  function listThemAll(item, index) {
    text += index+1+count + ": " + item + "<br>"; 
  }
  document.getElementById("list").innerHTML = text;
  text = "";
}

// Progressing inputing the names
function progressBird(){
  count++;
  if (count==10) result.textContent = "You completed the task!"; 
  placeHolder1 = birdNames[count].charAt(0);
  placeHolder2 = birdNames[count].slice(-1)[0];
  guideBird();
  updateList();
}

function goBack(){window.location.href = "/index.html";}