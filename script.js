function populateTimeOptions() {
    const startTimeSelect = document.getElementById('startTime');
    const endTimeSelect = document.getElementById('endTime');

    for (let hour = 6; hour <= 21; hour++) {
        let displayHour = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
        startTimeSelect.options.add(new Option(displayHour, hour));
        endTimeSelect.options.add(new Option(displayHour, hour));
    }
}

function toggleTimeSelector() {
    const timeSelector = document.getElementById('timeSelector');
    timeSelector.style.display = timeSelector.style.display === 'none' ? 'block' : 'none';
}

function applyHours() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    console.log(`Working hours set from ${startTime} to ${endTime}`);
    toggleTimeSelector(); // Hide selector after applying hours
}

window.onload = function() {
    populateTimeOptions(); // Populate options on page load
}