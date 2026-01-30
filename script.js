const log = (msg) => console.log(msg);

// Globala referenser
const titleRef = document.querySelector('#title');
const errorMsgRef = document.querySelector('#errorMsg');
const loginFormRef = document.querySelector('#loginForm');
const registerFormRef = document.querySelector('#registerForm');
const loginSectionRef = document.querySelector('#loginSection');
const registerSectionRef = document.querySelector('#registerSection');
const loginBtnRef = document.querySelector('#loginBtn');
const registerBtnRef = document.querySelector('#registerBtn');
const confirmRef = document.querySelector('#confirm');
const confirmBtnRef = document.querySelector('#confirmBtn');
const formRefs = {
    usernameRef: document.querySelector('#username'),
    setUsernameRef: document.querySelector('#setUsername'),
    passwordRef: document.querySelector('#password'),
    setPasswordRef: document.querySelector('#setPassword'),
    repeatPasswordRef: document.querySelector('#repeatPassword'),
    checkboxRef: document.querySelector('#checkbox'),
};

// Kontrollerar vilken sida man befinner sig på
if (location.pathname === '/' || location.pathname === '/index.html') {
    initPage();

    loginSectionRef.addEventListener('click', (event) => {
        event.preventDefault();
        initPage();
    });
    registerSectionRef.addEventListener('click', (event) => {
        event.preventDefault();
        displayRegister();
    });
    loginBtnRef.addEventListener('click', (event) => {
        event.preventDefault();
        if (validateLogin()) {
            goToNextPage(getUsername(formRefs.usernameRef.value));
        }
    });
    registerBtnRef.addEventListener('click', (event) => {
        event.preventDefault();
        if (validateRegistration()) {
            registerUser();
        }
    });
    confirmBtnRef.addEventListener('click', initPage);
} else if (location.pathname === '/home.html') {
    homePageSetup();
}

function initPage() {
    titleRef.textContent = 'Login';
    errorMsgRef.textContent = '';
    registerFormRef.classList.add('d-none');
    confirmRef.classList.add('d-none');
    loginFormRef.classList.remove('d-none');
}

function displayRegister() {
    titleRef.textContent = 'Register account';
    errorMsgRef.textContent = '';
    registerFormRef.classList.remove('d-none');
    loginFormRef.classList.add('d-none');
}

function validateRegistration() {
    log('validateRegistration()');
    const username = formRefs.setUsernameRef.value.trim();
    const password = formRefs.setPasswordRef.value;
    const repeatPassword = formRefs.repeatPasswordRef.value;
    const checkbox = formRefs.checkboxRef;

    try {
        if (username.length < 6) {
            throw {
                msg: 'Username must contain at least 6 characters',
                noderef: formRefs.setUsernameRef,
            };
        } else if (usernameExist(username)) {
            throw {
                msg: 'Username is already taken',
                noderef: formRefs.setUsernameRef,
            };
        } else if (password.length < 8) {
            throw {
                msg: 'Password must contain at least 8 character',
                noderef: formRefs.setPasswordRef,
            };
        } else if (password !== repeatPassword) {
            throw {
                msg: 'The passwords you entered do not match',
                noderef: formRefs.setPasswordRef,
            };
        } else if (!checkbox.checked) {
            throw {
                msg: 'Terms of service must be accepted',
                noderef: formRefs.checkboxRef,
            };
        }
        errorMsgRef.textContent = '';
        return true;
    } catch (error) {
        errorMsgRef.textContent = error.msg;
        error.noderef.focus();
        return false;
    }
}

function validateLogin() {
    const username = formRefs.usernameRef.value.trim();
    const password = formRefs.passwordRef.value;

    try {
        if (!usernameExist(username)) {
            throw {
                msg: 'Username does not exist',
                noderef: formRefs.usernameRef,
            };
        } else if (!checkPassword(username, password)) {
            throw {
                msg: 'The password you entered is incorrect',
                noderef: formRefs.passwordRef,
            };
        }
        return true;
    } catch (error) {
        errorMsgRef.textContent = error.msg;
        error.noderef.focus();
        return false;
    }
}

function usernameExist(username) {
    log('usernameExist()');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users.some(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
    ); // returnerar true eller false beroende på om det finns i localStorage
}

function registerUser() {
    log('registerUser()');
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userData = {};
    userData.username = formRefs.setUsernameRef.value;
    userData.password = formRefs.setPasswordRef.value;
    users.push(userData);
    localStorage.setItem('users', JSON.stringify(users));
    registerFormRef.reset();
    registerFormRef.classList.add('d-none');
    confirmRef.classList.remove('d-none');
    titleRef.textContent = 'Account registered!';
}

function checkPassword(username, password) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
    return user.password === password; // returnerar true om lösenordet är lika
}

function getUsername(username) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(
        (user) => user.username.toLowerCase() === username.toLowerCase(),
    );
    return user.username;
}

// Går till nästa sida och lagrar det användarnamnet man loggat in med i localStorage
function goToNextPage(username) {
    localStorage.setItem('currentUser', username);
    location.href = './home.html';
}

function homePageSetup() {
    const user = localStorage.getItem('currentUser');
    document.querySelector('#welcomeMsg').textContent = `Välkommen ${user}!`;
}
