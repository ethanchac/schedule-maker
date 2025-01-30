let hoursInSchedule = 0;
let daysOfWeek = 7;
const container = document.querySelector(".schedule-calendar");

function populateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');

    for (let hour = 1; hour <= 12; hour++) {
        let displayHour = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
        startTimeSelect.options.add(new Option(hour + " AM"));
        endTimeSelect.options.add(new Option(hour + " PM"));
    }
    
}


function applyHours() {
    container.innerHTML = "";
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    //To calculate the amount of hours in the day to work
    var startingHours;
    var endingHours;
    if(startTime.length == 5){
        startingHours = Number(startTime.substring(0, 2));
    }else{
        startingHours = Number(startTime.substring(0,1));
    }
    if(endTime.length == 5){
        endingHours = Number(endTime.substring(0,2));
    }else{
        endingHours = Number(endTime.substring(0,1));
    }

    //This variable is important for schedule building
    hoursInSchedule = endingHours + 12 - startingHours;
    createCalendar();

}

function createCalendar(){
    for(let i = 0; i < hoursInSchedule * daysOfWeek; i++){
        const square = document.createElement("div");
        let squareWidth = container.offsetWidth / daysOfWeek;
        let squareHeight = container.offsetHeight / hoursInSchedule;
        squareWidth = Math.floor(squareWidth) - 2;
        squareHeight = Math.floor(squareHeight) - 2;
        square.style.width = `${squareWidth}px`;
        square.style.height = `${squareHeight}px`;
        square.className = "square";
        
        container.appendChild(square);

        console.log(square.style.width);
        console.log(container.offsetWidth);
    }
    console.log(hoursInSchedule);
}

window.onload = function() {
    populateTimeOptions(); // Populate options on page load
}