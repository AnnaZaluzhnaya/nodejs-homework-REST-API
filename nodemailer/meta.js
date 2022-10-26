const nodemailer = require("nodemailer");
require("dotenv").config();

const {META_PASSWORD} = process.env;

const nodemailerConfig = {
    host: "smtp.meta.ua",
    port: 465, // 25, 465, 2255
    secure: true,
    auth: {
        user: "annazaluzhna@meta.ua",
        pass: META_PASSWORD
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const mail = {
    to: "anna-flag-man@ukr.net",
    from: "annazaluzhna@meta.ua",
    subject: "Підтвердження участі у вебінарі",
    html: "Підтвердіть участь у вебінарі"
}

transport.sendMail(mail)
    .then(()=> console.log("Email send success"))
    .catch(error => console.log(error.message))