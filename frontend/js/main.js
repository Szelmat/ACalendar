const submitLoginBtn = document.querySelector("#submitLoginForm");
const submitRegisterBtn = document.querySelector("#submitRegisterForm");

// login credentials containers
const loginEmailDiv = document.querySelector("#loginEmailContainer");
const loginPwDiv = document.querySelector("#loginPwContainer");
// login credentials
const loginEmailInput = document.querySelector("#loginEmail");
const loginPwInput = document.querySelector("#loginPw");


// register credentials containers
const registerEmailDiv = document.querySelector("#registerEmailContainer");
const registerPwDiv = document.querySelector("#registerPwContainer");
const confirmPwDiv = document.querySelector("#confirmPwContainer");
// register credentials
const registerEmailInput = document.querySelector("#registerEmail");
const registerPwInput = document.querySelector("#registerPw");
const confirmPwInput = document.querySelector("#confirmPw");

const apiServerUri = "http://127.0.0.1:8000";


/* register event listeners */
submitLoginBtn.addEventListener("click", e => {
    let error = false;
    const loginEmail = loginEmailInput.value;
    const loginPw = loginPwInput.value;

    // remove the feedback for invalid credentials if they are presented
    removeInvalidMsg(loginEmailDiv, "invalidEmailFeedback", "border-red");
    removeInvalidMsg(loginPwDiv, "invalidPasswordFeedback", "border-red");
    
    // validate email
    if(! emailValidator(loginEmail)) {
        insertInvalidMsg(loginEmailDiv, "invalidEmailFeedback", "The given email address is not valid!");
        error = true;
    }

    // validate password (only the syntax)
    if(loginPw.trim() === "") {
        insertInvalidMsg(loginPwDiv, "invalidPasswordFeedback", "The password field can not be empty!");
        error = true;
    }

    // we can move on only if there was no error during the validation
    if(! error) {
        sendAjaxPostRequest(`${apiServerUri}/api/login`, {
            username: loginEmail,
            password: loginPw
        })
        .then(result => {
            if(result === "okay") {
                alert("ok, now you are logged in");
                // JWT token
                // check continuously if in the "auth" folder there are only authenticated users
                window.open("/auth/monthly.html");
            } else {
                alert("hehe, invalid login credentials");
            }
        })
        .catch(error => console.log(error));
    }



})

/* implement event listeners */


/* validators */
function emailValidator(email = "") {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    
    if(regex.test(email)) {
        return true;
    }

    return false;
    
}

function insertInvalidMsg(container, spanId, message) {
    let invalidMsgSpan = document.createElement("span");
    invalidMsgSpan.className = "red-text";
    invalidMsgSpan.innerHTML = message;
    invalidMsgSpan.id = spanId;
    container.appendChild(invalidMsgSpan);
    container.classList.add("border-red")
}

function removeInvalidMsg(container, spanId, invalidClassName) {
    if(container.lastElementChild.id === spanId) {
        container.removeChild(container.lastElementChild);
        container.classList.remove(invalidClassName)
    }
}