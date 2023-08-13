const mail = require('nodemailer');


const transport = mail.createTransport({
    service: 'gmail',
    auth: {
        user : 'neel84740@gmail.com',
        pass:'vwnnbxpwhtwnetdx',
    }
});

module.exports = transport;
// @04748Neel#
//fknz roti jmco mufd