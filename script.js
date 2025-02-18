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
    availabilityPerson.classList.remove("open");
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
                    console.log("Availability button clicked for:", personName);

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

function PersonAvailability(name, sun, mon, tue, wed, thur, fri, sat){
    this.name = name;
    this.sun = sun;
    this.mon = mon;
    this.tue= tue;
    this.wed = wed;
    this.thur = thur;
    this.fri = fri;
    this.sat = sat;
    const Person = {
        Name : name,
        Sun : sun,
        Mon : mon,
        Tue : tue,
        Wed : wed,
        Thur : thur,
        Fri : fri,
        Sat : sat
    }
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
        console.log(peopleAvailability);
    }
}

// Initialize the script once the document is fully loaded
document.addEventListener("DOMContentLoaded", function() {

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
            let index = sub.indexOf(day);
            if (index !== -1) {
                sub.splice(index, 1);
            }
        }

        console.log(sub);
        updateNumDays(); // Update the number of days selectable
        button.classList.toggle('selected-day'); // Visual feedback
         
    }
    function updateButtonStyles(person) {
        const buttons = document.querySelectorAll('.availability-days-button button');
        buttons.forEach(button => {
            button.classList.toggle('selected-day', sub[person].has(button.id));
        });
    }

    function updateNumDays() {
        const numDaysContainer = document.querySelector('.availability-num-days');
        numDaysContainer.innerHTML = '';

        const daysSelected = sub.length;
        console.log("Days selected is", daysSelected);
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

const saveButton = document.querySelector("#save-availability");

saveButton.addEventListener("click", function() {
    const currentDiv = document.querySelector('.availability-people-inner');
    const currentPerson = currentDiv.dataset.currentPerson;
    availabilityPerson.classList.remove("open");

    const days = {
        sunday: false,
        monday: false,
        tuesday: false,
        wednesday: false,
        thursday: false,
        friday: false,
        saturday: false
    };

    sub.forEach(day => {
        if (days.hasOwnProperty(day)) {
            days[day] = true;
        }
    });

    const Person = new PersonAvailability(
        currentPerson,
        days.sunday,
        days.monday,
        days.tuesday,
        days.wednesday,
        days.thursday,
        days.friday,
        days.saturday
    );
    Person.addPerson();  // <-- This should only be called when a new person is created
    

    sub = [];
});




window.onload = function(){
    populateTimeOptions();
}