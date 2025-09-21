var user = "";

if (typeof sessionStorage == 'undefined') {
    window.location = "login.html";
} else {
    user = sessionStorage.getItem('user');
    
}

if (user === null) {
    window.location = "login.html";
} else {

}


