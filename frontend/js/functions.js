/**
 * Send JSON data with asynchronous POST request to given URI. 
 * @param {String} uri API route
 * @param {Object<any>} data Object
 * @returns Promise
 */
 async function sendAjaxPostRequest(uri, data) {
    const response = await fetch(uri, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}


/**
 * Get the string format of the given date like "yyyy-mm-dd [hh:mm]" (the horus and the minutes are optional)
 * @param {Date} date 
 */
function formatDate(date, hours = false, minutes = false, separator="-") {
    const year = date.getFullYear();
    // The months are 0-based (0 is January, 1 is February, etc..),
    // therefore we need to increment its value by 1
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    let result = year + separator +
        (month >= 10 ? month : '0' + month) + separator +
        (day >= 10 ? day : '0' + day);
    
    if(hours === true) {
        result += ' ' + (hour >= 10 ? hour : '0' + hour);

        if(minutes === true) {
            result += ':' + (minute >= 10 ? minute : '0' + minute);
        }
    }

    return result;
}


/**
 * Returns the weekdays.
 * @returns Array
 */
function getWeekdays() {
    const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    
    return weekdays;
}


/**
 * Returns the month names.
 * @returns Array
 */
function getMonthNames() {
    const monthNames = [
        "January", "February", "March", "April", 
        "May", "June", "July", "August", 
        "September", "October", "November", "December"
    ];

    return monthNames;
}
