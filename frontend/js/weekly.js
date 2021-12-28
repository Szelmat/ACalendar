
const weekdaysUl = document.querySelector("#weekdaysUl");
const weekdaysLIs = document.querySelectorAll(".weekday");
const weekStepBack = document.querySelector("#weekStepBack");
const weekStepForward = document.querySelector("#weekStepForward");
const mainEventTable = document.querySelector("#mainEventTable");
const eventTableContainer = document.querySelector("#eventTableContainer");
const weekdaysTableRow = document.querySelector("#weekdays");
const dayTableRows = document.querySelectorAll(".day");

const dayTableRowsArray = Array.from(dayTableRows);
const weekdaysLIsArray = Array.from(weekdaysLIs);
const weekdays = getWeekdays();
const monthNames = getMonthNames();

let currentDate = new Date();

document.addEventListener("DOMContentLoaded", e => {
    completeMainEventTable();
    fillWeekdays();
    fillDays(currentDate);

    // weekStepBack.addEventListener("click", stepBackInWeeks);
    // weekStepForward.addEventListener("click", stepForwardInWeeks);
})


/**
 * Fill the days of week part (header) with the name of the days.
 */
 function fillWeekdays() {
    for(let i = 0; i < 7; i++) {
        let weekdayName = weekdays[i];
        weekdaysLIsArray[i].innerHTML = weekdayName;
    }
}


/**
 * Fill the table row which contains the days/dates of the selected week.
 * @param {Date} Date 
 */
function fillDays(date) {

    let counter = 0;
    dayTableRowsArray.forEach(dayTR => {
        counter += 1;
        if(dayTR) {
            dayTR.innerHTML = counter;
        }
    });

}


/**
 * Complete the main event table with the rows
 */
function completeMainEventTable() {
    for(let i = 0; i < 24; i++) {  
        let tr = document.createElement("tr");
        let hourString = i < 10 ? "0" + i : i; 
        let trContentHTML = `
            <td class="event-time">${hourString}:00</td>
            <td class="event-component d1"></td>
            <td class="event-component d2"></td>
            <td class="event-component d3"></td>
            <td class="event-component d4"></td>
            <td class="event-component d5"></td>
            <td class="event-component d6"></td>
            <td class="event-component d7"></td>
        `;

        tr.innerHTML = trContentHTML;

        mainEventTable.appendChild(tr);
    }
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

