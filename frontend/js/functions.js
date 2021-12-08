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
 * Get the string format of the given date like "yyyy-mm-dd hh:mm"
 * @param {Date} date 
 */
function formatDate(date, hours = false, minutes = false) {
    const year = date.getFullYear();
    // The months are 0-based (0 is January, 1 is February, etc..),
    // therefore we need to increment its value by 1
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();

    let result = year + '-' +
        (month >= 10 ? month : '0' + month) + '-' +
        (day >= 10 ? day : '0' + day);
    
    if(hours === true) {
        result += ' ' + (hour >= 10 ? hour : '0' + hour);

        if(minutes === true) {
            result += ':' + (minute >= 10 ? minute : '0' + minute);
        }
    }

    return result;
}