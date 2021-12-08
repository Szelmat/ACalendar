
const weekdaysUl = document.querySelector("#weekdaysUl");
const weekdaysLIs = document.querySelectorAll(".weekday");
const selectedMonthDiv = document.querySelector("#selectedMonth");
const calendarContainerDiv = document.querySelector("#calendarContainer");
const monthStepBack = document.querySelector("#monthStepBack");
const monthStepForward = document.querySelector("#monthStepForward");

const weekdaysLIsArray = Array.from(weekdaysLIs);
const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
const monthNames = [
    "January", "February", "March", "April", 
    "May", "June", "July", "August", 
    "September", "October", "November", "December"
];

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
    registerEventListeners();

});


/**
 * Register event listeners.
 */
function registerEventListeners() {
    monthStepBack.addEventListener("click", stepBackInMonths);
    monthStepForward.addEventListener("click", stepForwardInMonths);
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
    // subtract 2 days (just to be sure) to step into the prevoius month to get its maxDays
    let previousMonthUnix = givenDateUnix - 2 * 24 * 60 * 60
    const previousMonth = new Date(previousMonthUnix * 1000);
    const prevMonthMaxDays = getCountOfDays(previousMonth.getFullYear(), previousMonth.getMonth() + 1)


    let dayOfTheMonth = 1;  
    let dayOfTheNextMonth = 0;
    let tempCounter = dayOfTheWeek;
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

                    if (currentDateIsTheGivenDate && Number.parseInt(btn.innerText) === todayDay) {
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

            btn.addEventListener("click", e => calendarDayClicked(e.target))
            if(btn.classList.contains("is-today")) {
            // fire the click event manually to fill the selected day's div/table
                calendarDayClicked(btn);
            }

        }
        calendarContainerDiv.appendChild(ul);
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
 * Get the day-of-the-week belongs to the given date.
 * @param {Date} firstDay 
 */
function getDayOfWeek(firstDay) {
    // By default the Date.getDay() method works like this:
    // 0: Sunday
    // 1: Monday
    // ...
    // 6: Saturday

    // Reworked system:
    // 0: Monday
    // 1: Tuesday
    // ...
    // 6: Sunday

    let temp = firstDay.getDay(); // day of week (0: Sunday, 1: Monday, ..., 6: Saturday)
    let result;

    if (temp === 0)
        result = 6;
    else if (temp === 1)
        result = 0;
    else if (temp === 2)
        result = 1;
    else if (temp === 3)
        result = 2;
    else if (temp === 4)
        result = 3;
    else if (temp === 5)
        result = 4;
    else
        result = 5;

    return result;
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
    return input.substr(indexOfSeparator - 1);
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
 */
function createSelEventsTable(eventsToDisplay) {
    let container = document.querySelector("#eventsInSelectedDateDiv");
    
    let contentHTML = `
        <table id="eventsInSelectedDateTable" class="mt-3">
            <tbody>`;

    eventsToDisplay.forEach(eventToDisplay => {
        let startTime = eventToDisplay["start_time"];
        let startTimeDate = new Date(startTime);
        
        let eventHours = startTimeDate.getHours();
        let eventMinutes = startTimeDate.getMinutes();

        let displayH = eventHours < 10 ? "0" + eventHours : eventHours;
        let displayM = eventMinutes < 10 ? "0" + eventMinutes : eventMinutes;

        let displayText = eventToDisplay["event_title"].toUpperCase();
        
        let trHTML = `
        <tr>
            <td class="coming-event-time ml-5 pl-3">${displayH}:${displayM}</td>
            <td class="center coming-event-title">${displayText}</td>
            <td>
                <a href class="">
                    <i class="material-icons color-grey">edit</i>
                </a>
            <td>
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
 * 
 * @param {Date} selectedDate 
 */
function fillSelectedDaysDiv(selectedDate) {
    let selectedDaysTitleDiv = document.querySelector("#selectedDate");

    // this will come from the backend
    let events = [
        {
        "start_time": "2021.12.08 10:00",
        "event_title": "Computer Security practice assignment"
        }, 
        {
        "start_time": "2021.12.08 12:30",
        "event_title": "Submit project work"
        }, 
        {
        "start_time": "2021.12.08 14:40",
        "event_title": "Start working"
        },
        {
        "start_time": "2021.12.10 8:05",
        "event_title": "Go to work"
        },
        {
        "start_time": "2021.12.10 16:25",
        "event_title": "Stop working"
        },
        {
        "start_time": "2021.12.12 12:30",
        "event_title": "Study to Software technology"
        },
    ];

    let year = selectedDate.getFullYear();
    let month = selectedDate.getMonth() + 1;
    let day = selectedDate.getDate();
    let hours = selectedDate.getHours();
    let minutes = selectedDate.getMinutes();
    

    selectedDaysTitleDiv.innerText = `${year} ${monthNames[month - 1]} ${day}`;
    // selectedDaysTitleDiv.style.color = "crimson";

    let eventsToDisplay = [];

    events.forEach(calendarEvent => {
        let startTime = calendarEvent["start_time"];
        let startTimeDate = new Date(startTime);
        
        let eventYear = startTimeDate.getFullYear();
        let eventMonth = startTimeDate.getMonth() + 1;
        let eventDay = startTimeDate.getDate();;

        if(year === eventYear && month === eventMonth && day === eventDay) {
        // if today is the selected day
            // let timeFormat = `${eventHours < 10 ? "0" + eventHours : eventHours}:${eventMinutes < 10 ? "0" + eventMinutes : eventMinutes}`;
            // let eventTitle = `${calendarEvent["event_title"]}`;
            // console.log(timeFormat, eventTitle);
            eventsToDisplay.push(calendarEvent)
        }
        
    });

    if(eventsToDisplay.length === 0) {
        document.querySelector("#eventsInSelectedDateDiv").innerHTML = `
            <div class="mt-4 pt-3 pb-3 grey lighten-3">
                <i>There is no event created yet
                </i>
            </div>
        `;
    } else {
        createSelEventsTable(eventsToDisplay);
    }

}


// Implement all the event listeners

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