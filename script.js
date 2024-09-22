

const firebaseConfig = {
    apiKey: "AIzaSyCwjYY2QDiwFAms_SAvk69srP1dj18E_I8",
    authDomain: "phoneotp-59008.firebaseapp.com",
    projectId: "phoneotp-59008",
    storageBucket: "phoneotp-59008.appspot.com",
    messagingSenderId: "41261722416",
    appId: "1:41261722416:web:455103bdecc4bcd0d976f5",
    measurementId: "G-Q6RW7EJMP1"
  };

firebase.initializeApp(firebaseConfig);

let recaptchaVerifier;
document.addEventListener("DOMContentLoaded", function() {
    // Initialize reCAPTCHA verifier
    recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        'size': 'invisible',
        'callback': function(response) {
            console.log('reCAPTCHA resolved');
        }
    });

    // Render reCAPTCHA
    recaptchaVerifier.render().then(function(widgetId) {
        window.recaptchaWidgetId = widgetId;
    }).catch(function(error) {
        console.error("reCAPTCHA rendering failed: ", error);
    });
});

// Function to send OTP
function phoneAuth() {
    var phoneNumber = document.getElementById('number').value;

    firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then(function (confirmationResult) {
            window.confirmationResult = confirmationResult;
            document.getElementById('sender').style.display = 'none';
            document.getElementById('verifier').style.display = 'block';
        }).catch(function (error) {
            console.error("Error sending SMS: ", error);
        });
}

 // Function to verify OTP
 function codeVerify() {
    var code = document.getElementById('verificationcode').value;
    confirmationResult.confirm(code)
        .then(function (result) {
            var user = result.user;
            var messageElement = document.getElementById('verification-result');
            messageElement.innerText = "Number verified";
            messageElement.className = "message success";
            messageElement.style.display = 'block';
        }).catch(function (error) {
            var messageElement = document.getElementById('verification-result');
            messageElement.innerText = "Incorrect OTP: " + error.message;
            messageElement.className = "message error";
            messageElement.style.display = 'block';
            console.error("Error verifying OTP: ", error);
        });
}

(function(){
    emailjs.init("4mSAkXw5nbJ4HmG_P");
})();

let generatedOTP;

function sendOTP() {
    const email = document.getElementById('email').value;
    const mobile = document.getElementById('number').value;
    
    // Validate email and mobile number
    if (!validateEmail(email) || !validateMobile(mobile)) {
        alert("Please enter a valid email and mobile number.");
        return;
    }

    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();

    const templateParams = {
        to_email: email,
        otp: generatedOTP
    };

    emailjs.send('service_i0x7tdf', 'template_tahe8wp', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
            document.getElementById('otpSection').style.display = 'block';
        }, function(error) {
            console.log('FAILED...', error);
        });
}

function verifyOTP() {
    const enteredOTP = document.getElementById('otp').value;

    if (enteredOTP === generatedOTP) {
        alert("OTP Verified Successfully!");
        // Perform further registration process here
    } else {
        alert("Invalid OTP. Please try again.");
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateMobile(mobile) {
    const re = /^\+91[0-9]{10}$/;
    return re.test(mobile);
}
