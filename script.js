let hoursInSchedule = 0;
let daysOfWeek = 7;
const container = document.querySelector(".calendar");
const settingsButton = document.querySelector("#settings");
const addPersonButton = document.querySelector("#add-person");
const scheduledPeople = document.querySelector(".scheduled-people");

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
        let squareWidth = container.offsetWidth / daysOfWeek - 2;
        let squareHeight = container.offsetHeight / hoursInSchedule - 2;
        square.style.width = `${squareWidth}px`;
        square.style.height = `${squareHeight}px`;
        square.className = "square";
        
        container.appendChild(square);

        console.log(square.style.width);
        console.log(container.offsetWidth);
    }
    console.log(hoursInSchedule);
}
settingsButton.addEventListener("click", function(){
    
});
addPersonButton.addEventListener("click", function () {
    // Replace the image with an input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Enter name";
    inputField.style.width = "100px"; // Adjust width as needed

    // Replace the image with the input field
    addPersonButton.replaceWith(inputField);
    inputField.focus(); // Focus on the input field

    // Listen for the "Enter" key press
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            const name = inputField.value.trim();

            if (name) {
                // Create a container for the name and button
                const nameContainer = document.createElement("div");
                nameContainer.style.display = "flex"; // Use flexbox for alignment
                nameContainer.style.alignItems = "center"; // Vertically center items
                nameContainer.style.marginBottom = "5px"; // Add some spacing between entries
                nameContainer.className = "scheduled-people-div";

                // Add the name to the container
                const nameElement = document.createElement("div");
                nameElement.textContent = name;
                nameContainer.appendChild(nameElement);

                // Add the "Availability" button to the container
                const availabilityButton = document.createElement("button");
                availabilityButton.textContent = "Availability";
                availabilityButton.className = "availability-button"; // Apply the CSS class
                availabilityButton.addEventListener("click", function () {
                    //Important stuff here
                });
                nameContainer.appendChild(availabilityButton);

                // Add the container to the scheduled-people div
                scheduledPeople.appendChild(nameContainer);
            }

            // Restore the image
            inputField.replaceWith(addPersonButton);
        }
    });
});
window.onload = function() {
    populateTimeOptions(); // Populate options on page load
}