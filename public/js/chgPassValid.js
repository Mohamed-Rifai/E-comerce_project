const form = document.getElementById('form');
const currentPassword = document.getElementById('currentPassword');
const password = document.getElementById('newPassword');
const confirmpassword = document.getElementById('conNewPassword');

form.addEventListener('submit', (e) => {

    let flag = 0;
    const passwordvalue = password.value.trim();
    const conpasswordvalue = confirmpassword.value.trim();

    if (passwordvalue === '') {
        setError(password, 'Password is required', 'passworderror');
        flag = 1;
    } else if (passwordvalue.length < 8) {
        setError(password, 'Password must be atleast 8 characters', 'passworderror');
        flag = 1;
    } else if (passwordvalue.length > 14) {
        setError(password, 'Password length cant exceed 15 characters');
        flag = 1;
    } else {
        setSuccess(password, 'passworderror');
        flag = 0;
    }

    if (conpasswordvalue === '') {
        setError(confirmpassword, 'This field is required', 'conpassworderror');
        flag = 1;
    } else if (passwordvalue !== conpasswordvalue) {
        setError(confirmpassword, 'Password do not match', 'conpassworderror');
        flag = 1;
    } else if (passwordvalue.length < 8) {
        setError(password, 'Password must be atleast 8 characters', 'passworderror');
        flag = 1;
    } else if (passwordvalue.length > 14) {
        setError(password, 'Password length cant exceed 15 characters');
        flag = 1;
    } else {
        setSuccess(confirmpassword, 'conpassworderror');
        flag = 0;
    }

    if (flag === 1) {
        e.preventDefault();
        return 0;
    } else {
        return 0;
    }

})

 

function setError(element, message, id) {

    document.getElementById(id).innerText = message;

}

function setSuccess(element, id) {

    document.getElementById(id).innerText = '';

}
