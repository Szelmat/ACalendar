
const weekdaysUl = document.querySelector("#weekdaysUl");
const weekdaysLIs = document.querySelectorAll(".weekday");
const selectedMonthDiv = document.querySelector("#selectedMonth");
const calendarContainerDiv = document.querySelector("#calendarContainer");
const monthStepBack = document.querySelector("#monthStepBack");
const monthStepForward = document.querySelector("#monthStepForward");
const addEventToSelectedDay = document.querySelector("#addEventToSelectedDay");
const addEventToUpcoming = document.querySelector("#addEventToUpcoming");
const logoutLink = document.querySelector("#logout");

const weekdaysLIsArray = Array.from(weekdaysLIs);
const weekdays = getWeekdays();
const monthNames = getMonthNames();

const longMonths = [1, 3, 5, 7, 8, 10, 12]; // 1: January, 3: March, etc... They have 31 days
const shortMonths = [4, 6, 9, 11]; // 4: April, 6: June, etc... They have 30 days
const febMonth = 2; // February, which can have 28 or 29 days (depends on the leap years)

// Day of the week which is related to today
let todayWeekDayLi = null;

// represents the currently selected month in the calendar (by default it's the current date)
let calendarMonth = new Date();

document.addEventListener("DOMContentLoaded", e => {
    fillDaysOfWeek();
    fillCalendar(calendarMonth);
    fillUpcomingEvents();
    registerEventListeners();
});


/**
 * Register event listeners.
 */
function registerEventListeners() {
    monthStepBack.addEventListener("click", stepBackInMonths);
    monthStepForward.addEventListener("click", stepForwardInMonths);

    addEventToSelectedDay.addEventListener("click", addNewEventToSelectedDate);
    addEventToUpcoming.addEventListener("click", addNewEventToUpcoming);
    logoutLink.addEventListener("click", e => logoutClicked(e))
}


/**
 * Register click events to all the days/dates in the calendar.
 * This separate function is needed in order to register the click event to the day/dates of
 * the calendar after stepping forward/backward in time.
 * This function is called within the fillCalendar() function.
 */
function registerDateClickEvents() {
    Array.from(document.querySelectorAll("div#calendarContainer button")).forEach(btn => { 
        btn.addEventListener("click", e => calendarDayClicked(e.target))
    });
    
}


/**
 * Get the subsequent date of the given date.
 * @param {Date} date 
 */
function getNextMonth(date) {
    let normalizedDate = normalizeDate(date);
    let normalizedDateUnix = normalizedDate.getTime() / 1000;

    
    let maxDays = this.getCountOfDays(date.getFullYear(), date.getMonth() + 1);
    // Calculate the seconds for adding 1 month to the given month
    let seconds = maxDays * 24 * 60 * 60;
    // add +5 days just to be sure we'll get into the next month (the clock adjustment could case some problem)
    seconds += 5 * 24 * 60 * 60;

    return new Date((normalizedDateUnix + seconds) * 1000);
}

/**
 * Get the preceding date of the given date.
 * @param {Date} date 
 */
 function getPreviousMonth(date) {
    let normalizedDate = normalizeDate(date);
    let normalizedDateUnix = normalizedDate.getTime() / 1000;
    
    let maxDays = this.getCountOfDays(date.getFullYear(), date.getMonth() + 1);
    // Calculate the seconds for subtracting 1 month to the given month
    let seconds = maxDays * 24 * 60 * 60;
    // subtract 5 days just to be sure we'll get into the previous month 
    // (the clock adjustment or the month february  could case some problem)
    seconds -= 5 * 24 * 60 * 60;

    return new Date((normalizedDateUnix - seconds) * 1000);
}



/**
 * Fill the days of week part (header) of the calendar with the name of the days.
 */
function fillDaysOfWeek() {
    for(let i = 0; i < 7; i++) {
        let weekdayName = weekdays[i];
        weekdaysLIsArray[i].innerHTML = weekdayName;
    }
}


/**
 * Fill the calendar with the days of the given/selected month, by default it is the current date.
 * @param {Date} date 
 */
function fillCalendar(date = new Date()) {
    let givenDate = date;
    let givenMonth = givenDate.getMonth();
    let givenMonthName = monthNames[givenMonth];
    let givenYear = givenDate.getFullYear();
    
    let today = new Date();
    let todayDay = today.getDate();
    let todayWeek = getDayOfWeek(today);
    
    // if the today's date (year, month) is the given 'date', then, just in this case
    // we should mark the today's day
    let currentDateIsTheGivenDate = today.getFullYear() === date.getFullYear() 
        && today.getMonth() === date.getMonth();


    // set the selected month (the format is: yyyy Month_name)
    selectedMonthDiv.innerHTML = `${givenDate.getFullYear()} ${givenMonthName}`;

    calendarContainerDiv.innerHTML = "";

    let maxDays = getCountOfDays(givenYear, givenMonth + 1);
    
    // first day of the given month
    let firstDay = new Date(`${givenYear}.${givenMonth + 1}.1`);
    // get the day-of-the-week of the first day of given month
    let dayOfTheWeek = getDayOfWeek(firstDay);

    for(let i = 0; i < 7; i++) {
        if(currentDateIsTheGivenDate && weekdaysLIsArray[i].innerHTML === weekdays[todayWeek]) {
            todayWeekDayLi = weekdaysLIsArray[i];
            todayWeekDayLi.classList.add("is-today");
        } else {
            todayWeekDayLi = weekdaysLIsArray[i];
            todayWeekDayLi.classList.remove("is-today");
        }
    }

    // let's get previous month 
    
    let givenDateNormalized = normalizeDate(givenDate);
    let givenDateUnix = givenDateNormalized.getTime() / 1000;
    // subtract 2 days (just to be sure) to step into the previous month to get its maxDays
    let previousMonthUnix = givenDateUnix - 2 * 24 * 60 * 60
    const previousMonth = new Date(previousMonthUnix * 1000);
    const prevMonthMaxDays = getCountOfDays(previousMonth.getFullYear(), previousMonth.getMonth() + 1)


    let dayOfTheMonth = 1;  
    let dayOfTheNextMonth = 0;
    let tempCounter = dayOfTheWeek;
    let todayBtn = null;

    // Fill the days
    // In some cases (e.g. 2021.05) the calendar needs 6 rows (which represent 6 weeks)
    // This means we need 6 ULs
    for (let i = 0; i < 6; i++) {
        let ul = document.createElement("ul");
        ul.id = `week-${i}`;
        ul.className = "week"
        
        if (i === 0) {
            ul.className += " mt-0 pt-3"
        } else if (i === 5) {
            ul.className += " mb-0 pb-3"
        }

        for(j = 0; j < 7; j++) {
            let li = document.createElement("li");
            let btn = document.createElement("button");
            btn.id = `week_day-${i}:${j}`;
            btn.className = "btn-small pl-2 pr-2 white";
            
            if(i === 0) {
            // the first row can be difficult because of the previous month's end may appear here
                if(j >= dayOfTheWeek) {
                // these are the days which are in the selected month
                    btn.innerText = dayOfTheMonth < 10 ? "0" + dayOfTheMonth : dayOfTheMonth;
                    dayOfTheMonth++;
                } else {
                    btn.innerText = prevMonthMaxDays - tempCounter + 1;
                    tempCounter--;
                    btn.className += " notInSelectedMonth";

                    if (currentDateIsTheGivenDate && Number.parseInt(btn.innerText) === todayDay && Number.parseInt(btn.innerText) <= 7) {
                    // the last condition is needed because without that in case of 2021 December the november 30th would have the "is-today" class as well (not just the December 30th)
                        btn.className += " is-today";
                        btn.className += " day-selected";
                    }
                }

            } else {
                if(dayOfTheMonth > maxDays && dayOfTheNextMonth === 0) {
                    dayOfTheNextMonth += 1;
                }
                
                if(dayOfTheNextMonth != 0) {
                    btn.innerText = dayOfTheNextMonth < 10 ? "0" + dayOfTheNextMonth : dayOfTheNextMonth;
                    btn.className += " notInSelectedMonth"

                    dayOfTheNextMonth++;
                } else {
                    btn.innerText = dayOfTheMonth < 10 ? "0" + dayOfTheMonth : dayOfTheMonth;
    
                    dayOfTheMonth++;

                    if (currentDateIsTheGivenDate && Number.parseInt(btn.innerText) === todayDay) {
                        btn.className += " is-today";
                    }
                }
            }
            
            li.appendChild(btn);
            ul.appendChild(li);

            if(btn.classList.contains("is-today")) {
                todayBtn = btn;
            }

        }
        calendarContainerDiv.appendChild(ul);
    }

    registerDateClickEvents();

    if(todayBtn !== null) {
    // the calendar's selected date contains the today's day
        // fire the click event manually to fill the selected day's div/table
        calendarDayClicked(todayBtn);
    }
}


/**
 * Fill the Other Upcoming Events div with the nearest events to today.
 */
async function fillUpcomingEvents() {
    let today = new Date();
    let tomorrow = new Date(moment(today.getTime()).add(1, "days"));
    tomorrow = new Date(`${tomorrow.getFullYear()}-${tomorrow.getMonth() + 1}-${tomorrow.getDate()} 00:00:00`);
    
    let events = await getUpcomingEvents(tomorrow);
    console.log("fillUpcomingEvents", events);

    if(events.length === 0) {
        document.querySelector("#upcomingEventsDiv").innerHTML = `
            <table id="upcomingEventsTable" class="mt-3">
                <tbody>
                    <tr>
                        <td class="center pb-4">
                            <i>There are no upcoming events yet!</i>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        createUpcomingEventsTable(events);
        
        // register click event listener to the EDIT ICONS and DELETE ICONS for the events in selected date's div
        // register click event listener on the title of the events
        let upcomingEventTableRows = Array.from(document.querySelectorAll(".upcomingEventTableRow"));

        upcomingEventTableRows.forEach(upcomingEventTableRow => {
            let editEventLinkTag = upcomingEventTableRow.lastElementChild.previousElementSibling.firstElementChild;

            editEventLinkTag.addEventListener("click", e => {
                e.preventDefault();

                editEvent(upcomingEventTableRow.id);
            });

            let deleteEventLinkTag = upcomingEventTableRow.lastElementChild.firstElementChild;
            deleteEventLinkTag.addEventListener("click", e => {
                e.preventDefault();

                deleteEvent(upcomingEventTableRow.id);
            });

            let eventTitleLink = upcomingEventTableRow.firstElementChild.nextElementSibling.firstElementChild;
            eventTitleLink.addEventListener("click", e => {
                e.preventDefault();

                showEvent(upcomingEventTableRow.id);
            });


        });
    }
}


/**
 * Get the maximum number of the given month of the given year.
 * @param {Number} year 
 * @param {Number} month 
 */
function getCountOfDays(year, month) {
    let maxDays;

    if (longMonths.includes(month)) {
        maxDays = 31;
    } else if (shortMonths.includes(month)) {
        maxDays = 30;
    } else {
        // it's february
        if (checkIfLeapYear(year)) {
            maxDays = 29;
        } else {
            maxDays = 28;
        }
    }

    return maxDays;
}


/**
 * Check whether the given year is a leap year or not.
 * @param {Number} year 
 */
function checkIfLeapYear(year) {
    if(year % 4 !== 0) {
        return false;
    } else if(year % 100 !== 0) {
        return true;
    } else if(year % 100 === 0) {
        if(year % 400 === 0) {
            return true;
        } else {
            return false;
        }
    }
}


/**
 * Normalize date (e.g.: return the first day of the given month)
 * @param {Date} date 
 * @returns {Date}
 */
function normalizeDate(date) {
    return new Date(`${date.getFullYear()}.${date.getMonth() + 1}.1`);
}


/**
 * Returns the week day matrix (e.g.: 2:3 means its the 3rd row (3rd week) in the calendar
 * and the 4th day of the week (THU)))
 * @param {String} input 
 * @returns 
 */
function getWeekDayMatrix(input) {
    let indexOfSeparator = input.indexOf(":");
    return input.substring(indexOfSeparator - 1);
}


/**
 * Get the selected date (the day which was clicked in the calendar) as a full Date object. The input is a button from the calendar.
 * @param {Button} btn 
 * @returns Date
 */
function getSelectedDayAsDate(btn) {
    let weekDayMatrix = getWeekDayMatrix(btn.id);

    let week = Number.parseInt(weekDayMatrix[0]);
    // let day = Number.parseInt(weekDayMatrix[2]);

    // get the date parameters corresponding to currently selected month (calendarMonth)
    let givenYear = calendarMonth.getFullYear();
    let givenMonth = calendarMonth.getMonth();

    let selectedDay = btn.innerText;
    let selectedDate;

    if (btn.classList.contains("notInSelectedMonth")) {
        if(week === 0) {
        // so the selected date belongs to the previous month
            let prevDate = getPreviousMonth(calendarMonth);
            let prevYear = prevDate.getFullYear();
            let prevMonth = prevDate.getMonth() + 1;
            selectedDate = new Date(`${prevYear}.${prevMonth}.${selectedDay}`);
        } else {
        // so the selected date belongs to the next month
            let nextDate = getNextMonth(calendarMonth)
            let nextYear = nextDate.getFullYear();
            let nextMonth = nextDate.getMonth() + 1;
            selectedDate = new Date(`${nextYear}.${nextMonth}.${selectedDay}`);
        }
    } else {
    // selected date belongs to current month
        // let selectedDay = week * 7 + day - 1;
        selectedDate = new Date(`${givenYear}.${givenMonth + 1}.${selectedDay}`);
    }

    return selectedDate;
}


/**
 * Create the table which contains the events related to the selected day. 
 * @param {Date} eventsToDisplay
 */
function createSelEventsTable(eventsToDisplay) {
    let container = document.querySelector("#eventsInSelectedDateDiv");
    
    let contentHTML = `
        <table id="eventsInSelectedDateTable" class="mt-3">
            <tbody>`;

    eventsToDisplay.forEach((eventToDisplay, index) => {
        let startTime = eventToDisplay["start_time"];
        let startTimeDate = new Date(startTime);
        
        let eventHours = startTimeDate.getHours();
        let eventMinutes = startTimeDate.getMinutes();

        let displayH = eventHours < 10 ? "0" + eventHours : eventHours;
        let displayM = eventMinutes < 10 ? "0" + eventMinutes : eventMinutes;

        let displayText = eventToDisplay["title"].toUpperCase();
        
        let elementPadding = 1;
        let lastElementPadding = 3;
        let isLastElement = (eventsToDisplay.length - 1 === index);

        let trHTML = `
        <tr id="${eventToDisplay.id}" class="eventTableRow">
            <td class="coming-event-time ml-5 pl-3 pb-${isLastElement ? lastElementPadding : elementPadding}">${displayH}:${displayM}</td>
            <td class="center coming-event-title pb-${isLastElement ? lastElementPadding : elementPadding}"><a href>${displayText}</a></td>
            <td class="pb-${isLastElement ? lastElementPadding : elementPadding}">
                <a href class="">
                    <i class="material-icons color-grey">edit</i>
                </a>
            <td class="pb-${isLastElement ? lastElementPadding : elementPadding}">
                <a href class="">
                    <i class="material-icons color-red">delete</i>
                </a>
            </td>
        </tr>
        `;

        contentHTML += "\n" + trHTML + "\n";
    });

    contentHTML += "\n</tbody></table>"

    container.innerHTML = contentHTML;

}


/**
 * Create the table which contains the upcoming events.
 * @param {Date} eventsToDisplay 
 */
function createUpcomingEventsTable(eventsToDisplay) {
    let container = document.querySelector("#upcomingEventsDiv");
    
    let contentHTML = `
        <table id="upcomingEventsTable" class="mt-3">
            <tbody>`;

    eventsToDisplay.forEach((eventToDisplay, index) => {
        let startTime = eventToDisplay["start_time"];
        let startTimeDate = new Date(startTime);
        
        let eventHours = startTimeDate.getHours();
        let eventMinutes = startTimeDate.getMinutes();

        let formattedStartTimeDate = formatDate(startTimeDate, true, true, separator='.')

        let displayText = eventToDisplay["title"].toUpperCase();
        
        let elementPadding = 1;
        let lastElementPadding = 3;
        let isLastElement = (eventsToDisplay.length - 1 === index);

        let trHTML = `
        <tr id="${eventToDisplay.id}" class="upcomingEventTableRow">
            <td class="center coming-event-time ml-5 pl-1 pb-${isLastElement ? lastElementPadding : elementPadding}">${formattedStartTimeDate}</td>
            <td class="center coming-event-title pb-${isLastElement ? lastElementPadding : elementPadding}"><a href>${displayText}</a></td>
            <td class="pb-${isLastElement ? lastElementPadding : elementPadding}">
                <a href class="">
                    <i class="material-icons color-grey">edit</i>
                </a>
            <td class="pb-${isLastElement ? lastElementPadding : elementPadding}">
                <a href class="">
                    <i class="material-icons color-red">delete</i>
                </a>
            </td>
        </tr>
        `;

        contentHTML += "\n" + trHTML + "\n";
    });

    contentHTML += "\n</tbody></table>"

    container.innerHTML = contentHTML;
}



/**
 * Fill the selected (clicked in the calendar) days' div with the full date of the selected day
 * and the events belong to that date. The latest data comes from the backend through an API.
 * @param {Date} selectedDate 
 */
async function fillSelectedDaysDiv(selectedDate) {
    let selectedDaysTitleDiv = document.querySelector("#selectedDate");

    let events = await getGivenDaysEvent(selectedDate);
    console.log("fillSelectedDaysDiv, events:", events);

    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth();
    let day = selectedDate.getDate();
    

    selectedDaysTitleDiv.innerText = `${year} ${monthNames[month]} ${day}`;


    if(events.length === 0) {
        document.querySelector("#eventsInSelectedDateDiv").innerHTML = `
            <table class="mt-3">
                <tbody>
                    <tr>
                        <td class="center pb-4">
                            <i>There is no event created yet</i>
                        </td>
                    </tr>
                </tbody>
            </table>
        `;
    } else {
        createSelEventsTable(events);
        
        // register click event listener to the EDIT ICONS and DELETE ICONS for the events in selected date's div
        let eventTableRows = Array.from(document.querySelectorAll(".eventTableRow"));

        eventTableRows.forEach(eventTableRow => {
            let editEventLinkTag = eventTableRow.lastElementChild.previousElementSibling.firstElementChild;
            editEventLinkTag.addEventListener("click", e => {
                e.preventDefault();

                editEvent(eventTableRow.id);
            });

            let deleteEventLinkTag = eventTableRow.lastElementChild.firstElementChild;
            deleteEventLinkTag.addEventListener("click", e => {
                e.preventDefault();

                deleteEvent(eventTableRow.id);
            });

            let eventTitleLink = eventTableRow.firstElementChild.nextElementSibling.firstElementChild;
            eventTitleLink.addEventListener("click", e => {
                e.preventDefault();

                showEvent(eventTableRow.id);
            });

        });

    }

}


/**
 * Click event listener of the edit icons belong to given events.
 * The parameter eventId is the id of the event in the corresponding database table.
 * @param {Number} eventId 
 */
function editEvent(eventId) {
    // TODO: redirect to /user/edit/2...
    console.log(`redirect to [..]/edit/${eventId}[/..]`);
}


/**
 * Click event listener of the delete icons belong to given events.
 * The parameter eventId is the id of the event in the corresponding database table.
 * @param {Number} eventId 
 */
function deleteEvent(eventId) {
    // TODO: redirect to /user/edit/2...
    console.log(`somehow delete the event with id of: ${eventId}`);
}


/**
 * Click event listener of the event title belong to given events.
 * The parameter eventId is the id of the event in the corresponding database table.
 * @param {Number} eventId 
 */
function showEvent(eventId) {
    // TODO: redirect to detailed event view
    console.log(`somehow show the event (detailed event view) with id of: ${eventId}`);
}



/**
 * Get the corresponding events from the backend's database where the 'start_time' is on the given day.
 * @param {Date} selectedDate 
 */
async function getGivenDaysEvent(selectedDate) {

    let uid = getAuthUserId();
    
    let fromDate = selectedDate;
    let toDate = new Date(moment(fromDate.getTime()).add(1, "days"));
    let result = [];

    await getUserEvents(uid, formatDate(fromDate, true, true), formatDate(toDate, true, true))
    .then(events => {
        result = events;
    })
    .catch(error => console.log(error));

    return result;
}


/**
 * Get the corresponding events from the backend's database based on the given day.
 * Those events will be returned which are the closest to today and not happens toda but in the next 30 days.
 * @param {Date} selectedDate 
 */
 async function getUpcomingEvents(date) {
    console.log("getUpcomingEvents, fromDate", date);

    let uid = getAuthUserId();
    
    let fromDate = date;
    let toDate = new Date(moment(fromDate.getTime()).add(30, "days"));
    console.log("getUpcomingEvents, toDate", toDate);
    let result = [];

    await getUserEvents(uid, formatDate(fromDate, true, true), formatDate(toDate, true, true))
    .then(events => {
        result = events;
    })
    .catch(error => console.log(error));

    return result;
}


// Implement the registered event listeners

function stepBackInMonths() {
    calendarMonth = getPreviousMonth(calendarMonth);
    fillCalendar(calendarMonth);
}

function stepForwardInMonths() {
    calendarMonth = getNextMonth(calendarMonth);
    fillCalendar(calendarMonth);
}

function calendarDayClicked(btn) {
    let selectedDate = getSelectedDayAsDate(btn);

    // remove the selection from a day
    let prevSelectedDay = document.querySelector(".day-selected");
    if(prevSelectedDay !== null) {
        prevSelectedDay.classList.remove("day-selected");
    }

    // add selection to a day
    btn.className += " day-selected";
    
    
    fillSelectedDaysDiv(selectedDate);
}

function addNewEventToSelectedDate() {
    window.location.href = "/auth/new_edit_event.html";
}

function addNewEventToUpcoming() {
    window.location.href = "/auth/new_edit_event.html";
}

function logoutClicked(e) {
    e.preventDefault();
    logout();
}
