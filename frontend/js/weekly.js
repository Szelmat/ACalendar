
const weekdaysUl = document.querySelector("#weekdaysUl");
const weekdaysLIs = document.querySelectorAll(".weekday");
const weekStepBack = document.querySelector("#weekStepBack");
const weekStepForward = document.querySelector("#weekStepForward");
const mainEventTable = document.querySelector("#mainEventTable");
const eventTableContainer = document.querySelector("#eventTableContainer");
const weekdaysTableRow = document.querySelector("#weekdays");
const dayTableRows = document.querySelectorAll(".day");
const selectedMonthDiv = document.querySelector("#selectedMonth");
const logoutLink = document.querySelector("#logout");

const dayTableRowsArray = Array.from(dayTableRows);
const weekdaysLIsArray = Array.from(weekdaysLIs);
const weekdays = getWeekdays();
const monthNames = getMonthNames();

let currentDate = new Date();

document.addEventListener("DOMContentLoaded", e => {
    completeMainEventTable();
    fillWeekdays();

    currentDate = getFirstDayOfWeek(currentDate);

    fillDays(currentDate);

    weekStepBack.addEventListener("click", stepBackInWeeks);
    weekStepForward.addEventListener("click", stepForwardInWeeks);
    logoutLink.addEventListener("click", e => logoutClicked(e))
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
 * @param {Date} date 
 */
function fillDays(date) {

    week = getWeek(date)

    let givenMonth = date.getMonth();
    let givenMonthName = monthNames[givenMonth];
    // let givenYear = date.getFullYear();
    
    // let today = new Date();
    // let todayDay = today.getDate();
    // let todayWeek = getDayOfWeek(today);

    // if the today's date (year, month) is the given 'date', then, just in this case
    // we should mark the today's day
    // let currentDateIsTheGivenDate = today.getFullYear() === date.getFullYear() 
    //     && today.getMonth() === date.getMonth();
    
    // set the selected month (the format is: yyyy Month_name)
    setSelectedWeekDate(date, week, givenMonthName);

    let weekDayDate = date;

    for(let i = 0; i < 7; i++) {
        dayTableRowsArray[i].innerHTML = weekDayDate.getDate();
        
        // add some hours to the given date in order to step into the next day
        let nextDayUnixSeconds = moment(weekDayDate.getTime()).add(1, "day").unix();
        weekDayDate = new Date(nextDayUnixSeconds * 1000);
    }

    // TODO: get the events for the days/dates
    // TODO: "display" the events

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


/**
 * Set the content of selectedDate related to the given date (and week).
 * @param {Number} week 
 * @param {Date} date
 * @param {String} givenMonthName
 */
function setSelectedWeekDate(date, week, givenMonthName) {
    selectedMonthDiv.innerHTML = `${date.getFullYear()} ${givenMonthName}: Week ${week}`;
}


/**
 * Get the given date's previous week's first day as date object.
 * @param {Date} date 
 */
function getPreviousWeek(date) {
    // let temp = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    // let temp2 = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD')
    // console.log(dateToMoment(date));
    let temp = moment(date.getTime()).subtract(1, 'weeks').startOf('isoWeek');
    // let temp2 = moment().subtract(1, 'weeks').endOf('isoWeek')
    // return momentToDate(temp);
    return new Date(temp);
}


/**
 * Get the given date's next week's first day as date object.
 * @param {Date} date 
 */
function getNextWeek(date) {
    let temp = moment(date.getTime()).add(1, 'weeks').startOf('isoWeek');
    return new Date(temp);
}


/**
 * Returns the first day of the given date's week as Date.
 * @param {Date} date 
 * @returns 
 */
function getFirstDayOfWeek(date) {
    let temp = moment(date.getTime()).startOf('isoWeek');
    return new Date(temp);
}

// Implement registered event listeners

function stepBackInWeeks() {
    currentDate = getPreviousWeek(currentDate);
    fillDays(currentDate);
}

function stepForwardInWeeks() {
    currentDate = getNextWeek(currentDate);
    fillDays(currentDate);
}

function logoutClicked(e) {
    e.preventDefault();
    logout();
}


