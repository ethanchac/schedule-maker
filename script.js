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
        startTimeSelect.options.add(new Option(hour + " AM"));
        endTimeSelect.options.add(new Option(hour + " PM"));
    }
    
}
const closeAvailability = document.querySelector("#close");
const availabilityPerson = document.getElementById("availability-people");
const availabilityInside = document.querySelector(".availability-people-inner");

availabilityPerson.classList.remove("open");

closeAvailability.addEventListener("click", function(){
    availabilityPerson.classList.remove("open");;
});

function openAvailability(){
    availabilityPerson.classList.add("open");
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
                    if (availabilityPerson) {
                        openAvailability();
                    }
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
// Global availability storage
let peopleAvailability = {};


// Initialize the script once the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {
    const createPersonButton = document.querySelector("#add-person");
    const peopleList = document.querySelector("#scheduled-people");

    // Add new person
    createPersonButton.addEventListener("click", function() {
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.placeholder = "Enter name";
        inputField.style.width = "100px";

        createPersonButton.replaceWith(inputField);
        inputField.focus();

        inputField.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                const name = inputField.value.trim();
                if (name) {
                    createPersonEntry(name, peopleList, createPersonButton);
                    inputField.replaceWith(createPersonButton);
                }
            }
        });
    });

    function createPersonEntry(name, peopleList, button) {
        const nameContainer = document.createElement("div");
        nameContainer.className = "scheduled-people-div";
        nameContainer.style.display = "flex";
        nameContainer.style.alignItems = "center";
        nameContainer.style.marginBottom = "5px";

        const nameElement = document.createElement("div");
        nameElement.textContent = name;
        nameContainer.appendChild(nameElement);

        const availabilityButton = document.createElement("button");
        availabilityButton.textContent = "Set Availability";
        availabilityButton.className = "availability-button";
        availabilityButton.addEventListener("click", () => openAvailability(name));

        nameContainer.appendChild(availabilityButton);
        peopleList.appendChild(nameContainer);

        // Initialize the new person's availability set
        peopleAvailability[name] = new Set();
    }

    // Handling day selections
    document.querySelectorAll('.availability-days-button button').forEach(button => {
        button.addEventListener('click', function() {
            toggleDaySelection(this.id, this);
        });
    });

    function toggleDaySelection(day, button) {
        const currentPerson = document.querySelector('.availability-people-inner').dataset.currentPerson;
        if (!peopleAvailability[currentPerson]) {
            peopleAvailability[currentPerson] = new Set();
        }

        if (peopleAvailability[currentPerson].has(day)) {
            peopleAvailability[currentPerson].delete(day);
        } else {
            peopleAvailability[currentPerson].add(day);
        }

        button.classList.toggle('selected-day'); // Visual feedback
        updateNumDays(currentPerson); // Update the number of days selectable
    }

    function openAvailability(person) {
        const availabilityInner = document.querySelector('.availability-people-inner');
        availabilityInner.dataset.currentPerson = person;
        updateButtonStyles(person);
    }

    function updateButtonStyles(person) {
        const buttons = document.querySelectorAll('.availability-days-button button');
        buttons.forEach(button => {
            button.classList.toggle('selected-day', peopleAvailability[person].has(button.id));
        });
    }

    function updateNumDays(person) {
        const numDaysContainer = document.querySelector('.availability-num-days');
        numDaysContainer.innerHTML = '';

        const daysSelected = peopleAvailability[person].size;
        if (daysSelected > 0) {
            const selectElement = document.createElement('select');
            for (let i = 1; i <= daysSelected; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                selectElement.appendChild(option);
            }
            numDaysContainer.appendChild(selectElement);
        }
    }
});



window.onload = function(){
    populateTimeOptions();
}