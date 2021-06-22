import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { htmlToText } from "html-to-text";
import nodemailer from "nodemailer";
import yargs from "yargs";
import { askQuestions } from "./cli";
import Config from "./config/config";
import { TABLE_HEADER_KEYS } from "./constants/email.constants";
import dataRequestorInstance from "./data/data-requestor";
import dataStoreInstance from "./data/data-store";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";
import { EmailTransportTypes } from "./types/email.types";
import { createEmailTransporter, generateMjmlTable } from "./utils/email.utils";

console.log("heya!");

const mainFs = () => {
    const config = new Config("", "", "");
    // console.log(config.getRootDir());
    console.log(Config.rootDir);

    filesystemInterfaceInstance.writeDataToFilesystemAsync("", "KEKW!!!!!!!");
};
// mainFs();

const sendEmail = async (
    emailService: EmailTransportTypes,
    emailData: (MicrosoftGraph.PasswordCredential &
        AzureAdGraphModels.PasswordCredential)[],
    send: boolean = false
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
    // const sendEmail: boolean = true;
    if (send) {
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
    const availableEmailServices: ReadonlyArray<EmailTransportTypes> = [
        "ethereal",
        "mailtrap",
        "sendgrid",
    ];
    const argv = yargs(process.argv.slice(2)).options({
        i: {
            type: "boolean",
            default: false,
            alias: "interactive",
            description:
                "interactive mode, all other flags are ignored if used",
        },
        f: {
            type: "string",

            alias: "file",
            description: "absolute path to file with data to check",
        },
        s: {
            type: "boolean",
            default: false,
            alias: "send-email",
        },
        e: {
            choices: availableEmailServices,

            alias: "email-service",
            description: "the email service to use",
        },
        u: {
            type: "string",
            alias: "email-username",
            description: "username for Mailtrap email service",
        },
        p: {
            type: "string",
            alias: "email-password",
            description: "password for Mailtrap email service",
        },
        a: {
            type: "string",
            alias: "email-api-key",
            description: "api key for Sendgrid email service",
            conflicts: ["u", "p"],
        },
        o: {
            type: "string",
            alias: "out-file",
            description:
                "absolute path to write the returned data to (if omitted, no file will be created)\n NOTE: This will NOT overwrite an existing file at this point in time!",
        },
        d: {
            type: "boolean",
            alias: "display",
            description: "display terminal output",
            default: true,
        },
    }).argv;

    // TODO: check out positional descriptions (can tie the service credentials all together perhaps?)
    // https://github.com/yargs/yargs/blob/master/docs/advanced.md#describing-positional-arguments

    if (argv.i) {
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

    if (!argv.i) {
        console.log("non-interactive");
        if (!argv.f || !argv.e) {
            console.error(
                "Both an input file path (-f flag) and an email service (-e flag) are required in non-interactive mode.\n\nPlease enter both flags and run this again. Please use --help if futher information is required"
            );
            return;
        }

        try {
            const fileData =
                await filesystemInterfaceInstance.readDataFromFilesystemAsync(
                    argv.f
                );

            dataStoreInstance.setDataObjectsToCheck(JSON.parse(fileData));
            const data = dataStoreInstance.getDataObjectsToCheck();
            if (data) {
                const secrets =
                    await dataRequestorInstance.requestSecretsForAllApps(data);
                dataStoreInstance.bulkAddSecretsToStore(secrets);
            }

            if (argv.s) {
                const emailData = dataStoreInstance.getEmailData();
                if (emailData) {
                    await sendEmail(argv.e, emailData, true);
                }
            }

            if (argv.o) {
                const data = JSON.stringify(
                    dataStoreInstance.getEmailData(),
                    null,
                    4
                );
                if (data) {
                    await filesystemInterfaceInstance.writeDataToFilesystemAsync(
                        argv.o,
                        data
                    );
                } else {
                    console.log(
                        `File at ${argv.o} appears to be empty - please ensure it contains data`
                    );
                }
            }
        } catch (err) {
            console.error(err);
            return;
        }
    }
};

try {
    (async () => {
        await main();
    })();
} catch (err) {
    console.error(err);
}
