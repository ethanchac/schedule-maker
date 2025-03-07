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

function createCalendar() {
    container.innerHTML = ""; // Clear previous calendar

    let totalContainerHeight = 500 * 0.8; // Fixed container height
    let slotHeight = totalContainerHeight / hoursInSchedule; // Adjust dynamically

    container.style.height = `${totalContainerHeight}px`; // Set fixed height
    container.style.display = "grid";
    container.style.gridTemplateColumns = `auto repeat(${daysOfWeek}, 0.5fr)`; // First column for times, then days
    container.style.gridTemplateRows = `auto repeat(${hoursInSchedule}, 1fr)`; // Adjust rows dynamically

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let startNum = parseInt(document.getElementById('startTime').value) || 1; // Default 8 AM

    // Add an empty top-left corner (where time & days meet)
    const topLeftCorner = document.createElement("div");
    topLeftCorner.className = "corner";
    container.appendChild(topLeftCorner);

    console.log("width IS "+container.offsetWidth);
    console.log("height IS " + container.offsetHeight);

    // Add days of the week as headers
    for (let i = 0; i < daysOfWeek; i++) {
        const dayHeader = document.createElement("div");
        dayHeader.textContent = days[i];
        dayHeader.className = "day-header";
        container.appendChild(dayHeader);
    }

    // Fill in time labels and schedule grid
    for (let i = 0; i < hoursInSchedule; i++) {
        // Create time labels on the left
        const timeLabel = document.createElement("div");
        let hour = startNum + i;
        let ampm = hour >= 12 ? "PM" : "AM";
        hour = hour > 12 ? hour - 12 : hour; // Convert to 12-hour format
        timeLabel.textContent = `${hour} ${ampm}`;
        timeLabel.className = "time-label";
        container.appendChild(timeLabel);

        // Create schedule slots for each day
        for (let j = 0; j < daysOfWeek; j++) {
            const square = document.createElement("div");
            square.style.width = `${container.offsetWidth / daysOfWeek - 2 - 7.1}px`; // Adjust width
            square.style.height = `${slotHeight - 2}px`; // Adjust height dynamically
            square.className = "schedule-slot";
            container.appendChild(square);
        }
    }
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
                nameContainer.dataset.name = name; // Store the name in a data attribute

                // Add the name to the container
                const nameElement = document.createElement("div");
                nameElement.textContent = name;
                nameContainer.appendChild(nameElement);

                // Add the "Availability" button to the container
                const availabilityButton = document.createElement("button");
                availabilityButton.textContent = "Availability"; 
                availabilityButton.className = "availability-button"; // Apply the CSS class
                availabilityButton.addEventListener("click", function () {
                    // Retrieve the name from the data attribute
                    const personName = this.parentElement.dataset.name;
                    //console.log("Availability button clicked for:", personName);

                    // Set the current person in the availability panel
                    const availabilityInner = document.querySelector('.availability-people-inner');
                    availabilityInner.dataset.currentPerson = personName;

                    // Open the availability panel
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
let peopleAvailability = [];
let sub = [];

closeAvailability.addEventListener("click", function(){
    availabilityPerson.classList.remove("open");
});

function openAvailability() {
    availabilityPerson.classList.add("open");
    sub = [];

    const currentDiv = document.querySelector(".availability-people-inner");
    const currentPerson = currentDiv.dataset.currentPerson;
    const existingPersonIndex = peopleAvailability.findIndex(
        (person) => person.name.trim() === currentPerson
    );

    let savedNumDays = 1; // Default to 1, will update if a saved value exists

    if (existingPersonIndex !== -1) {
        const person = peopleAvailability[existingPersonIndex];

        // Loop through all days and check availability
        Object.keys(person).forEach((day) => {
            if (day !== "name" && person[day].available) {
                sub.push(day); // Store selected days
            }
        });

        // Retrieve the saved number of days
        if (person.numDays) {
            savedNumDays = person.numDays; // Store the saved value
        }
    }

    // Generate select elements dynamically
    hoursInput();

    // Restore saved start & end times
    if (existingPersonIndex !== -1) {
        const person = peopleAvailability[existingPersonIndex];

        Object.keys(person).forEach((day) => {
            if (day !== "name" && person[day].available) {
                const startTimeElement = document.getElementById(`startTime-${day}`);
                const endTimeElement = document.getElementById(`endTime-${day}`);

                if (startTimeElement && endTimeElement) {
                    startTimeElement.value = person[day].start;
                    endTimeElement.value = person[day].end;
                }
            }
        });
    }

    updateButtonStyles();
    updateNumDays(savedNumDays); // Pass saved value
}




function PersonAvailability(name, sun, mon, tue, wed, thur, fri, sat){
    this.name = name;
    this.sun = sun;
    this.mon = mon;
    this.tue= tue;
    this.wed = wed;
    this.thur = thur;
    this.fri = fri;
    this.sat = sat;
    this.addPerson = function() {
        const existingPersonIndex = peopleAvailability.findIndex(p => p.name === this.name);
        if (existingPersonIndex === -1) {
            peopleAvailability.push(this);
        } else {
            // Update existing person properties directly
            let existingPerson = peopleAvailability[existingPersonIndex];
            existingPerson.sun = this.sun;
            existingPerson.mon = this.mon;
            existingPerson.tue = this.tue;
            existingPerson.wed = this.wed;
            existingPerson.thur = this.thur;
            existingPerson.fri = this.fri;
            existingPerson.sat = this.sat;
        }
    }
}
function updateButtonStyles() {
    const currentDiv = document.querySelector('.availability-people-inner');
    const currentPerson = currentDiv.dataset.currentPerson;

    // Check if currentPerson exists in the array
    const existingPersonIndex = peopleAvailability.findIndex(person => person.name.trim() === currentPerson);
    const availabilityButtons = document.querySelectorAll(".availability-days-button button"); // Ensure this is correct


    if (existingPersonIndex !== -1) {
        // Remove 'selected-day' from all buttons first
        availabilityButtons.forEach(button => {
            button.classList.remove("selected-day");
        });

        // Add 'selected-day' class based on sub array
        availabilityButtons.forEach(button => {
            const day = button.dataset.day;

            if (day && sub.includes(day)) {  // Ensure day is not undefined
                button.classList.add("selected-day");
            }
        });
    } else {
        // If person doesn't exist, remove all selected days
        availabilityButtons.forEach(button => {
            button.classList.remove("selected-day");
        });
    }
}




// Handling day selections
document.querySelectorAll('.availability-days-button button').forEach(button => {
    button.addEventListener('click', function() {
        toggleDaySelection(this.id, this);
    });
});

function toggleDaySelection(day, button) {
    if (!sub.includes(day)) {
        sub.push(day);
    } else {
        //Removing from sub array
        let index = sub.indexOf(day);
        if (index !== -1) {
            sub.splice(index, 1);
        }
    }

    updateNumDays(); // Update the number of days selectable

    // If no days are selected, remove the class
    if (sub.length === 0) {
        document.querySelectorAll(".availability-days-button button").forEach(btn => {
            btn.classList.remove("selected-day");
        });
    } else {
        button.classList.toggle('selected-day'); // Toggle normally
    }
    hoursInput();
}



//THIS FUNCTION IS FOR HOW MANY DAYS THEY CAN WORK
function updateNumDays(savedValue = 1) { // Default is 1, but we pass saved values
    const numDaysContainer = document.querySelector('.availability-num-days');
    numDaysContainer.innerHTML = '';

    const daysSelected = sub.length;

    if (daysSelected > 0) {
        const selectElement = document.createElement('select');
        
        for (let i = 1; i <= daysSelected; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;

            if (i === savedValue) { // Select previously saved value
                option.selected = true;
            }

            selectElement.appendChild(option);
        }

        numDaysContainer.appendChild(selectElement);
    }
}

function hoursInput() {
    const container = document.querySelector(".hours-of-days");
    container.innerHTML = ""; // Clear old days & select inputs

    for (let i = 0; i < sub.length; i++) {
        const divHolderR = document.createElement("div");
        const divHolderL = document.createElement("div");
        const divFinal = document.createElement("div");

        // Create fresh select elements
        let startTimeSelect = document.createElement("select");
        let endTimeSelect = document.createElement("select");

        // Ensure each select has a unique ID to avoid overlap
        startTimeSelect.id = `startTime-${sub[i]}`;
        endTimeSelect.id = `endTime-${sub[i]}`;

        // Populate start and end time options
        for (let hour = 1; hour <= 12; hour++) {
            startTimeSelect.options.add(new Option(hour + " AM", hour + " AM"));
            endTimeSelect.options.add(new Option(hour + " PM", hour + " PM"));
        }

        divHolderR.textContent = sub[i];
        divHolderL.appendChild(startTimeSelect);
        divHolderL.appendChild(endTimeSelect);
        divFinal.appendChild(divHolderR);
        divFinal.appendChild(divHolderL);
        divFinal.className = "days-hours-container";

        container.appendChild(divFinal);
    }
}

const saveButton = document.querySelector("#save-availability");

saveButton.addEventListener("click", function() {
    const currentDiv = document.querySelector('.availability-people-inner');
    const currentPerson = currentDiv.dataset.currentPerson;
    availabilityPerson.classList.remove("open");

    // Retrieve the number of days selected from the dropdown
    const numDaysSelect = document.querySelector(".availability-num-days select");
    const numDays = numDaysSelect ? parseInt(numDaysSelect.value, 10) : sub.length;

    let availabilityData = {
        name: currentPerson,
        numDays: numDays, // Store number of working days
        sunday: { available: false, start: "", end: "" },
        monday: { available: false, start: "", end: "" },
        tuesday: { available: false, start: "", end: "" },
        wednesday: { available: false, start: "", end: "" },
        thursday: { available: false, start: "", end: "" },
        friday: { available: false, start: "", end: "" },
        saturday: { available: false, start: "", end: "" }
    };

    // Loop through selected days and retrieve working hours
    sub.forEach(day => {
        let startTime = document.getElementById(`startTime-${day}`).value;
        let endTime = document.getElementById(`endTime-${day}`).value;

        if (availabilityData.hasOwnProperty(day)) {
            availabilityData[day] = {
                available: true,
                start: startTime || "N/A",
                end: endTime || "N/A"
            };
        }
    });

    // Check if person already exists in the array
    const existingPersonIndex = peopleAvailability.findIndex(person => person.name === currentPerson);

    if (existingPersonIndex !== -1) {
        peopleAvailability[existingPersonIndex] = availabilityData;
    } else {
        peopleAvailability.push(availabilityData);
    }

    console.log(peopleAvailability); // Debugging - logs the updated availability data

    sub = []; // Clear selection after saving
});

const generateButton = document.querySelector("#generate-schedule");

generateButton.addEventListener("click", function(){
    //Main Algorithms goes in here

});


window.onload = function(){
    applyHours();
    populateTimeOptions();
}