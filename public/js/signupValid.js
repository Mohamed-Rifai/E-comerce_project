const form = document.getElementById('form')
const nam = document.getElementById('name')
const phone= document.getElementById('phone')
const email= document.getElementById('email')
const password= document.getElementById('password')
const confirmPassword= document.getElementById('conPassword')


form.addEventListener('submit',(e)=>{
    let flag = 0

    const nameValue = nam.value
    const phoneValue = phone.value.trim()
    const emailValue = email.value.trim()
    const passwordValue = password.value.trim()
    const conPasswordValue = confirmPassword.value.trim()
     
    if(nameValue === ""){
        setError(nam,'Field is empty','nameError')
        flag = 1
    }else if(!onlyLetter(nameValue)){
      setError(nam,'Name should only contain alphabets','nameError')
      flag = 1
    }else{
        setSuccess(nam,'nameError')
        flag = 0
    }

    if(phoneValue === ""){
        setError(phone, "Field empty!!! ", "phoneError");
        flag = 1
    }else if(phoneValue.toString().length !== 10 || isNaN(Number(phoneValue))){
        setError(phone,'Phone number is not valid','phoneError')
        flag = 1
    }else{
        setSuccess(phone,'phoneError')
        flag = 0
    }

    if(emailValue === ""){
        setError(email,'Field empty!!!','emailError')
        flag = 1
    }else if(!emailValidation(emailValue)){
        setError(email,'Email id is invalid','emailError')
        flag = 1
    }else{
        setSuccess(email,'emailError')
    }

    if(passwordValue === ""){
        setError(password,'Field empty!!!','passwordError')
        flag = 1
    }else if(passwordValue.length < 8){
        setError(password,'Password must atleast 8 characters','passwordError')
        flag = 1
    }else if(passwordValue.length > 14){
        setError(password,'Password length cant exceed 15 characters','passwordError')
        flag = 1
    }else{
        setSuccess(password,'passwordError') 
           flag = 0 
    }
    
    if(conPasswordValue === ""){
        setError(confirmPassword,'Field empty!!!','conpasswordError')
        flag = 1
    // }else if(conPasswordValue.length < 8){
    //     setError(password,'','conpasswordError')
    //     flag = 1
    // }else if(conPasswordValue.length > 14){
    //     setError(password,'','conpasswordError')
    //     flag = 1
   }
    else if(conPasswordValue !== passwordValue ){
        setError(confirmPassword,'Password do not match','conpasswordError')
        flag = 1 
    }else{ 
        setSuccess(confirmPassword,'conpasswordError')
        flag = 0
    }


    if(flag === 1){
        e.preventDefault();
        return 0
    }else {
        return 0
    }

})

function setError(element,massage,id){
    const inputControl = element.parentElement
    document.getElementById(id).innerHTML = massage
    inputControl.classList.add('danger')
    inputControl.classList.remove('success')
}

function setSuccess(element,id){
    const inputControl = element.parentElement
    document.getElementById(id).innerHTML = ""
    inputControl.classList.add('success')
    inputControl.classList.remove('danger')
}

function onlyLetter(str){
    return /^[a-zA-Z\s]+$/.test(str);
}

function emailValidation(email){
    return String(email)
    .toLowerCase()
    .match(  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
}









