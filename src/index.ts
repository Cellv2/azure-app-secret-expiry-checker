import { askQuestions } from "./cli";
import Config from "./config/config";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";

import nodemailer from "nodemailer";

console.log("heya!");

const mainFs = () => {
    const config = new Config("", "", "");
    // console.log(config.getRootDir());
    console.log(Config.rootDir);

    filesystemInterfaceInstance.writeDataToFilesystemAsync("", "");
};
// mainFs();

const sendEmail = async () => {
    // ethereal.email test account
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user, // generated ethereal user
            pass: testAccount.pass, // generated ethereal password
        },
    });

    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: '"Chuck Testa" <chuck@testa.com>', // sender address
        to: "chuck@norris.com, saur@fang.com", // list of receivers
        subject: "Hello ✔", // Subject line
        text: "Hello world?", // plain text body
        html: "<b>Hello world?</b>", // html body
    });

    console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

const main = async (): Promise<void> => {
    // askQuestions();
    sendEmail();
};

main();
