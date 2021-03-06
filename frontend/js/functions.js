/**
 * Returns the URL of the API server.
 * @returns {String} URL of the API server
 */
function getApiServerUrl() {
    return "http://127.0.0.1:8000";
}


function getPriorities() {
    return [1, 2, 3, 4, 5];
}


// TODO: this should come from database
function getPriorityName(prioNumber) {
    let name = "";
    switch (prioNumber) {
        case 1:
            name = "Critical";
            break;
        case 2:
            name = "Important";
            break;
        case 3:
            name = "Medium";
            break;
        case 4:
            name = "Not so important";
            break;
        case 5:
            name = "Optional";
            break;
        default:
            break;
    }    

    return name;
}


// TODO: this should come from database
function getColorBasedOnPriority(prioNumber) {
    let color = "";
    switch (prioNumber) {
        case 1:
            color = "#D50000";
            break;
        case 2:
            color = "#E65000";
            break;
        case 3:
            color = "#FFEA00";
            break;
        case 4:
            color = "#4CAF50";
            break;
        case 5:
            color = "#42A5F5";
            break;
        default:
            break;
    }    

    return color;
}


/**
 * Send JSON data with asynchronous POST request to given URI. 
 * @param {String} uri API route
 * @param {Object<any>} data Object
 * @returns Promise
 */
 async function sendAjaxPostRequest(uri, data, needAuth = false) {
    let reqHeaders = {
        'Content-Type': 'application/json'
    };
    
    if(needAuth) {
        jwt = getJwtFromCookie();
        reqHeaders["Authorization"] = `Bearer ${jwt}`;
    }

    const response = await fetch(uri, {
        method: "POST",
        headers: reqHeaders,
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}


/**
 * Send JSON data with asynchronous DELETE request to given URI. 
 * @param {String} uri API route
 * @param {Object<any>} data Object
 * @returns Promise
 */
 async function sendAjaxDeleteRequest(uri, data, needAuth = false) {
    let reqHeaders = {
        'Content-Type': 'application/json'
    };
    
    if(needAuth) {
        jwt = getJwtFromCookie();
        reqHeaders["Authorization"] = `Bearer ${jwt}`;
    }

    const response = await fetch(uri, {
        method: "DELETE",
        headers: reqHeaders,
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}


/**
 * Send JSON data with asynchronous PUT request to given URI. 
 * @param {String} uri API route
 * @param {Object<any>} data Object
 * @returns Promise
 */
 async function sendAjaxPutRequest(uri, data, needAuth = false) {
    let reqHeaders = {
        'Content-Type': 'application/json'
    };
    
    if(needAuth) {
        jwt = getJwtFromCookie();
        reqHeaders["Authorization"] = `Bearer ${jwt}`;
    }

    const response = await fetch(uri, {
        method: "PUT",
        headers: reqHeaders,
        body: JSON.stringify(data)
    });
    const result = await response.json();
    return result;
}


/**
 * Get the string format of the given date like "yyyy-mm-dd [hh:mm]" (the horus and the minutes are optional, by default they are not provided by this function)
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

    return jwt;
}


function getAuthUserId() {
    let cookie = document.cookie;
    let cookies = cookie.split("; ");
    const cookieKey = "acalendar-jwt";

    for(let i = 0; i < cookies.length; i++) {
        if(cookies[i].includes(cookieKey)) {
            // cookies[i] is like: acalendar-jwt=header.payload.signature
            // get jwt token value

            let jwt = cookies[i].substring(cookieKey.length + 1);
            if(jwt.length > 0) {   
                // jwt components (header, payload, signature) are separated by dots
                let jwtComponents = jwt.split(".");
                
                // the payload is the 2nd component of the JWT
                let jwtPayload = JSON.parse(getBase64Decode(jwtComponents[1]));
                return jwtPayload["uid"];
            }

            return null;
        }
    }

    return null;
}


/**
 * Get the events belong to user with given the id.
 * @param {Number} userId 
 * @param {String} fromDate
 * @param {String} toDate
 * @returns 
 */
async function getUserEvents(userId, fromDate, toDate) {
    let apiUrl = getApiServerUrl();
    const response = await fetch(`${apiUrl}/api/users/${userId}/events/${fromDate}/${toDate}`)
        .then(response => response.json())
        .then(data => {return data});
    
    return response;
        
}
/**
 * Log out the user. We simply delete the cookie which contains the jwt.
 */
function logout() {
    let cookie = document.cookie;
    let cookies = cookie.split("; ");
    const cookieKey = "acalendar-jwt";

    for (let i = 0; i < cookies.length; i++) {
        if(cookies[i].includes(cookieKey)) {
            // cookies[i] is like: acalendar-jwt=header.payload.signature
            // get jwt token value

            let jwt = cookies[i].substring(cookieKey.length + 1);
            if(jwt.length > 0) {   
                // jwt components (header, payload, signature) are separated by dots
                let jwtComponents = jwt.split(".");
                
                // the jwt "expire" time will be the cookie's expire time as well
                let expireDate = new Date("1970.01.01");
                console.log("expdate", expireDate);
                
                // set the cookie 
                document.cookie = `acalendar-jwt=; expires=-1; path=/`;
            }
        }   
    }

    window.location.href = "../index.html";
}


function getJwtFromCookie() {
    let cookie = document.cookie;
    let cookies = cookie.split("; ");
    const cookieKey = "acalendar-jwt";

    for (let i = 0; i < cookies.length; i++) {
        if(cookies[i].includes(cookieKey)) {
            // cookies[i] is like: acalendar-jwt=header.payload.signature
            // get jwt token value

            let jwt = cookies[i].substring(cookieKey.length + 1);
            return jwt;
        }   
    }

    return "";
}


/**
 * Redirect to error page based on the given httpCode.
 * @param {Number} httpCode 
 */
function redirectToErrorPage(httpCode) {
    window.location.href = `../../error_pages/error${httpCode}.html`;
}


/**
 * Store items in LocalStorage.
 * @param {String} key 
 * @param {String|Number} value 
 */
function storeInLS(key, value) {
    localStorage.setItem(key, value);
}


/**
 * Get items from LocalStorage.
 * @param {String} key 
 */
function getFromLS(key) {
    let item = localStorage.getItem(key);
    return item;
}


function removeFromLS(key) {
    localStorage.removeItem(key);
}

/**
 * Clear LocalStorage.
 */
function clearLS() {
    localStorage.clear();
}