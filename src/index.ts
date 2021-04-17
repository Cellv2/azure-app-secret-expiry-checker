import { askQuestions } from "./cli";
import Config from "./config/config";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";

import nodemailer from "nodemailer";
import mjml2html from "mjml";
import { htmlToText } from "html-to-text";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

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

    const TABLE_KEYS: Array<keyof MicrosoftGraph.PasswordCredential> = [
        "displayName",
        "keyId",
        "endDateTime",
    ];

    const generateTableHeaders = (headerKeys: typeof TABLE_KEYS): string => {
        const rowStart = `<tr style="border-bottom:1px solid #ecedee;text-align:left;">`;
        const rowEnd = `</tr>`;
        const headers = headerKeys.map(
            (item) => `<th>${item}</th>`
        );

        return `${rowStart}${headers}${rowEnd}`;
    };

    const generateTableRows = (
        headerKeys: typeof TABLE_KEYS,
        tableData: MicrosoftGraph.PasswordCredential[]
    ): string => {
        const body = tableData
            .map((item) => {
                // each data object in the input should have the header key, so we map over the input data and extract each key in turn
                const row = headerKeys.map(
                    (key) => `<td>${item[key] ?? "null"}</td>`
                );

                return `<tr>${row}</tr>`;
            })
            .join("");

        return body;
    };

    // running functions outside of html else the JS will get embedded as part of mjml
    const generatedHeaders = generateTableHeaders(TABLE_KEYS);
    const generatedTableRows = generateTableRows(TABLE_KEYS, testData);

    const mjmlParse = mjml2html(
        `
        <mjml>
            <mj-body>
            <mj-section>
                <mj-column>
                <mj-text>
                    Hello World!
                </mj-text>
                </mj-column>
            </mj-section>
            <mj-section>
                <mj-column>
                <mj-table>
                    ${generatedHeaders}
                    ${generatedTableRows}
                </mj-table>
                </mj-column>
            </mj-section>
            </mj-body>
        </mjml>
        `
    );

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
