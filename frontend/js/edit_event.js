const logoutLink = document.querySelector("#logout");
const saveEventBtn = document.querySelector("#saveEvent");
const deleteEventBtn = document.querySelector("#deleteEvent");
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
const priorities = getPriorities();
let hadNotificationOriginally = false;
let eventId;
let uid;


document.addEventListener("DOMContentLoaded", e => {
    logoutLink.addEventListener("click", e => logoutClicked(e));
    saveEventBtn.addEventListener("click", saveEvent);
    deleteEventBtn.addEventListener("click", deleteEvent);
    fillInputValues();
});


/**
 * After loading this page the input values must be filled based on the event we want to edit (its id is stored in LocalStorage).
 */
async function fillInputValues() {
    eventId = getFromLS("edit_event");
    uid = getAuthUserId();
    
    if(eventId === null || uid === null) {
        redirectToErrorPage(401);
    }

    await fetch(`${apiServerUrl}/api/users/${uid}/events/${eventId}`)
    .then(response => response.json())
    .then(result => {
        result = result[0]
        let start = result["start_time"];
        let end = result["end_time"];
        let indexOfSeparator = result["start_time"].indexOf("T");
        let priority = result["color_id"];

        startDateInput.value = start.substring(0, indexOfSeparator);
        startTimeInput.value = start.substring(indexOfSeparator + 1, start.length - 3);
        endDateInput.value = end.substring(0, indexOfSeparator);
        endTimeInput.value = end.substring(indexOfSeparator + 1, start.length - 3);
        eventTitleInput.value = result["title"];
        eventDescriptionTa.value = result["description"];

        // prevent the bug which is about that the label and the value of the input are in the same place.
        eventTitleInput.focus();
        eventDescriptionTa.focus();
        saveEventBtn.focus();

        // habitCheckbox.checked;
        prioritySelect.value = priority;

        setNotificationCheckbox(uid, eventId);

    })
    .catch(error => console.log(error));

}


async function setNotificationCheckbox(uid, eventId) {
    await fetch(`${apiServerUrl}/api/users/${uid}/events/${eventId}/notifications`)
    .then(response => response.json())
    .then(result => {
        if(result.length > 0) {
            notificationCheckbox.checked = true;
            hadNotificationOriginally = true;
        } else {
            notificationCheckbox.checked = false;
            hadNotificationOriginally = false;
        }
    })
    .catch(error => console.log(error));
}


async function saveEvent() {

    let startDate = startDateInput.value;
    let startTime = startTimeInput.value;
    let endDate = endDateInput.value;
    let endTime = endTimeInput.value;
    let eventTitle = eventTitleInput.value;
    let eventDescription = eventDescriptionTa.value;
    let notification = notificationCheckbox.checked;
    // let habit = habitCheckbox.checked;
    let priority = Number.parseInt(prioritySelect.value);

    let uid = getAuthUserId();

    removeInvalidMsgs();

    if(! validateInputFields(uid, priority, startDate, startTime, endDate, endTime, eventTitle)) {
        return;
    }

    // TODO: post request to events API endpoint if it's an event and not a habit
    // TODO: check if it's a change in that the event is currently habit but after updating it will be just en event (and vica versa)

    // save the event
    sendAjaxPutRequest(`${apiServerUrl}/api/users/${uid}/events/${eventId}`, {
        id: eventId,
        user_id: uid,
        color_id: priority,
        title: eventTitle,
        description: eventDescription,
        start_time: `${startDate} ${startTime}`,
        end_time: `${endDate} ${endTime}`,
    }, true)
    .then(result => {

        // save to notifications table if it's set
        if(notification && ! hadNotificationOriginally) {

            let triggerTime = new Date(`${startDate} ${startTime}`);
            
            // the trigger time will be 5 minutes earlier then the actual event's start time
            let triggerTimeSeconds = triggerTime.getTime() / 1000 - 5 * 60
            let trigger = formatDate(new Date(triggerTimeSeconds * 1000), true, true);
            
            saveToNotifications(uid, trigger);

        } else if (! notification && hadNotificationOriginally) {
            // delete notification from the notifications table
            
            sendAjaxDeleteRequest(`${apiServerUrl}/api/users/${uid}/events/${eventId}/notifications`, {
                user_id: uid,
                event_id: eventId
            }, true);
            
            alert("The event has been successfully modified (and the notification has been deleted)!");
        } else {
            alert("The event has been successfully modified!");
        }

    })
    .catch(error => console.log(error));
}


async function saveToNotifications(uid, trigger) {
    sendAjaxPostRequest(`${apiServerUrl}/api/users/${uid}/events/${eventId}/notifications`, {
        user_id: uid,
        event_id: eventId,
        type_id: 2,
        trigger_time: trigger
    }, true)
    .then(result => {
        // console.log(result);
        alert("The event has been successfully modified (and the notification has been saved)!");
    })
    .catch(error => console.log(error));

}


function validateInputFields(uid, priority, startDate, startTime, endDate, endTime, eventTitle) {
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


async function deleteEvent() {
    if(window.confirm("Do you really want to delete the event?")) {
        sendAjaxDeleteRequest(`${apiServerUrl}/api/users/${uid}/events/${eventId}/notifications`, {
            user_id: uid,
            event_id: eventId
        }, true)
        .then(result => {
            sendAjaxDeleteRequest(`${apiServerUrl}/api/users/${uid}/events/${eventId}`, {
                id: eventId,
                user_id: uid,
            }, true)
            .then(any => {
                alert("The event was successfully deleted! Going back to monthly view..");
                window.location.href = "/auth/monthly.html";
            })
            .catch(error => console.log(error));
        })
        .catch(error => console.log(error));
    }
}


function logoutClicked(e) {
    e.preventDefault();
    logout();
}