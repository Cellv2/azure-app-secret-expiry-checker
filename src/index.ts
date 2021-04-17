import { askQuestions } from "./cli";
import Config from "./config/config";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";

import nodemailer from "nodemailer";
import { htmlToText } from "html-to-text";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { generateMjmlTable } from "./utils/email.utils";
import { TABLE_HEADER_KEYS } from "./constants/email.constants";

console.log("heya!");

const mainFs = () => {
    const config = new Config("", "", "");
    // console.log(config.getRootDir());
    console.log(Config.rootDir);

    filesystemInterfaceInstance.writeDataToFilesystemAsync("", "");
};
// mainFs();

const sendEmail = async () => {
    const testData: MicrosoftGraph.PasswordCredential[] = [
        {
            displayName: "App_1",
            endDateTime: "Some time in the future",
            keyId: "a guid",
        },
        {
            displayName: "App_2",
            endDateTime: "some time in the past",
            keyId: "another guid",
        },
    ];

    const mjmlParse = generateMjmlTable(TABLE_HEADER_KEYS, testData);
    const htmlOutput = mjmlParse.html;
    const plainTextHtmlOutput = htmlToText(htmlOutput);

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

    const sendTestEmail: boolean = true;
    if (sendTestEmail) {
        // send mail with defined transport object
        const info = await transporter.sendMail({
            from: '"Chuck Testa" <chuck@testa.com>', // sender address
            to: "chuck@norris.com, saur@fang.com", // list of receivers
            subject: "Hello ✔", // Subject line
            text: plainTextHtmlOutput,
            html: htmlOutput,
        });

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
    }
};

const main = async (): Promise<void> => {
    // askQuestions();
    sendEmail();
};

main();
