const bcrypt = require('bcrypt');

//Config
const appConfig = require('../config/configApp');

let passwordLib = {
    hashpassword: (myPlaintextPassword) => {
        let salt = bcrypt.genSaltSync(appConfig.saltRounds);
        let hash = bcrypt.hashSync(myPlaintextPassword, salt);
        return hash;
    },
    comparePassword: (oldPassword, hashpassword) => {
        return bcrypt.compare(oldPassword, hashpassword);
    }
}

module.exports = passwordLib;