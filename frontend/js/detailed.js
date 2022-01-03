const logoutLink = document.querySelector("#logout");
const eventTitle = document.querySelector("#eventTitle");
const eventType = document.querySelector("#eventType");
const startDateTime = document.querySelector("#startDateTime");
const endDateTime = document.querySelector("#endDateTime");
const description = document.querySelector("#description");
const priority = document.querySelector("#priority");
const notificationContainer = document.querySelector("#notificationContainer");


const apiServerUrl = getApiServerUrl();
const priorities = getPriorities();
let hadNotificationOriginally = false;
let eventId;
let uid;


document.addEventListener("DOMContentLoaded", e => {
    logoutLink.addEventListener("click", e => logoutClicked(e));
    // saveEventBtn.addEventListener("click", saveEvent);
    // deleteEventBtn.addEventListener("click", deleteEvent);
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
        console.log(result);
        let start = result["start_time"];
        let end = result["end_time"];
        let priority = result["color_id"];
        
        let color;

        eventTitle.innerHTML = result["title"];
        eventType.innerHTML = "Event";

        let indexOfSeparator = result["start_time"].indexOf("T");
        let startDate = start.substring(0, indexOfSeparator);
        let startTime =  start.substring(indexOfSeparator + 1, start.length - 3);
        let endDate = end.substring(0, indexOfSeparator);
        let endTime =  end.substring(indexOfSeparator + 1, end.length - 3);

        // eventType.parentElement.classList.add(color);
        eventType.parentElement.classList.add("black");
        startDateTime.innerHTML = `${startDate} ${startTime}`;
        endDateTime.innerHTML = `${endDate} ${endTime}`;
        description.innerHTML = result["description"];

        // todo:
        //      event type color set to event importance color
        //      set priority container background color
        //      set priority text color
        //      fill notification div/group

    })
    .catch(error => console.log(error));

}



function logoutClicked(e) {
    e.preventDefault();
    logout();
}