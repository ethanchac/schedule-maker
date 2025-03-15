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

// Global variables with unique names
let calendarGridContainer;
let weekDayCount = 7;

// Populate the time selectors with proper values
function populateTimeSelectors() {
    const startSelect = document.getElementById('startTime');
    const endSelect = document.getElementById('endTime');
    
    // Only populate if not already populated
    if (startSelect.options.length === 0) {
        // Add AM hours (1-12)
        for (let i = 1; i <= 12; i++) {
            let value = i; // Store actual hour value
            if (i === 12) value = 12; // 12 AM is hour 0 in 24-hour format
            let text = `${i} AM`;
            startSelect.add(new Option(text, value));
            endSelect.add(new Option(text, value));
        }
        
        // Add PM hours (1-12)
        for (let i = 1; i <= 12; i++) {
            let value = i + 12; // Add 12 for PM hours in 24-hour format
            if (i === 12) value = 12; // 12 PM is hour 12 in 24-hour format
            let text = `${i} PM`;
            startSelect.add(new Option(text, value));
            endSelect.add(new Option(text, value));
        }
        
        // Set default values
        startSelect.value = 5; // 5 AM
        endSelect.value = 23; // 11 PM
    }
}

// Apply the selected time range
function applyHours() {
    console.clear(); // Clear console for debugging
    
    // Get selected values from selectors
    const startSelectVal = document.getElementById('startTime').value;
    const endSelectVal = document.getElementById('endTime').value;
    
    // Convert to numbers
    const startHour = parseInt(startSelectVal);
    const endHour = parseInt(endSelectVal);
    
    console.log("Start Hour:", startHour);
    console.log("End Hour:", endHour);
    
    // Rebuild the calendar with the new time range
    buildCalendarTable(startHour, endHour);
}

// Build the calendar table
function buildCalendarTable(startHour = 5, endHour = 23) { // Default 5 AM to 11 PM
    calendarGridContainer = document.querySelector('.calendar');
    calendarGridContainer.innerHTML = ""; // Clear previous calendar
    
    // Calculate number of hours to display
    let hoursToShow;
    
    // Handle crossing midnight case
    if (endHour <= startHour) {
        hoursToShow = (24 - startHour) + endHour;
    } else {
        hoursToShow = endHour - startHour;
    }
    
    console.log("Hours to show:", hoursToShow);
    
    // Create a div to hold the table with fixed layout
    const calendarWrapper = document.createElement('div');
    calendarWrapper.style.display = 'flex';
    calendarWrapper.style.flexDirection = 'column';
    calendarWrapper.style.height = '100%';
    calendarWrapper.style.width = '100%';
    
    // Get day names and dates for headers
    const today = new Date();
    const dayOfWeek = today.getDay();
    const sunday = new Date(today);
    sunday.setDate(today.getDate() - dayOfWeek);
    const dayNames = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const dayDates = [];
    
    for (let i = 0; i < weekDayCount; i++) {
        const day = new Date(sunday);
        day.setDate(sunday.getDate() + i);
        dayDates.push(day.getDate());
    }
    
    // Create header row
    const headerRow = document.createElement('div');
    headerRow.style.display = 'flex';
    headerRow.style.width = '100%';
    headerRow.style.flexShrink = '0';
    
    // Create EST header cell
    const estHeader = document.createElement('div');
    estHeader.textContent = 'EST';
    estHeader.style.border = '1px solid #FFFFFF';
    estHeader.style.backgroundColor = '#FFFFFF';
    estHeader.style.padding = '8px';
    estHeader.style.textAlign = 'center';
    estHeader.style.flex = '0 0 60px'; // Same width as time cells
    headerRow.appendChild(estHeader);
    
    // Create day header cells
    for (let i = 0; i < weekDayCount; i++) {
        const dayHeader = document.createElement('div');
        dayHeader.innerHTML = `${dayNames[i]}<br>${dayDates[i]}`;
        dayHeader.style.border = '1px solid #FFFFFF';
        dayHeader.style.backgroundColor = '#FFFFFF';
        dayHeader.style.padding = '8px';
        dayHeader.style.textAlign = 'center';
        dayHeader.style.flex = '1'; // Same flex as day cells
        headerRow.appendChild(dayHeader);
    }
    
    calendarWrapper.appendChild(headerRow);
    
    // Create body div with flex grow to fill remaining space
    const bodyDiv = document.createElement('div');
    bodyDiv.style.flex = '1';
    bodyDiv.style.display = 'flex';
    bodyDiv.style.flexDirection = 'column';
    bodyDiv.style.overflow = 'hidden'; // Prevent scrolling
    
    // Create time rows as flex items
    for (let i = 0; i < hoursToShow; i++) {
        const rowDiv = document.createElement('div');
        rowDiv.style.display = 'flex';
        rowDiv.style.flex = '1'; // Each row takes equal space
        rowDiv.style.width = '100%';
        rowDiv.style.minHeight = '0'; // Allow shrinking below content size
        
        // Calculate the current hour (handling 24-hour wrap)
        const currentHour = (startHour + i) % 24;
        
        // Format the time display (12-hour with AM/PM)
        let displayHour = currentHour % 12;
        if (displayHour === 0) displayHour = 12;
        const ampm = currentHour >= 12 ? 'PM' : 'AM';
        
        // Create time cell
        const timeCell = document.createElement('div');
        timeCell.textContent = `${displayHour} ${ampm}`;
        timeCell.style.border = '1px solid #FFFFFF';
        timeCell.style.backgroundColor = '#FFFFFF';
        timeCell.style.padding = '8px';
        timeCell.style.display = 'flex';
        timeCell.style.alignItems = 'center';
        timeCell.style.justifyContent = 'center';
        timeCell.style.flex = '0 0 60px'; // Fixed width for time column
        rowDiv.appendChild(timeCell);
        
        // Create day cells
        for (let j = 0; j < weekDayCount; j++) {
            const dayCell = document.createElement('div');
            dayCell.style.border = '1px solid #e0e0e0';
            dayCell.style.flex = '1'; // Each day cell takes equal horizontal space
            dayCell.style.display = 'flex';
            dayCell.style.alignItems = 'center';
            dayCell.style.justifyContent = 'center';
            dayCell.setAttribute('data-hour', currentHour);
            dayCell.setAttribute('data-day', j);
            rowDiv.appendChild(dayCell);
        }
        
        bodyDiv.appendChild(rowDiv);
    }
    
    calendarWrapper.appendChild(bodyDiv);
    calendarGridContainer.appendChild(calendarWrapper);
}


document.addEventListener('DOMContentLoaded', function() {
    const settingsButton = document.getElementById('settings');
    const settingsPopup = document.getElementById('settingsPopup');
    const closeSettings = document.getElementById('closeSettings');
    const saveSettings = document.getElementById('saveSettings');
    const useCustomWorkers = document.getElementById('useCustomWorkers');
    const customDaysContainer = document.getElementById('customDaysContainer');
    
    // Open settings popup
    settingsButton.addEventListener('click', function() {
        settingsPopup.classList.add('open');
    });
    
    // Close settings popup
    closeSettings.addEventListener('click', function() {
        settingsPopup.classList.remove('open');
    });
    
    // Toggle custom days container
    useCustomWorkers.addEventListener('change', function() {
        if (this.checked) {
            customDaysContainer.classList.add('show');
        } else {
            customDaysContainer.classList.remove('show');
        }
    });
    
    // Save settings and close popup
    saveSettings.addEventListener('click', function() {
        // Get general worker values
        const minWorkers = parseInt(document.getElementById('minWorkers').value);
        const maxWorkers = parseInt(document.getElementById('maxWorkers').value);
        const useCustom = document.getElementById('useCustomWorkers').checked;
        
        // Get custom day-specific values if enabled
        let customWorkerSettings = {};
        if (useCustom) {
            const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
            days.forEach(day => {
                customWorkerSettings[day] = {
                    min: parseInt(document.getElementById(day + 'Min').value),
                    max: parseInt(document.getElementById(day + 'Max').value)
                };
            });
        }
        
        // Get hours per worker settings
        const minHoursPerWorker = parseInt(document.getElementById('minHoursPerWorker').value);
        const maxHoursPerWorker = parseInt(document.getElementById('maxHoursPerWorker').value);
        
        // Create settings object
        const settings = {
            minWorkers,
            maxWorkers,
            useCustomWorkerSettings: useCustom,
            customWorkerSettings,
            minHoursPerWorker,
            maxHoursPerWorker
        };
        
        console.log('Saving settings:', settings);
        
        // You might want to save these settings to localStorage
        localStorage.setItem('scheduleSettings', JSON.stringify(settings));
        
        // Close the popup
        settingsPopup.classList.remove('open');
    });
    
    // Load saved settings if they exist
    function loadSavedSettings() {
        const savedSettings = localStorage.getItem('scheduleSettings');
        if (savedSettings) {
            const settings = JSON.parse(savedSettings);
            
            // Apply the saved settings to the form
            document.getElementById('minWorkers').value = settings.minWorkers;
            document.getElementById('maxWorkers').value = settings.maxWorkers;
            document.getElementById('useCustomWorkers').checked = settings.useCustomWorkerSettings;
            
            if (settings.useCustomWorkerSettings) {
                customDaysContainer.classList.add('show');
                const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
                days.forEach(day => {
                    if (settings.customWorkerSettings[day]) {
                        document.getElementById(day + 'Min').value = settings.customWorkerSettings[day].min;
                        document.getElementById(day + 'Max').value = settings.customWorkerSettings[day].max;
                    }
                });
            }
            
            // Load hours per worker settings if they exist
            if (settings.minHoursPerWorker !== undefined) {
                document.getElementById('minHoursPerWorker').value = settings.minHoursPerWorker;
            }
            if (settings.maxHoursPerWorker !== undefined) {
                document.getElementById('maxHoursPerWorker').value = settings.maxHoursPerWorker;
            }
        }
    }
    
    // Load settings when the page loads
    loadSavedSettings();
});


addPersonButton.addEventListener("click", function () {
    // Replace the image with an input field
    const inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Enter name";
    inputField.style.width = "150px"; // Adjust width as needed

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

generateButton.addEventListener("click", function() {
    // Reset the schedule
    clearSchedule();
    
    // Get the current time range from the time selectors
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    
    // Parse the time range to determine store hours
    const storeOpenHour = parseHour(startTime);
    const storeCloseHour = parseHour(endTime);
    
    // Create a blank schedule template
    const schedule = createBlankSchedule(storeOpenHour, storeCloseHour);
    
    // Track who closed the previous day to prevent them from opening
    let previousDayClosers = [];
    
    // Sort people by number of days they can work (ascending)
    // This ensures people who can work fewer days get priority
    const sortedPeople = [...peopleAvailability].sort((a, b) => {
        return (a.numDays || 0) - (b.numDays || 0);
    });
    
    // Days of the week in order
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    // First pass: Assign people to days based on availability
    for (const person of sortedPeople) {
        // Track how many days this person has been scheduled
        let daysScheduled = 0;
        const maxDaysToSchedule = person.numDays || 0;
        
        // Try to schedule this person for each day of the week
        for (let dayIndex = 0; dayIndex < daysOfWeek.length; dayIndex++) {
            // Stop if we've reached the maximum number of days for this person
            if (daysScheduled >= maxDaysToSchedule) break;
            
            const day = daysOfWeek[dayIndex];
            
            // Check if this person is available on this day
            if (person[day] && person[day].available) {
                // Parse the start and end time for this person on this day
                const personStartHour = parseHour(person[day].start);
                const personEndHour = parseHour(person[day].end);
                
                // Check if this person was a closer yesterday
                const isCloserYesterday = previousDayClosers.includes(person.name);
                const yesterdayIndex = (dayIndex - 1 + 7) % 7; // Handle wrap-around for Sunday
                const yesterdayName = daysOfWeek[yesterdayIndex];
                
                // Skip if this person closed yesterday and would open today
                if (isCloserYesterday && personStartHour === storeOpenHour) {
                    continue;
                }
                
                // Try to find a shift for this person
                let shiftAssigned = false;
                
                // Calculate available shift hours
                let availableHours = Math.min(personEndHour - personStartHour, 8); // Maximum 8 hours per day
                
                if (availableHours > 0) {
                    // Try to find a suitable shift
                    let bestShiftHour = -1;
                    let bestShiftNeed = -1;
                    
                    // Analyze each hour to find where this person is most needed
                    for (let hour = personStartHour; hour < personEndHour; hour++) {
                        // Check how many people are already scheduled for this hour
                        const currentStaffing = schedule[day][hour].length;
                        
                        // Get max staffing for this day (5 for weekends, 4 for weekdays)
                        const isWeekend = day === "sunday" || day === "saturday";
                        const maxStaff = isWeekend ? 5 : 4;
                        
                        // Skip if we've already reached max staffing for this slot
                        if (currentStaffing >= maxStaff) continue;
                        
                        const needForStaff = 3 - currentStaffing; // Need at least 3 people
                        
                        if (needForStaff > bestShiftNeed) {
                            bestShiftHour = hour;
                            bestShiftNeed = needForStaff;
                        }
                    }
                    
                    // If we found a good starting hour, assign a shift
                    if (bestShiftHour >= 0) {
                        // Determine shift length (up to 8 hours)
                        let shiftLength = Math.min(availableHours, 8);
                        
                        // Check if we can assign the full shift without exceeding max staff
                        let canAssignFullShift = true;
                        for (let hour = bestShiftHour; hour < bestShiftHour + shiftLength && hour < personEndHour; hour++) {
                            const isWeekend = day === "sunday" || day === "saturday";
                            const maxStaff = isWeekend ? 5 : 4;
                            
                            if (schedule[day][hour].length >= maxStaff) {
                                canAssignFullShift = false;
                                break;
                            }
                        }
                        
                        // If we can't assign the full shift, try to find a partial shift
                        if (!canAssignFullShift) {
                            continue;
                        }
                        
                        // Assign the shift
                        for (let hour = bestShiftHour; hour < bestShiftHour + shiftLength && hour < personEndHour; hour++) {
                            schedule[day][hour].push(person.name);
                        }
                        
                        // Mark this person as scheduled for this day
                        daysScheduled++;
                        shiftAssigned = true;
                        
                        // If this person closed the store, add them to the closers list
                        if (personEndHour === storeCloseHour) {
                            if (!previousDayClosers.includes(person.name)) {
                                previousDayClosers.push(person.name);
                            }
                        } else {
                            // Remove from closers list if they didn't close
                            const index = previousDayClosers.indexOf(person.name);
                            if (index !== -1) {
                                previousDayClosers.splice(index, 1);
                            }
                        }
                    }
                }
            }
        }
    }
    
    // Second pass: Ensure minimum staffing levels
    for (const day of daysOfWeek) {
        for (let hour = storeOpenHour; hour < storeCloseHour; hour++) {
            // Get max staffing for this day (5 for weekends, 4 for weekdays)
            const isWeekend = day === "sunday" || day === "saturday";
            const maxStaff = isWeekend ? 5 : 4;
            
            while (schedule[day][hour].length < 3 && schedule[day][hour].length < maxStaff) {
                // Find someone who can work this slot and hasn't maxed out their days
                let bestCandidate = null;
                
                for (const person of sortedPeople) {
                    // Check if this person is available on this day and hour
                    if (person[day] && person[day].available) {
                        const personStartHour = parseHour(person[day].start);
                        const personEndHour = parseHour(person[day].end);
                        
                        if (hour >= personStartHour && hour < personEndHour) {
                            // Check if this person is already scheduled for this hour
                            if (!schedule[day][hour].includes(person.name)) {
                                // Count how many days this person is already scheduled
                                let daysAlreadyScheduled = 0;
                                for (const d of daysOfWeek) {
                                    const isScheduledForDay = Object.values(schedule[d]).some(
                                        hourStaff => hourStaff.includes(person.name)
                                    );
                                    if (isScheduledForDay) daysAlreadyScheduled++;
                                }
                                
                                // Check if this person can work more days
                                if (daysAlreadyScheduled < (person.numDays || 0)) {
                                    bestCandidate = person.name;
                                    break;
                                }
                            }
                        }
                    }
                }
                
                // If we found someone, add them to the schedule
                if (bestCandidate) {
                    schedule[day][hour].push(bestCandidate);
                } else {
                    // If no one is available, mark this slot as understaffed
                    schedule[day][hour].push("UNDERSTAFFED");
                    break;
                }
            }
        }
    }
    
    // Display the schedule
    renderSchedule(schedule, storeOpenHour, storeCloseHour);
});

// Helper function to parse hour from time string
function parseHour(timeString) {
    if (!timeString) return 0;
    
    const hour = parseInt(timeString.split(" ")[0]);
    const period = timeString.split(" ")[1];
    
    // Convert to 24-hour format
    if (period === "AM") {
        return hour === 12 ? 0 : hour;
    } else {
        return hour === 12 ? 12 : hour + 12;
    }
}

// Create a blank schedule template
function createBlankSchedule(startHour, endHour) {
    const schedule = {
        sunday: {},
        monday: {},
        tuesday: {},
        wednesday: {},
        thursday: {},
        friday: {},
        saturday: {}
    };
    
    // Initialize each hour with an empty array
    for (const day in schedule) {
        for (let hour = startHour; hour < endHour; hour++) {
            schedule[day][hour] = [];
        }
    }
    
    return schedule;
}

// Clear the current schedule display
function clearSchedule() {
    const slots = document.querySelectorAll(".schedule-slot");
    slots.forEach(slot => {
        slot.innerHTML = "";
        slot.style.backgroundColor = "";
    });
}

// Render the schedule to the UI
function renderSchedule(schedule, startHour, endHour) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    for (let dayIndex = 0; dayIndex < daysOfWeek; dayIndex++) {
        const day = days[dayIndex];
        
        for (let hour = startHour; hour < endHour; hour++) {
            const staff = schedule[day][hour];
            
            // Find the corresponding slot in the UI
            const hourOffset = hour - startHour;
            const slotIndex = 1 + daysOfWeek + dayIndex + (hourOffset * daysOfWeek);
            const slot = document.querySelectorAll(".schedule-slot")[dayIndex + (hourOffset * daysOfWeek)];
            
            if (slot) {
                // Clear the slot
                slot.innerHTML = "";
                
                // Add each staff member to the slot
                staff.forEach(person => {
                    const personElement = document.createElement("div");
                    personElement.textContent = person;
                    personElement.className = "scheduled-person";
                    
                    // Mark understaffed slots with red background
                    if (person === "UNDERSTAFFED") {
                        personElement.style.color = "red";
                        personElement.style.fontWeight = "bold";
                    }
                    
                    slot.appendChild(personElement);
                });
                
                // Color code the slot based on staffing level
                if (staff.length < 3) {
                    slot.style.backgroundColor = "rgba(255, 0, 0, 0.2)"; // Red for understaffed
                } else if (staff.length === 3) {
                    slot.style.backgroundColor = "rgba(0, 255, 0, 0.2)"; // Green for minimum staffing
                } else {
                    slot.style.backgroundColor = "rgba(0, 0, 255, 0.2)"; // Blue for overstaffed
                }
            }
        }
    }
}

// Test Function: Generate 20 random employees and their availability
function generateTestEmployees() {
    const names = [
        "Alex", "Bailey", "Casey", "Dana", "Eli", 
        "Fran", "Gray", "Harper", "Indigo", "Jordan", 
        "Kai", "Logan", "Morgan", "Nico", "Oakley", 
        "Parker", "Quinn", "Riley", "Sam", "Taylor"
    ];
    
    const daysOfWeek = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const startTimes = ["8 AM", "9 AM", "10 AM", "11 AM", "12 PM"];
    const endTimes = ["4 PM", "5 PM", "6 PM", "7 PM", "8 PM"];
    
    // Clear existing people
    peopleAvailability = [];
    
    // Generate 20 random employees
    for (let i = 0; i < 20; i++) {
        const name = names[i];
        const numDays = 2 + Math.floor(Math.random() * 4); // 2-5 days available
        
        const employee = {
            name: name,
            numDays: numDays
        };
        
        // Generate random availability for each day
        for (const day of daysOfWeek) {
            // 60% chance of being available on any given day
            const isAvailable = Math.random() < 0.6;
            
            if (isAvailable) {
                const startIndex = Math.floor(Math.random() * startTimes.length);
                const endIndex = startIndex + 1 + Math.floor(Math.random() * (endTimes.length - startIndex - 1));
                
                employee[day] = {
                    available: true,
                    start: startTimes[startIndex],
                    end: endTimes[Math.min(endIndex, endTimes.length - 1)]
                };
            } else {
                employee[day] = {
                    available: false,
                    start: "",
                    end: ""
                };
            }
        }
        
        peopleAvailability.push(employee);
    }
    
    return peopleAvailability;
}

// Test Function: Print schedule to console
function printSchedule(schedule, startHour, endHour) {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    
    console.log("===== WEEKLY SCHEDULE =====");
    
    for (const day of days) {
        console.log(`\n=== ${day.toUpperCase()} ===`);
        
        for (let hour = startHour; hour < endHour; hour++) {
            // Format the hour
            let formattedHour;
            if (hour < 12) {
                formattedHour = `${hour} AM`;
            } else if (hour === 12) {
                formattedHour = "12 PM";
            } else {
                formattedHour = `${hour - 12} PM`;
            }
            
            const staff = schedule[day][hour];
            console.log(`${formattedHour}: ${staff.join(", ") || "UNDERSTAFFED"}`);
        }
    }
}

// Test Function: Run the test
function runScheduleTest() {
    // Generate test employees
    const testEmployees = generateTestEmployees();
    console.log("Generated 20 test employees:");
    console.log(testEmployees);
    
    // Set store hours
    const storeOpenHour = 8; // 8 AM
    const storeCloseHour = 20; // 8 PM
    
    // Create a blank schedule
    const schedule = createBlankSchedule(storeOpenHour, storeCloseHour);
}


window.onload = function(){
    populateTimeSelectors();
    buildCalendarTable();
}