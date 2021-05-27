const nodemailer = require('nodemailer')
const transport = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "a19fac7d769ba4",
        pass: "70d2414751624d"
    }
});

module.exports = transport