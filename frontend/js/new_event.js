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


document.addEventListener("DOMContentLoaded", e => {

    // fill the date input fields with experimental data for testing purpose
    startDateInput.value = "2022-01-01";
    startTimeInput.value = "08:00"
    endDateInput.value = "2022-01-01";
    endTimeInput.value = "12:00";
    eventTitleInput.value = "Test event title" + new Date().getMilliseconds();
    eventDescriptionTa.value = "Test event description" + new Date().getMilliseconds();
    prioritySelect.value = 3;

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
    // let priority = prioritySelect.value;
    let priority = 1;

    // TODO: validation

    // console.log(startDate, startTime, endDate, endTime, eventTitle, eventDescription, notification, habit, priority);

    let uid = getAuthUserId();

    // TODO: post request to events API endpoint if it's an event and not a habit
    // TODO: post request to notification API endpoint if it's checked

    sendAjaxPostRequest(`${apiServerUrl}/api/users/${uid}/events`, {
        user_id: uid,
        color_id: priority,
        title: eventTitle,
        description: eventDescription,
        start_time: `${startDate} ${startTime}`,
        end_time: `${endDate} ${endTime}`,
        created_at: formatDate(new Date(), true, true)
    })
    .then(result => {
        console.log(result);
        // if("access_token" in result) {

        //     // jwt components (header, payload, signature) are separated by dots
        //     let jwtComponents = result["access_token"].split(".");

        //     // the payload is the 2nd component of the JWT
        //     let jwtPayload = JSON.parse(getBase64Decode(jwtComponents[1]));

        //     // the jwt "expire" time will be the cookie's expire time as well
        //     let expireDate = jwtPayload["exp"];
        //     expireDate = new Date(Number.parseInt(expireDate) * 1000);
            
        //     // set the cookie 
        //     document.cookie = `acalendar-jwt=${result["access_token"]}; expires=${expireDate};`;

        //     // by setting the cookie the user will be logged in
            
        //     // redirect the user to the monthly view
        //     window.location.href = "/auth/monthly.html";

        // } else {
        //     alert("invalid login credentials, details are in the console");
        //     console.log(result);
        // }
    })
    .catch(error => console.log(error));

}


function logoutClicked(e) {
    e.preventDefault();
    logout();
}