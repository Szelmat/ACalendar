const logoutLink = document.querySelector("#logout");


document.addEventListener("DOMContentLoaded", e => {
    logoutLink.addEventListener("click", e => logoutClicked(e))
})



function logoutClicked(e) {
    e.preventDefault();
    logout();
}