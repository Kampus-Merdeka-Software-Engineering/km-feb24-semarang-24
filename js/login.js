const loginBtn = document.querySelector("#login");
const registerBtn = document.querySelector("#register");
const loginForm = document.querySelector(".login-form");
const registerForm = document.querySelector(".register-form");


loginBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "#3d0508";
    loginBtn.style.color = "#FFFFFF";
    registerBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    registerBtn.style.color = "#737373";

    loginForm.style.left = "50%";
    registerForm.style.left = "-50%";

    loginForm.style.opacity = 1;
    registerForm.style.opacity = 0;

    document.querySelector(".col-1").style.borderRadius = "0 30% 20% 0";
})


registerBtn.addEventListener('click', () => {
    loginBtn.style.backgroundColor = "rgba(255, 255, 255, 0.2)";
    loginBtn.style.color = "#737373";
    registerBtn.style.backgroundColor = "#3d0508";
    registerBtn.style.color = "#FFFFFF";

    loginForm.style.left = "150%";
    registerForm.style.left = "50%";

    loginForm.style.opacity = 0;
    registerForm.style.opacity = 1;

    document.querySelector(".col-1").style.borderRadius = "0 20% 30% 0";
})

// Validation and Alert
const loginSubmitBtn = loginForm.querySelector(".input-submit a");
const registerSubmitBtn = registerForm.querySelector(".input-submit a");

loginSubmitBtn.addEventListener('click', (event) => {
    const username = loginForm.querySelector('input[type="text"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    if (username === "" || password === "") {
        event.preventDefault();
        alert("Please fill in all fields in the login Form.");
    }
})

registerSubmitBtn.addEventListener('click', (event) => {
    const email = registerForm.querySelector('input[type="text"]').value;
    const username = registerForm.querySelector('input[type="text"]').value;
    const password = registerForm.querySelector('input[type="password"]').value;

    if (email === "" || username === "" || password === "") {
        event.preventDefault();
        alert("Please fill in all fields in the registration Form.");
    }
})


