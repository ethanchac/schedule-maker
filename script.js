let hoursInSchedule = 0;

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
    hoursInSchedule = endingHours + 12 - startingHours;

}

window.onload = function() {
    populateTimeOptions(); // Populate options on page load
}