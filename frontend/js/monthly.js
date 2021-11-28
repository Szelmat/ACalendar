
const weekdaysUl = document.querySelector("#weekdaysUl");
const weekdaysLIs = document.querySelectorAll(".weekday");
const selectedMonthDiv = document.querySelector("#selectedMonth");
const calendarContainerDiv = document.querySelector("#calendarContainer");

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

document.addEventListener("DOMContentLoaded", e => {
    fillDaysOfWeek();
    fillCalendar();
});


/**
 * Fill the days of week part (header) of the calendar with the name of the days.
 */
function fillDaysOfWeek() {

    for(let i = 0; i < 7; i++) {
        // let weekdayName = Object.values(weekdays)[i];
        let weekdayName = weekdays[i];
        weekdaysLIsArray[i].innerHTML = weekdayName;
    }
}


function fillCalendar() {
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentMonthName = monthNames[currentMonth];
    let currentYear = currentDate.getFullYear();
    
    // set the selected month (the format is: yyyy Month_name)
    selectedMonthDiv.innerHTML = `${currentDate.getFullYear()} ${currentMonthName}`;

    let maxDays = getCountOfDays(currentYear, currentMonth);
    
    // first day of the given month
    let firstDay = new Date(`${currentYear}.${currentMonth + 1}.1`);
    // get the day-of-the-week of the first day of given month
    let dayOfTheWeek = getDayOfWeek(firstDay);
    let day = weekdays[dayOfTheWeek];

    for(let i = 0; i < 7; i++) {
        if(weekdaysLIsArray[i].innerHTML === day) {
            todayWeekDayLi = weekdaysLIsArray[i];
            todayWeekDayLi.classList.add("is-today");
        }
    }

    // get previous month 
    let currentDateUnix = currentDate.getTime() / 1000;
    // subtract 2 days (just to be sure) to step into the prevoius month to get its maxDays
    let previousMonthUnix = currentDateUnix - 2 * 24 * 60 * 60
    let previousMonth = new Date(previousMonthUnix * 1000);
    let prevMonthMaxDays = getCountOfDays(previousMonth.getFullYear(), previousMonth.getMonth())



    let dayOfTheMonth = 1;  
    let dayOfThePrevMonth = prevMonthMaxDays;
    let dayOfTheNextMonth = 0;
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
            // btn.className = "weekday pt-2 pb-2 mt-2 mb-2 rounded-1 z-depth-1"
            btn.className = "btn-small pl-2 pr-2 white";
            
            if(i === 0) {
            // the first row can be difficult because of the previous month's end may appear here
                if(j >= dayOfTheWeek) {
                // these are the days which are in the selected month
                    btn.innerText = dayOfTheMonth < 10 ? "0" + dayOfTheMonth : dayOfTheMonth;

                    dayOfTheMonth++;
                } else {
                    btn.innerText = dayOfThePrevMonth;
                    dayOfThePrevMonth--;
                    btn.className += " notInSelectedMonth"
                }
            } else {
                if(dayOfTheMonth == maxDays && dayOfTheNextMonth === 0) {
                    dayOfTheNextMonth += 1;
                }
                
                if(dayOfTheNextMonth != 0) {
                    btn.innerText = dayOfTheNextMonth < 10 ? "0" + dayOfTheNextMonth : dayOfTheNextMonth;
                    btn.className += " notInSelectedMonth"

                    dayOfTheNextMonth++;
                } else {
                    btn.innerText = dayOfTheMonth < 10 ? "0" + dayOfTheMonth : dayOfTheMonth;
    
                    dayOfTheMonth++;
                }
            }
            
            li.appendChild(btn);
            ul.appendChild(li);
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