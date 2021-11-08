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