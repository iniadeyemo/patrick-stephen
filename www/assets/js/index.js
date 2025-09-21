function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

function getFirstWord(str) {
    if (!str) {
        return "[Name]"; // Handle empty or null strings
    }
    const words = str.trim().split(" "); // Trim and split by spaces
    if (words.length > 0) {
        return words[0];
    } else {
        return "[Name]"; // Handle strings with no words after trimming
    }
}

function formatNumber(value, options = {}) {
    const {
        decimalPlaces = 0,
        thousandSeparator = ',',
        decimalSeparator = '.',
        currencySymbol = '',
        prefix = false
    } = options;

    if (isNaN(value)) return 'Invalid Number';

    let [integerPart, decimalPart] = Number(value).toFixed(decimalPlaces).split('.');

    // Add thousand separators
    integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);

    // Construct final formatted number
    let formattedNumber = decimalPlaces > 0 ? integerPart + decimalSeparator + decimalPart : integerPart;

    return prefix ? currencySymbol + formattedNumber : formattedNumber + currencySymbol;
}

// USAGE
//var foo = getParameterByName('qwe');


const params = new URLSearchParams(window.location.search);

var SITE_URL = 'https://app.patrickstephenpurpleheartfoundationforwidows.org/webservice/';
var SITE_URL_NORM = 'https://app.patrickstephenpurpleheartfoundationforwidows.org/';
//var SITE_URL = 'http://patrickapp.localhost/webservice/';
//var SITE_URL_NORM = 'http://patrickapp.localhost/';

function updateNotificationCount(notif_count) {

    const notifElements = document.querySelectorAll(".notif-count");
    if (notifElements){
        if (notif_count > 0) {
            notifElements.forEach(element => {
            element.classList.remove("d-none");
            element.classList.add("d-flex");
            element.innerHTML = notif_count;
            });
        } else {
            notifElements.forEach(element => {
            element.classList.remove("d-flex");
            element.classList.add("d-none");
            });
        }
    }
}


function fetchUnreadNotifications(id){
    $.ajax({
        type: "GET",
        url: SITE_URL+`ws.php?user=${id}&getNotif=`, 
        dataType:"JSON",
        crossDomain: true,
        cache: false,
        beforeSend: function () { 
        },
        success: function (response) {
            currentCount = response[0].notif_count;

            sessNC = sessionStorage.getItem("notifcount");
            if(!sessNC){
                sessNC = 0;
            }
            
            sessNC = parseInt(sessNC);
            if(currentCount > sessNC){
                console.log("New notification")
                document.getElementById("toastPopupA").href = "notification.html";
                document.getElementById("toast-content").innerHTML = `You have new notifications`
                document.getElementById("toastPopup").classList.remove("bg-success");
                document.getElementById("toastPopup").classList.remove("bg-danger");
                document.getElementById("toastPopup").classList.add("bg-info");
                let toast = new bootstrap.Toast(document.getElementById('toastPopup'));
                toast.show();
            }
            sessionStorage.setItem('notifcount', currentCount);

            updateNotificationCount(currentCount);
                       
        },
        error: function(jqXHR, textStatus, errorThrown){}
    });
}

function performCheckup(userId) {
    
    $.ajax({
        type: "GET",
        url: SITE_URL+`ws.php?userId=${userId}`, 
        dataType:"JSON",
        crossDomain: true,
        cache: false,
        beforeSend: function () { 
        },
        success: function (response) {
            
            disabled = response[0].disabled;
            verified = response[0].verified;
            email = response[0].email;
            u_name = response[0].name;

            if(disabled){
                window.location = "logout.html";
            }else if(!verified){
                window.location = "logout.html";
            }else{
                //update data
                var saveData = {
                    email: email,
                    name: u_name,
                    id: userId
                };
                dataUserStr = JSON.stringify(saveData);
                sessionStorage.setItem('user', dataUserStr);
                now = Date.now();
                sessionStorage.setItem("lastCheckup", now.toString());
            }
                       
        },
        error: function(jqXHR, textStatus, errorThrown){}
    });
}

function checkLastCheckup(userId) {
    const lastCheckup = sessionStorage.getItem("lastCheckup");
    const now = Date.now();

    if (!lastCheckup || now - Number(lastCheckup) > 24 * 60 * 60 * 1000) {
        performCheckup(userId);
        
    }
}

$(document).ready(function() {
$('#preloader').fadeOut('fast', function() {
});
});


const retrievedUserString = sessionStorage.getItem("user");


if (retrievedUserString) {
    // Parse the JSON string back into a JavaScript object
    retrievedUser = JSON.parse(retrievedUserString);

    // Use the retrieved data
    //console.log(retrievedUser); 
    //console.log(retrievedUser.name); 
    //console.log(retrievedUser.id); 
    //console.log(retrievedUser.email); 

    userId = retrievedUser.id;

    //CHECK IF DISABLED OR DATA CHANGED 
    checkLastCheckup(userId);
    $(document).ready(function() {
        
        updateNotificationCount(0);
        fetchUnreadNotifications(userId);
        setInterval(function() {
            fetchUnreadNotifications(userId);
        }, 5000);

        //GET RANDOM MOTIVATION QUOTE
        
    });
    

   

}



