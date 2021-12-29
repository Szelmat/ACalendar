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
 * Returns the week number for this date.  dowOffset is the day of week the week
 * "starts" on for your locale - it can be from 0 to 6. If dowOffset is 1 (Monday),
 * the week returned is the ISO 8601 week number.
 * @param int dowOffset
 * @return int
 */
function getWeek(givenDate, dowOffset) {
/*getWeek() was developed by Nick Baicoianu at MeanFreePath: http://www.meanfreepath.com */

    dowOffset = typeof(dowOffset) == 'number' ? dowOffset : 0; //default dowOffset to zero
    var newYear = new Date(givenDate.getFullYear(),0,1);
    var day = newYear.getDay() - dowOffset; //the day of week the year begins on
    day = (day >= 0 ? day : day + 7);
    var daynum = Math.floor((givenDate.getTime() - newYear.getTime() - 
    (givenDate.getTimezoneOffset()-newYear.getTimezoneOffset())*60000)/86400000) + 1;
    var weeknum;
    //if the year starts before the middle of a week
    if(day < 4) {
        weeknum = Math.floor((daynum+day-1)/7) + 1;
        if(weeknum > 52) {
            nYear = new Date(givenDate.getFullYear() + 1,0,1);
            nday = nYear.getDay() - dowOffset;
            nday = nday >= 0 ? nday : nday + 7;
            /*if the next year starts before the middle of
              the week, it is week #1 of that year*/
            weeknum = nday < 4 ? 1 : 53;
        }
    }
    else {
        weeknum = Math.floor((daynum+day-1)/7);
    }
    return weeknum;
};


/**
 * Get the base64 representation of the given string.
 * @param {String} rawString
 * @returns String
 */
function getBase64Encode(rawString) {
    let wordArray = CryptoJS.enc.Utf8.parse(rawString);
    let result = CryptoJS.enc.Base64url.stringify(wordArray);

    return result;
}


/**
 * Get the string representation of Base64 encoded string.
 * @param {String} encodedString 
 * @returns String
 */
 function getBase64Decode(encodedString) {
    let wordArray = CryptoJS.enc.Base64url.parse(encodedString);
    let result = wordArray.toString(CryptoJS.enc.Utf8);

    return result;
}


/**
 * Create JWT token;
 * @param {String} header 
 * @param {String} payload 
 * @param {String} secret 
 * @returns String
 */
function createJWT(header, payload, secret) {
    
    // get the base64 encoded header and payload
    let base64Header = getBase64Encode(JSON.stringify(header));
    let base64Payload = getBase64Encode(JSON.stringify(payload));

    // get the signature of the hash
    let signature = CryptoJS.HmacSHA256(base64Header + "." + base64Payload, secret);
    // convert the signature to base64
    let base64signature = CryptoJS.enc.Base64url.stringify(signature);

    let jwt = base64Header + "." + base64Payload + "." + base64signature;

    // console.log("---------------------------");
    // console.log(header, payload, secret);
    // console.log(base64Header); 
    // console.log(base64Payload);
    // // console.log(signature);
    // // console.log(base64signature);
    // // console.log(jwt);
    // console.log("---------------------------");
    
    return jwt;
}
