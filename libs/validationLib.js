let validationsLib = {
    email: (email) => {
        let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (email.match(emailRegex)) {
            return true;
        } else {
            return false;
        }
    },
    mobileNumber: (mobileNumber) => {
        let mobileNumberRegex = /^[6-9]\d{9}$/; /* 10 digits starts with 6-9 */
        if (mobileNumber.match(mobileNumberRegex)) {
            return true;
        } else {
            return false;
        }
    },
    password: (password) => {
        let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/; /* Minimum 8 characters which contain only one capital letter, one special character, 1 digit and one small letter */
        if (password.match(passwordRegex)) {
            return true;
        } else {
            return false;
        }
    }
}

module.exports = validationsLib;