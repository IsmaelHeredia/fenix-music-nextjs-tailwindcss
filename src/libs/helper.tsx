var bcrypt = require("bcryptjs");

export function generatePassword(pwd: any) {
    var salt = bcrypt.genSaltSync(10);
    var hash = bcrypt.hashSync(pwd, salt);        
    return hash;
}