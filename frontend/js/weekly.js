
const weekdaysUl = document.querySelector("#weekdaysUl");
const weekdaysLIs = document.querySelectorAll(".weekday");
const weekStepBack = document.querySelector("#weekStepBack");
const weekStepForward = document.querySelector("#weekStepForward");
const eventTableContainer = document.querySelector("#eventTableContainer");

const weekdaysLIsArray = Array.from(weekdaysLIs);
const weekdays = getWeekdays();
const monthNames = getMonthNames();

document.addEventListener("DOMContentLoaded", e => {
    fillDaysOfWeek();
    createEventTableContainer();
    console.log(eventTableContainer);
    // weekStepBack.addEventListener("click", stepBackInWeeks);
    // weekStepForward.addEventListener("click", stepForwardInWeeks);
})


/**
 * Fill the days of week part (header) with the name of the days.
 */
 function fillDaysOfWeek() {
    for(let i = 0; i < 7; i++) {
        let weekdayName = weekdays[i];
        weekdaysLIsArray[i].innerHTML = weekdayName;
    }
}


function createEventTableContainer() {
    // let mainTable = document.createElement
}




// Implement registered event listeners

// function stepBackInWeeks() {
//     calendarMonth = getPreviousMonth(calendarMonth);
//     fill 
//     fillCalendar(calendarMonth);
// }

// function stepForwardInWeeks() {
//     calendarMonth = getNextMonth(calendarMonth);
//     fillCalendar(calendarMonth);
// }

