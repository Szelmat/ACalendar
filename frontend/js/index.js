
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

const apiServerUrl = getApiServerUrl();


/* register all the event listeners */
submitLoginBtn.addEventListener("click", e => loginUser(e));
submitRegisterBtn.addEventListener("click", e => registerUser(e));
clearLS();

/* implement all the event listeners */

/**
 * Login user.
 * @param {Event} e 
 */
function loginUser(e) {

    // let temp = new Date().getTime() / 1000 + 10;

    // let JWTheader = {
    //     "alg": "HS256",
    //     "typ": "JWT"
    //     // "exp": temp
    // };

    // let JWTpayload = {
    //     "sub": "1234567890",
    //     "name": "John Doe",
    //     "admin": true
    // };

    // let JWTsecret = "secret";
    
    // let resultJWT = createJWT(JWTheader, JWTpayload, JWTsecret);

    // console.log(resultJWT);

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
        sendAjaxPostRequest(`${apiServerUrl}/api/login`, {
            username: loginEmail,
            password: loginPw
        })
        .then(result => {
            if("access_token" in result) {

                // jwt components (header, payload, signature) are separated by dots
                let jwtComponents = result["access_token"].split(".");

                // the payload is the 2nd component of the JWT
                let jwtPayload = JSON.parse(getBase64Decode(jwtComponents[1]));

                // the jwt "expire" time will be the cookie's expire time as well
                let expireDate = jwtPayload["exp"];
                expireDate = new Date(Number.parseInt(expireDate) * 1000);
                
                // set the cookie 
                document.cookie = `acalendar-jwt=${result["access_token"]}; expires=${expireDate};`;

                // by setting the cookie the user will be logged in
                
                // redirect the user to the monthly view
                window.location.href = "/auth/monthly.html";

            } else {
                alert("invalid login credentials, details are in the console");
                console.log(result);
            }
        })
        .catch(error => console.log(error));
    }
}


/**
 * Register user.
 * @param {Event} e 
 */
function registerUser(e) {
    let error = false;
    const registerEmail = registerEmailInput.value;
    const registerPw = registerPwInput.value;
    const confirmPw = confirmPwInput.value;

    // remove the feedback for invalid credentials if they are presented
    removeInvalidMsg(registerEmailDiv, "invalidEmailFeedback", "border-red");
    removeInvalidMsg(registerPwDiv, "invalidPasswordFeedback", "border-red");
    removeInvalidMsg(confirmPwDiv, "invalidConfirmPasswordFeedback", "border-red");
    
    // validate email
    if(! emailValidator(registerEmail)) {
        insertInvalidMsg(registerEmailDiv, "invalidEmailFeedback", "The given email address is not valid!");
        error = true;
    }

    const pwRegex = /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]{8,64}$/
    // validate password (only the syntax)
    if(registerPw.trim() === "") {
        insertInvalidMsg(registerPwDiv, "invalidPasswordFeedback", "The password field can not be empty!");
        error = true;
    } else if(! pwRegex.exec(registerPw)) {
        insertInvalidMsg(registerPwDiv, "invalidPasswordFeedback", `The password must contain english letters, numbers, and special characters (!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?)!`);
        error = true;
    }

    // validate confirm password (only that wether it's the same as the password)
    if(confirmPw !== registerPw) {
        insertInvalidMsg(confirmPwDiv, "invalidConfirmPasswordFeedback", "The given passwords must be the same!");
        error = true;
    }

    // we can move on only if there was no error during the validation
    if(! error) {
        sendAjaxPostRequest(`${apiServerUrl}/api/register`, {
            email: registerEmail,
            password: registerPw,
            confirm_password: confirmPw
        })
        .then(result => {
            if(result["message"] === "Successful registration!") {
                // JWT token
                // etc..
                // check continuously if in the "auth" folder there are only authenticated users
                alert("Successful registration!");
            } else {
                console.log(result["message"]);
                alert("hehe, invalid register credentials, more details in the console");
            }
        })
        .catch(error => console.log(error));
    }
}


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