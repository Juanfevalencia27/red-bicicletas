const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = '3zTvzr3p67VC61jmV54rIYu1545x4TlY';

module.exports = {
    encrypt: function (text) {
        const cipher = crypto.createCipher(algorithm, key)
        let crypted = cipher.update(text, 'utf8', 'hex')
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (text) {
        const decipher = crypto.createDecipher(algorithm, key)
        let dec = decipher.update(text, 'hex', 'utf8')
        dec += decipher.final('utf8');
        return dec;
    },
    valToken : function (text) {
        return crypto.randomBytes(16).toString('hex')
    }
}