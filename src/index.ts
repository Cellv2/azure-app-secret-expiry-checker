import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { Command } from "commander";
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
    // try {
    //     await askQuestions();

    //     const data = dataStoreInstance.getEmailData();
    //     if (data) {
    //         console.log("DATA:", data);
    //         await sendEmail("ethereal", data);
    //     }
    // } catch (err) {
    //     console.error(err);
    // }

    const program = new Command();

    program
        .option(
            "-i, --interactive",
            "interactive mode, all other flags are ignored if used",
            false
        )
        .option("-f, --file [path]", "absolute path to file with data to check")
        // .option("-e, --email-config <options...>", "the email config")
        .option("-s, --email-service [service]", "the email service to use", "ethereal")
        .option("-u, --email-username", "username used for auth against the selected email service")
        .option("-p, --email-password", "password used for auth against the selected email service")
        .option("-a, --api-key", "api key for auth against the selected email service")
        .option("-o, --out-file [path]", "absolute path to write the returned data to (if omitted, no file will be created)")
        .option("-d, --display", "whether to display the output in the terminal", true)
    // .option("-d, --debug", "output extra debugging")
    // .option("-s, --small", "small pizza size")
    // .option("-p, --pizza-type <type>", "flavour of pizza");

    program.parse(process.argv);

    const options = program.opts();
    // if (options.debug) console.log(options);
    // console.log("pizza details:");
    // if (options.small) console.log("- small pizza size");
    // if (options.pizzaType) console.log(`- ${options.pizzaType}`);
    if (options.interactive) {
        console.log("this was interactive");
        try {
            await askQuestions();

            const data = dataStoreInstance.getEmailData();
            if (data) {
                console.log("DATA:", data);
                await sendEmail("ethereal", data);
            }
        } catch (err) {
            console.error(err);
        }
    }

    if (!options.interactive) {
        console.log("defaulted");
    }
};

try {
    (async () => {
        await main();
    })();
} catch (err) {
    console.error(err);
}
