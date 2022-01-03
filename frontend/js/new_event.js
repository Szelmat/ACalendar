const logoutLink = document.querySelector("#logout");
const saveEventBtn = document.querySelector("#saveEvent");
const startDateInput = document.querySelector("#startDate");
const startTimeInput = document.querySelector("#startTime");
const endDateInput = document.querySelector("#endDate");
const endTimeInput = document.querySelector("#endTime");
const eventTitleInput = document.querySelector("#eventTitle");
const eventDescriptionTa = document.querySelector("#eventDescription");
const notificationCheckbox = document.querySelector("#notificationCheckbox");
const habitCheckbox = document.querySelector("#habitCheckbox");
const prioritySelect = document.querySelector("#prioritySelect");

const apiServerUrl = getApiServerUrl();
const priorities = [1, 2, 3, 4, 5];


document.addEventListener("DOMContentLoaded", e => {

    // fill the date input fields with experimental data for testing purpose
    // startDateInput.value = "2022-01-01";
    // startTimeInput.value = "08:00"
    // endDateInput.value = "2022-01-01";
    // endTimeInput.value = "12:00";
    // eventTitleInput.value = "Test event title" + new Date().getMilliseconds();
    // eventDescriptionTa.value = "Test event description" + new Date().getMilliseconds();
    // prioritySelect.value = 3;

    saveEventBtn.addEventListener("click", saveEvent);
    
    logoutLink.addEventListener("click", e => logoutClicked(e))
});


// function validateInputs() {

//     return true;
// }


/* Implement event listeners */
function saveEvent() {

    let startDate = startDateInput.value
    let startTime = startTimeInput.value
    let endDate = endDateInput.value
    let endTime = endTimeInput.value
    let eventTitle = eventTitleInput.value
    let eventDescription = eventDescriptionTa.value;
    let notification = notificationCheckbox.checked;
    let habit = habitCheckbox.checked;
    let priority = Number.parseInt(prioritySelect.value);

    let uid = getAuthUserId();

    removeInvalidMsgs();

    if(! validateInputFields(uid, priority, startDate, startTime, endDate, endTime, eventTitle, eventDescription, notification, habit)) {
        return;
    }

    // TODO: post request to events API endpoint if it's an event and not a habit
    // TODO: post request to notification API endpoint if it's checked

    // save the event
    sendAjaxPostRequest(`${apiServerUrl}/api/users/${uid}/events`, {
        user_id: uid,
        color_id: priority,
        title: eventTitle,
        description: eventDescription,
        start_time: `${startDate} ${startTime}`,
        end_time: `${endDate} ${endTime}`,
        created_at: formatDate(new Date(), true, true)
    }, true)
    .then(result => {
        // console.log(result);
        alert("The event has been successfully saved!");

        // save to notifications table
        // for this first we have to get the eventId
        // TODO: after the previous post request (in the RESULT variable)
        // the saved event object should be returned and after that it would be easy to get it's id in order to save into the notification's table

        console.log(result);

        let eventId = result["id"];
        let triggerTime = new Date(`${startDate} ${startTime}`);
        
        // the trigger time will be 5 minutes earlier then the actual event's start time
        let triggerTimeSeconds = triggerTime.getTime() / 1000 - 5 * 60
        let trigger = formatDate(new Date(triggerTimeSeconds * 1000), true, true);
        console.log(trigger);

        // sendAjaxPostRequest(`${apiServerUrl}/api/events/${eventId}/notifications`, {
        //     event_id: eventId,
        //     type_id: 2,
        //     trigger_time: trigger
        // }, true)
        // .then(result => {
        //     // console.log(result);
        //     alert("The event has been successfully saved!");
        // })
        // .catch(error => console.log(error));
    })
    .catch(error => console.log(error));

}


function validateInputFields(uid, priority, startDate, startTime, endDate, endTime, eventTitle, eventDescription, notification, habit) {
    let errorMsgs = [];

    if(uid === null) {
    // there is no authenticated user
        window.location.href = "../error_pages/error401.html";
    }

    if(! priorities.includes(priority)) {
        errorMsgs.push("The chosen priority is not valid!");
    }

    if(startDate.trim() === "") {
        errorMsgs.push("The event start date is required!");
    }

    if(startTime.trim() === "") {
        errorMsgs.push("The event start time is required!");
    }

    if(endDate.trim() === "") {
        errorMsgs.push("The event end date is required!");
    }

    if(endTime.trim() === "") {
        errorMsgs.push("The event end time is required!");
    }

    if(eventTitle.trim() === "") {
        errorMsgs.push("The event title is required!");
    }
    
    if(errorMsgs.length > 0) {
        insertInvalidMsg(errorMsgs);
        return false;
    } else {
        return true;
    }
    
    
}


function insertInvalidMsg(errorMsgs) {
    let errorMsgDiv = document.createElement("div");
    errorMsgDiv.className = "row center mt-0 mb-0 col s12 m8 l8 xl8 offset-m2 offset-l2 offset-x12";
    errorMsgDiv.id = "errorMsgDiv";

    let ul = document.createElement("ul");
    ul.className = "collection";

    errorMsgs.forEach(errorMsg => {
        let li = document.createElement("li");
        li.className ="collection-item red-text";
        li.innerHTML = errorMsg;
        ul.appendChild(li);
    });

    errorMsgDiv.appendChild(ul);
    
    saveEventBtn.parentElement.insertBefore(errorMsgDiv, saveEventBtn);
}


function removeInvalidMsgs() {
    let errorMsgDiv = saveEventBtn.previousElementSibling;

    if(errorMsgDiv !== null) {
        errorMsgDiv.parentElement.removeChild(errorMsgDiv);
    }
}


function logoutClicked(e) {
    e.preventDefault();
    logout();
}