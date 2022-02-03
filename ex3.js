////////////////////////////////////////////////////
// Constructor
////////////////////////////////////////////////////

// Import
import { dbRef } from './firebase.js';

// Global variables
let getBoard = document.getElementById('canvas-base');
let circleTemplate = new Array(64);
let colorSelect = '#FF0000';

let getToday = "";
let emojiName = "";
let today = new Date();

const getOffSet = {
    left() { return getBoard.offsetLeft },
    top() { return getBoard.offsetTop }
}

// Initialize circleTemplate
for (let i = 0; i < 64; i++) {
    circleTemplate[i] = {
        posX: i % 8,
        posY: Math.floor(i / 8),
        isOn: false,
        color: '#FF0000'
    }
}



////////////////////////////////////////////////////
// Main
////////////////////////////////////////////////////

jQuery(function ($) {
    // LED board rendering
    function renderBoard(id, size) {
        let context = document.getElementById(id).getContext('2d');
        context.fillStyle = '#000000';
        context.fillRect(0, 0, size, size);
    }

    // Circle rendering
    function renderCircle(id, row, column, isOn, color, scale) {
        let context = document.getElementById(id).getContext('2d');
        let centerX = (row * 50 + 25) / scale;
        let centerY = (column * 50 + 25) / scale;
        let radius = 20 / scale;

        context.beginPath();
        context.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
        context.fillStyle = ((isOn) ? color : '#FFFFFF');
        context.fill();
        context.stroke();
    }

    // Save to Firebase
    function sendToFirebase(emojiName, emojiArray, emojiDate) {
        dbRef.doc(emojiName).set({
            name: emojiName,
            date: emojiDate,
        });
        console.log(emojiArray)
        emojiArray.forEach((bit, index) => {
            let bitId = "";
            if (Math.floor(index / 10) > 0) {
                bitId = index.toString();
            } else bitId = "0" + index.toString();
            dbRef.doc(emojiName).collection('canvas').doc(bitId).set({
                posX: bit.posX,
                posY: bit.posY,
                isOn: bit.isOn,
                color: bit.color
            }).then(() => console.log("Finish the ", index, "ones."))
                .catch((error) => { "Error: ", error })
        });
    }



    ////////////////////////////////////////////////////
    // Constructing the base board
    ////////////////////////////////////////////////////

    // Black drawing board
    renderBoard("canvas-base", 400);

    // 64 blank circles
    let baseCircles = JSON.parse(JSON.stringify(circleTemplate));
    for (let i = 0; i < 64; i++) {
        renderCircle("canvas-base", baseCircles[i].posX, baseCircles[i].posY, baseCircles[i].isOn, baseCircles[i].color, 1);
    }

    // Add base LED board's on-click functions
    getBoard.addEventListener('click', (e) => {
        let getX = Math.floor((e.pageX - getOffSet.left()) / 50);
        let getY = Math.floor((e.pageY - getOffSet.top()) / 50);
        let position = 8 * getY + getX;
        baseCircles[position].isOn = !baseCircles[position].isOn;
        baseCircles[position].color = colorSelect;
        renderCircle("canvas-base", getX, getY, baseCircles[position].isOn, baseCircles[position].color, 1);
        console.log(baseCircles)
    })

    ////////////////////////////////////////////////////
    // Constructing the other boards (a.k.a database -> table)
    ////////////////////////////////////////////////////

    // Get the database
    function getDatabase() {
        let rowId = 0;
        dbRef.get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {

                // Get the circles from the database in each row
                let dbCircle = R.clone(circleTemplate);
                doc.ref.collection("canvas").get()
                    .then((querySnapshot) => {
                        // HTML for each row
                        let $idEmo = $("<th>", { "scope": "row" });
                        let $canvasEmo = $("<th>");
                        let $nameEmo = $("<th>");
                        let $dateEmo = $("<th>");
                        let $canvasEmoContent = $("<canvas>")
                        $canvasEmoContent.attr({
                            width: "100",
                            height: "100",
                            id: "db-canvas-" + rowId
                        });

                        // Prepend data into one row
                        $idEmo.prepend(rowId);
                        $canvasEmo.prepend($canvasEmoContent);
                        $nameEmo.prepend(doc.data().name);
                        $dateEmo.prepend(doc.data().date);

                        let $tableRow = $("<tr>");
                        $tableRow.addClass("t-row");
                        $tableRow.prepend($idEmo, $canvasEmo, $nameEmo, $dateEmo);
                        $("#emoji-table-body").append($tableRow);
                        querySnapshot.forEach((bit) => {
                            let i = 8 * bit.data().posY + bit.data().posX;
                            dbCircle[i].posX = bit.data().posX;
                            dbCircle[i].posY = bit.data().posY;
                            dbCircle[i].isOn = bit.data().isOn;
                            dbCircle[i].color = bit.data().color;
                        });
                    })
                    .then(() => {
                        makeDatabaseCanvas("db-canvas-" + rowId, dbCircle)
                        rowId++;
                    })

            });
        });
    }

    // Apply circle array into canvas
    function makeDatabaseCanvas(id, dCircle) {
        renderBoard(id, 100);
        for (let i = 0; i < 64; i++) {
            renderCircle(id, dCircle[i].posX, dCircle[i].posY, dCircle[i].isOn, dCircle[i].color, 4);
        }
    }

    getDatabase();
    ////////////////////////////////////////////////////
    // JQuery functionality 
    ////////////////////////////////////////////////////

    // Save function
    $('#save-emoji').click(() => {
        if ($('#emoji-name-input').val() == "") alert("Cannot be empty!");
        else {
            emojiName = $('#emoji-name-input').val();
            getToday = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
            sendToFirebase(emojiName, baseCircles, getToday);
            $("#nameForm").modal('hide');
            $("#emoji-save-result").append("Emoji has been saved!")
        }
    })

    // Change color function - choosing color for the LED
    $("#led-color-option").change(() => { colorSelect = $("#led-color-option option:selected").val() })

    // Reset function
    $("#reset-base-led").click(() => {
        baseCircles = R.clone(circleTemplate);
        for (let i = 0; i < 64; i++) {
            renderCircle("canvas-base", baseCircles[i].posX, baseCircles[i].posY, baseCircles[i].isOn, baseCircles[i].color);
        }
    })



    // Console

})