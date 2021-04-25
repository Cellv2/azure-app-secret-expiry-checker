import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { htmlToText } from "html-to-text";
import nodemailer from "nodemailer";
import { askQuestions } from "./cli";
import Config from "./config/config";
import { TABLE_HEADER_KEYS } from "./constants/email.constants";
import dataStoreInstance from "./data/data-store";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";
import { EmailTransportTypes } from "./types/email.types";
import { createEmailTransporter, generateMjmlTable } from "./utils/email.utils";

console.log("heya!");

const mainFs = () => {
    const config = new Config("", "", "");
    // console.log(config.getRootDir());
    console.log(Config.rootDir);

    filesystemInterfaceInstance.writeDataToFilesystemAsync("", "");
};
// mainFs();

const sendEmail = async (
    emailService: EmailTransportTypes,
    emailData: (MicrosoftGraph.PasswordCredential &
        AzureAdGraphModels.PasswordCredential)[]
) => {
    const testData: MicrosoftGraph.PasswordCredential[] = [
        {
            displayName: "App_1",
            endDateTime: "Some time in the future",
            keyId: "a guid",
            hint: "some hint",
        },
        {
            displayName: "App_2",
            endDateTime: "some time in the past",
            keyId: "another guid",
        },
    ];

    const mjmlParse = generateMjmlTable(TABLE_HEADER_KEYS, emailData);
    const htmlOutput = mjmlParse.html;
    const plainTextHtmlOutput = htmlToText(htmlOutput);

    const transporter = await createEmailTransporter(emailService);

    // ! Set this to true to send an email
    // ! no confidential info should be sent regardless of columns used, but please make sure you know what you are sending
    const sendTestEmail: boolean = false;
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
    } else {
        console.log(htmlOutput);
    }
};

const main = async (): Promise<void> => {
    await askQuestions();

    const data = dataStoreInstance.getEmailData();
    if (data) {
        console.log("DATA:", data);
        sendEmail("ethereal", data);
    }
};

main();
