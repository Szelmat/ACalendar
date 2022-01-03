
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

// const dayComponents = [1, 2, 3, 4, 5, 6, 7];

let currentDate = new Date();

document.addEventListener("DOMContentLoaded", e => {
    uid = getAuthUserId();
    if(uid === null) {
        redirectToErrorPage(401);
    }
    clearLS();
    completeMainEventTable();
    fillWeekdays();

    currentDate = getFirstDayOfWeek(currentDate);

    fillDays(currentDate);

    weekStepBack.addEventListener("click", stepBackInWeeks);
    weekStepForward.addEventListener("click", stepForwardInWeeks);
    logoutLink.addEventListener("click", e => logoutClicked(e))
});


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
async function fillDays(date) {

    removeColors();

    week = getWeek(date)

    let givenMonth = date.getMonth();
    let givenMonthName = monthNames[givenMonth];

    setSelectedWeekDate(date, week, givenMonthName);

    let weekDayDate = date;
    let weekDayDateArray = [];

    let fromDate;
    let toDate;

    let nextDayUnixSeconds = date.getTime() / 1000;
    for(let i = 0; i < 7; i++) {
        dayTableRowsArray[i].innerHTML = weekDayDate.getDate();

        weekDayDateArray.push(weekDayDate);
        
        // add some hours to the given date in order to step into the next day
        if(i === 0) {
            fromDate = weekDayDate;
        } else if(i === 6) {
            toDate = weekDayDate;
        }
        nextDayUnixSeconds = moment(weekDayDate.getTime()).add(1, "day").unix();
        weekDayDate = new Date(nextDayUnixSeconds * 1000);
    }

    // add the first day of the next week to the array in order to get the events of the current week's last day
    weekDayDateArray.push(weekDayDate);

    // TODO: get the events for the days/dates
    
    await getUserEvents(uid, formatDate(fromDate, true, true), formatDate(toDate, true, true))
    .then(events => {
        console.log(events);

        for(let j = 0; j < weekDayDateArray.length; j++) {
            // console.log(weekDayDateArray[j]);
        }

        // iterate over all the events
        for(let i = 0; i < events.length; i++) {
            let indexOfSeparator = events[i]["start_time"].indexOf("T");
            
            let start = events[i]["start_time"];
            let startDate = start.substring(0, indexOfSeparator);
            let startTime =  start.substring(indexOfSeparator + 1, start.length - 3);

            let end = events[i]["end_time"];
            let endDate = end.substring(0, indexOfSeparator);
            let endTime =  end.substring(indexOfSeparator + 1, end.length - 3);

            let priority = events[i]["color_id"];
            let color = getColorBasedOnPriority(priority);

            let eventDateTime = new Date(events[i]["start_time"]);

            // iterate over all the days of the current week
            for(let j = 0; j < weekDayDateArray.length - 1; j++) {
                if(weekDayDateArray[j] <= eventDateTime && eventDateTime < weekDayDateArray[j+1]) {
                    let startHourOfEvent = startTime.substring(0, 2) + "00";
                    let goalTr = document.getElementById(`${startHourOfEvent}`);

                    // iterate over the child nodes of the goalTableRow and find the correct one
                    Array.from(goalTr.childNodes).forEach(item => {
                        if(typeof item.className !== "undefined" && item.className.includes(`d${j+1}`)) {
                            item.style.backgroundColor = color;
                            item.className += " colored";
                            item.id = events[i]["id"];

                            item.removeEventListener("mouseenter", e => getEventInfo(events[i]));
                            item.removeEventListener("click", e => showEvent(events[i]));


                            item.addEventListener("mouseenter", e => getEventInfo(events[i]));
                            item.addEventListener("click", e => showEvent(events[i]));
                        }
                    });
                }
            }
        }
        
    })
    .catch(error => console.log(error));
}


function getEventInfo(event) {
    console.log(event);
}

function showEvent(event) {
    let eventId = event["id"];
    storeInLS("show_event", eventId);
    window.location.href = "/auth/detailed.html";
}


function removeColors() {
    Array.from(document.querySelectorAll(".colored")).forEach(item => {
        item.classList.remove("colored");
        item.style.backgroundColor = "";
    });

}


/**
 * Complete the main event table with the rows
 */
function completeMainEventTable() {
    for(let i = 0; i < 24; i++) {  
        let tr = document.createElement("tr");
        let hourString = i < 10 ? "0" + i : i; 
        tr.id = hourString + "00";
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


