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
            if (day !== "name" && day !== "numDays" && person[day].available) {
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

    // Restore saved start & end times after hoursInput() has created the elements
    if (existingPersonIndex !== -1) {
        const person = peopleAvailability[existingPersonIndex];

        Object.keys(person).forEach((day) => {
            if (day !== "name" && day !== "numDays" && person[day].available) {
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

    // Get the calendar's time range
    const startSelect = document.getElementById('startTime');
    const endSelect = document.getElementById('endTime');
    const calendarStartTime = startSelect.options[startSelect.selectedIndex].text;
    const calendarEndTime = endSelect.options[endSelect.selectedIndex].text;

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

        // Populate both start and end time options with full AM/PM options
        // Add AM hours (1-12)
        for (let hour = 1; hour <= 12; hour++) {
            let text = `${hour} AM`;
            startTimeSelect.options.add(new Option(text, text));
            endTimeSelect.options.add(new Option(text, text));
        }
        
        // Add PM hours (1-12)
        for (let hour = 1; hour <= 12; hour++) {
            let text = `${hour} PM`;
            startTimeSelect.options.add(new Option(text, text));
            endTimeSelect.options.add(new Option(text, text));
        }

        // Create "All Day" button
        const allDayBtn = document.createElement("button");
        allDayBtn.textContent = "All Day";
        allDayBtn.className = "all-day-btn";
        allDayBtn.addEventListener("click", function() {
            // Set to calendar start/end times
            startTimeSelect.value = calendarStartTime;
            endTimeSelect.value = calendarEndTime;
        });

        divHolderR.textContent = sub[i];
        divHolderL.appendChild(startTimeSelect);
        divHolderL.appendChild(document.createTextNode(" to "));
        divHolderL.appendChild(endTimeSelect);
        divHolderL.appendChild(allDayBtn);
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
// Schedule Generator Algorithm

generateButton.addEventListener("click", function() {
  // Extract schedule settings from localStorage
  const settingsString = localStorage.getItem('scheduleSettings');
  if (!settingsString) {
      alert("Please configure schedule settings first.");
      return;
  }
  
  const settings = JSON.parse(settingsString);
  
  // Get business hours from the time selectors
  const startSelect = document.getElementById('startTime');
  const endSelect = document.getElementById('endTime');
  const businessStartTime = startSelect.options[startSelect.selectedIndex].text;
  const businessEndTime = endSelect.options[endSelect.selectedIndex].text;
  
  // Convert time strings to numerical values for calculations (hours since midnight)
  const timeToHours = (timeStr) => {
      const [hour, period] = timeStr.split(' ');
      let hourNum = parseInt(hour);
      if (period === 'PM' && hourNum !== 12) hourNum += 12;
      if (period === 'AM' && hourNum === 12) hourNum = 0;
      return hourNum;
  };
  
  const businessStartHour = timeToHours(businessStartTime);
  const businessEndHour = timeToHours(businessEndTime);
  const businessHours = businessEndHour - businessStartHour;
  
  // Initialize final schedule object
  const finalSchedule = {
      sunday: { workers: {} },
      monday: { workers: {} },
      tuesday: { workers: {} },
      wednesday: { workers: {} },
      thursday: { workers: {} },
      friday: { workers: {} },
      saturday: { workers: {} }
  };
  
  // Initialize day-specific worker count limits
  const workerLimits = {};
  const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  days.forEach(day => {
      if (settings.useCustomWorkerSettings && settings.customWorkerSettings[day]) {
          workerLimits[day] = {
              min: settings.customWorkerSettings[day].min,
              max: settings.customWorkerSettings[day].max
          };
      } else {
          workerLimits[day] = {
              min: settings.minWorkers,
              max: settings.maxWorkers
          };
      }
      
      // Initialize worker slots for each hour of the day
      finalSchedule[day].hourlyWorkers = {};
      for (let hour = businessStartHour; hour < businessEndHour; hour++) {
          finalSchedule[day].hourlyWorkers[hour] = [];
      }
  });
  
  // Prepare the people data for scheduling
  const eligiblePeople = peopleAvailability.map(person => ({
      ...person,
      scheduledDays: 0,
      scheduledHours: 0,
      daysScheduled: [],
      closingPreviousDay: false
  }));
  
  // Helper function to convert time string to hour number
  const convertTimeToHours = (timeStr) => {
      if (!timeStr || timeStr === "N/A") return null;
      
      const [hourStr, period] = timeStr.split(' ');
      let hour = parseInt(hourStr);
      
      if (period === "PM" && hour !== 12) {
          hour += 12;
      } else if (period === "AM" && hour === 12) {
          hour = 0;
      }
      
      return hour;
  };
  
  // Helper function to convert hour number back to time string
  const convertHoursToTimeStr = (hour) => {
      let period = "AM";
      let displayHour = hour;
      
      if (hour >= 12) {
          period = "PM";
          if (hour > 12) {
              displayHour = hour - 12;
          }
      }
      
      if (hour === 0) {
          displayHour = 12;
      }
      
      return `${displayHour} ${period}`;
  };
  
  // Process each day of the week
  for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
      const currentDay = days[dayIndex];
      const previousDay = dayIndex > 0 ? days[dayIndex - 1] : days[6];
      const minWorkers = workerLimits[currentDay].min;
      const maxWorkers = workerLimits[currentDay].max;
      
      // Sort people by:
      // 1. Those who haven't worked their max days yet
      // 2. Those who didn't close the previous day
      // 3. Those with fewer scheduled hours
      const availablePeople = [...eligiblePeople]
          .filter(person => {
              // Filter out those who have reached their maximum days
              return person.scheduledDays < (person.numDays || 0);
          })
          .filter(person => {
              // Filter out those who aren't available this day
              return person[currentDay] && person[currentDay].available;
          })
          .filter(person => {
              // Filter out those who closed the previous day
              if (dayIndex > 0 || dayIndex === 6) { // Skip this check on first day
                  const prevDay = dayIndex > 0 ? days[dayIndex - 1] : days[6];
                  const personInPrevDay = finalSchedule[prevDay].workers[person.name];
                  
                  if (personInPrevDay) {
                      const prevEndHour = timeToHours(personInPrevDay.end);
                      // If they closed the previous day (worked until business end)
                      return prevEndHour !== businessEndHour;
                  }
              }
              return true;
          })
          .sort((a, b) => {
              // Sort by scheduled hours (ascending)
              return a.scheduledHours - b.scheduledHours;
          });
      
      // Calculate how many workers we need per hour
      const workersPerHour = {};
      for (let hour = businessStartHour; hour < businessEndHour; hour++) {
          workersPerHour[hour] = {
              required: minWorkers,
              assigned: 0
          };
      }
      
      // First pass: Assign shifts to workers based on their availability
      for (const person of availablePeople) {
          // Skip if we've already reached the maximum workers for the day
          if (Object.keys(finalSchedule[currentDay].workers).length >= maxWorkers) {
              break;
          }
          
          // Skip if this person has already been scheduled for this day
          if (finalSchedule[currentDay].workers[person.name]) {
              continue;
          }
          
          // Get person's availability for the day
          const startAvailHour = convertTimeToHours(person[currentDay].start);
          const endAvailHour = convertTimeToHours(person[currentDay].end);
          
          if (!startAvailHour || !endAvailHour) continue;
          
          // Calculate available hours within business hours
          const availableStart = Math.max(startAvailHour, businessStartHour);
          const availableEnd = Math.min(endAvailHour, businessEndHour);
          const availableHours = availableEnd - availableStart;
          
          if (availableHours <= 0) continue;
          
          // Determine shift length based on min/max constraints and remaining schedule
          const remainingHoursToMax = settings.maxHoursPerWorker - person.scheduledHours;
          let targetShiftLength = Math.min(
              availableHours,                // Hours the person is available
              8,                            // Max 8 hours per day
              remainingHoursToMax,          // Hours left to reach max for this person
              settings.maxHoursPerWorker    // Max hours per worker from settings
          );
          
          // Ensure we're meeting minimum hours requirement
          targetShiftLength = Math.max(targetShiftLength, settings.minHoursPerWorker);
          
          // If we can't meet minimum hours, skip this person
          if (targetShiftLength < settings.minHoursPerWorker) {
              continue;
          }
          
          // Find the best continuous shift
          let bestShiftStart = -1;
          let bestCoverage = -1;
          
          // Try different shift start times to find optimal coverage
          for (let shiftStart = availableStart; shiftStart <= availableEnd - targetShiftLength; shiftStart++) {
              let coverage = 0;
              
              // Calculate how many understaffed hours this shift would cover
              for (let hour = shiftStart; hour < shiftStart + targetShiftLength; hour++) {
                  if (workersPerHour[hour].assigned < workersPerHour[hour].required) {
                      coverage++;
                  }
              }
              
              if (coverage > bestCoverage) {
                  bestCoverage = coverage;
                  bestShiftStart = shiftStart;
              }
          }
          
          // If we found a valid shift start
          if (bestShiftStart >= 0) {
              const shiftStart = bestShiftStart;
              const shiftEnd = shiftStart + targetShiftLength;
              
              // Add this person's shift to the schedule
              finalSchedule[currentDay].workers[person.name] = {
                  start: convertHoursToTimeStr(shiftStart),
                  end: convertHoursToTimeStr(shiftEnd),
                  hours: targetShiftLength
              };
              
              // Update hourly worker assignments
              for (let hour = shiftStart; hour < shiftEnd; hour++) {
                  finalSchedule[currentDay].hourlyWorkers[hour].push(person.name);
                  workersPerHour[hour].assigned++;
              }
              
              // Update person's stats
              person.scheduledDays++;
              person.scheduledHours += targetShiftLength;
              person.daysScheduled.push(currentDay);
              
              // Check if this person is closing
              if (shiftEnd === businessEndHour) {
                  person.closingPreviousDay = true;
              } else {
                  person.closingPreviousDay = false;
              }
          }
      }
      
      // Second pass: Ensure we have minimum staffing for each hour
      // Check if any hour is understaffed
      let understaffedHours = [];
      for (let hour = businessStartHour; hour < businessEndHour; hour++) {
          if (workersPerHour[hour].assigned < workersPerHour[hour].required) {
              understaffedHours.push({
                  hour,
                  needed: workersPerHour[hour].required - workersPerHour[hour].assigned
              });
          }
      }
      
      // If we have understaffed hours, try to schedule additional workers
      if (understaffedHours.length > 0) {
          // Find additional workers for understaffed hours
          const additionalWorkers = availablePeople.filter(person => {
              // Skip if already scheduled for this day
              return !finalSchedule[currentDay].workers[person.name];
          });
          
          for (const staffNeed of understaffedHours) {
              const hour = staffNeed.hour;
              const neededWorkers = staffNeed.needed;
              
              for (let i = 0; i < neededWorkers; i++) {
                  // Find a worker who is available at this hour
                  const availableWorker = additionalWorkers.find(person => {
                      const startAvailHour = convertTimeToHours(person[currentDay].start);
                      const endAvailHour = convertTimeToHours(person[currentDay].end);
                      
                      return startAvailHour <= hour && endAvailHour > hour;
                  });
                  
                  if (availableWorker) {
                      // Remove from additional workers list
                      const workerIndex = additionalWorkers.indexOf(availableWorker);
                      additionalWorkers.splice(workerIndex, 1);
                      
                      // Get availability for the day
                      const startAvailHour = convertTimeToHours(availableWorker[currentDay].start);
                      const endAvailHour = convertTimeToHours(availableWorker[currentDay].end);
                      
                      // Calculate shift around the understaffed hour
                      // Try to create a shift that meets minimum hours
                      const minHours = settings.minHoursPerWorker;
                      let shiftStart = hour; // Start at understaffed hour
                      let shiftEnd = hour + 1; // End after understaffed hour
                      
                      // Expand shift to meet minimum hours, respecting availability
                      while (shiftEnd - shiftStart < minHours) {
                          // Try to expand end
                          if (shiftEnd < endAvailHour && shiftEnd < businessEndHour) {
                              shiftEnd++;
                          } 
                          // Try to expand start
                          else if (shiftStart > startAvailHour && shiftStart > businessStartHour) {
                              shiftStart--;
                          } 
                          // Can't expand further
                          else {
                              break;
                          }
                      }
                      
                      // Only schedule if we can meet minimum hours
                      const shiftLength = shiftEnd - shiftStart;
                      if (shiftLength >= minHours) {
                          // Add to schedule
                          finalSchedule[currentDay].workers[availableWorker.name] = {
                              start: convertHoursToTimeStr(shiftStart),
                              end: convertHoursToTimeStr(shiftEnd),
                              hours: shiftLength
                          };
                          
                          // Update hourly workers
                          for (let h = shiftStart; h < shiftEnd; h++) {
                              finalSchedule[currentDay].hourlyWorkers[h].push(availableWorker.name);
                              workersPerHour[h].assigned++;
                          }
                          
                          // Update worker stats
                          availableWorker.scheduledDays++;
                          availableWorker.scheduledHours += shiftLength;
                          availableWorker.daysScheduled.push(currentDay);
                          
                          // Check if closing
                          if (shiftEnd === businessEndHour) {
                              availableWorker.closingPreviousDay = true;
                          }
                      }
                  }
              }
          }
      }
      
      // Validate minimum workers per hour requirement
      let staffingIssues = false;
      for (let hour = businessStartHour; hour < businessEndHour; hour++) {
          const hourWorkers = finalSchedule[currentDay].hourlyWorkers[hour];
          if (hourWorkers.length < minWorkers) {
              console.warn(`WARNING: ${currentDay} at ${convertHoursToTimeStr(hour)} is understaffed. Need ${minWorkers}, have ${hourWorkers.length}`);
              staffingIssues = true;
          }
      }
      
      if (staffingIssues) {
          console.warn(`${currentDay} has staffing issues. You may need more available workers.`);
      }
  }
  
  // Clean up the finalSchedule object by removing the hourlyWorkers temporary data
  for (const day of days) {
      delete finalSchedule[day].hourlyWorkers;
  }
  
  // Display or store the final schedule
  console.log("Final Schedule:", finalSchedule);
  localStorage.setItem('finalSchedule', JSON.stringify(finalSchedule));
  
  // Optionally, trigger a function to display the schedule on the page
  
  return finalSchedule;
});
const viewSchedule = document.querySelector("#view-schedule");
const scheduleViewPopup = document.getElementById('scheduleViewPopup');
const closeScheduleView = document.getElementById('closeScheduleView');

function generateWorkerRow(workerName, finalSchedule, days) {
    const row = document.createElement('tr');
    const nameCell = document.createElement('td');
    nameCell.textContent = workerName;
    row.appendChild(nameCell);

    // Add cells for each day
    days.forEach(day => {
        const cell = document.createElement('td');
        
        // Safely access the schedule
        if (finalSchedule && 
            finalSchedule[day] && 
            finalSchedule[day].workers && 
            finalSchedule[day].workers[workerName]) {
            const daySchedule = finalSchedule[day].workers[workerName];
            cell.textContent = `${daySchedule.start}-${daySchedule.end}`;
        }
        
        row.appendChild(cell);
    });

    return row;
}

function closeSchedulePopup() {
    scheduleViewPopup.classList.remove('open');
}

// View Schedule Button Click Event
viewSchedule.addEventListener("click", function() {
    // Get schedule body
    const scheduleBody = document.getElementById('scheduleBody');
    scheduleBody.innerHTML = ''; // Clear previous content

    // Retrieve the generated schedule from localStorage
    const finalScheduleStr = localStorage.getItem('finalSchedule');
    if (!finalScheduleStr) {
        alert('No schedule has been generated yet.');
        return;
    }

    // Parse the schedule
    const finalSchedule = JSON.parse(finalScheduleStr);
    
    // Days of the week for mapping
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Collect all unique workers from the schedule
    const workersInSchedule = new Set();
    days.forEach(day => {
        if (finalSchedule[day] && finalSchedule[day].workers) {
            Object.keys(finalSchedule[day].workers).forEach(worker => {
                workersInSchedule.add(worker);
            });
        }
    });

    // Add rows for each worker
    workersInSchedule.forEach(worker => {
        scheduleBody.appendChild(generateWorkerRow(worker, finalSchedule, days));
    });

    // Show the popup
    scheduleViewPopup.classList.add('open');
});

// Close button functionality
closeScheduleView.addEventListener('click', closeSchedulePopup);

// Close popup when clicking outside the modal content
scheduleViewPopup.addEventListener('click', function(event) {
    // Check if the click was on the popup overlay (not on the inner content)
    if (event.target === scheduleViewPopup) {
        closeSchedulePopup();
    }
});


window.onload = function(){
    populateTimeSelectors();
    buildCalendarTable();
}