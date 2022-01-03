const logoutLink = document.querySelector("#logout");
const eventTitle = document.querySelector("#eventTitle");
const eventType = document.querySelector("#eventType");
const startDateTime = document.querySelector("#startDateTime");
const endDateTime = document.querySelector("#endDateTime");
const description = document.querySelector("#description");
const priority = document.querySelector("#priority");
const priorityContainer = document.querySelector("#priorityContainer");
const notificationContainer = document.querySelector("#notificationContainer");
const notificationsDiv = document.querySelector("#notificationsDiv");
const deleteEventBtn = document.querySelector("#deleteEvent");
const editEventBtn = document.querySelector("#editEvent");


const apiServerUrl = getApiServerUrl();
const priorities = getPriorities();
let hadNotificationOriginally = false;
let eventId;
let uid;


document.addEventListener("DOMContentLoaded", e => {
    logoutLink.addEventListener("click", e => logoutClicked(e));
    editEventBtn.addEventListener("click", editEvent);
    deleteEventBtn.addEventListener("click", deleteEvent);
    fillInputValues();
});


/**
 * After loading this page the input values must be filled based on the event we want to edit (its id is stored in LocalStorage).
 */
 async function fillInputValues() {
    eventId = getFromLS("show_event");
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
        let priority = result["color_id"];
        let priorityName = getPriorityName(priority);
        let color = getColorBasedOnPriority(priority);

        eventTitle.innerHTML = result["title"];
        eventType.innerHTML = "Event";

        let indexOfSeparator = result["start_time"].indexOf("T");
        let startDate = start.substring(0, indexOfSeparator);
        let startTime =  start.substring(indexOfSeparator + 1, start.length - 3);
        let endDate = end.substring(0, indexOfSeparator);
        let endTime =  end.substring(indexOfSeparator + 1, end.length - 3);

        // set the corresponding color
        eventType.parentElement.style.backgroundColor = color;
        
        priorityContainer.innerHTML = priorityName;
        priorityContainer.style.backgroundColor = color;

        startDateTime.innerHTML = `${startDate} ${startTime}`;
        endDateTime.innerHTML = `${endDate} ${endTime}`;
        description.innerHTML = result["description"];

        
        // fill notification div/group
        fillNotificationsDiv();

    })
    .catch(error => console.log(error));

}


function fillNotificationsDiv() {
    fetch(`${apiServerUrl}/api/users/${uid}/events/${eventId}/notifications`)
    .then(response => response.json())
    .then(result => {
        result.forEach(notification => {
            let date = notification["trigger_time"];
            let indexOfSeparator = notification["trigger_time"].indexOf("T");
            let startDate = date.substring(0, indexOfSeparator);
            let startTime =  date.substring(indexOfSeparator + 1, date.length - 3);
            let triggerTime = startDate + " " + startTime;

            let div = document.createElement("div");
            div.innerHTML = `
            <div
            class="card white left-align"
            style="border-radius: 0px; margin: 0rem 0 0rem 0"
          >
            <p
              style="
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 10px;
                margin-right: 10px;
              "
            >
              <span style="color: black; font-size: 60%">NOTIFICATION</span>
            </p>

            <p
              style="
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 10px;
                margin-right: 10px;
              "
            >
              <span style="color: black; font-size: 100%">Email</span>
            </p>
            <p
              style="
                margin-top: 0;
                margin-bottom: 0;
                margin-left: 10px;
                margin-right: 10px;
              "
            >
              <span style="color: black; font-size: 70%"
                >At <span id="notificationDateTime">${triggerTime}</span></span
              >
            </p>
          </div>
            `;
            notificationsDiv.appendChild(div);
        });
    })
    .catch(error => console.log(error));

}


function editEvent() {
    storeInLS("edit_event", eventId);
    window.location.href = "/auth/edit_event.html";
}


function deleteEvent() {
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