import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import mjml2html from "mjml";
import nodemailer from "nodemailer";
import { MAILTRAP_PASSWORD, MAILTRAP_USERNAME } from "../config/secrets";
import { TABLE_HEADER_KEYS } from "../constants/email.constants";
import { EmailTransportTypes } from "../types/email.types";

export const generateTableHeaders = (
    headerKeys: typeof TABLE_HEADER_KEYS
): string => {
    const rowStart = `<tr style="border-bottom:1px solid #ecedee;text-align:left;">`;
    const rowEnd = `</tr>`;
    const headers = headerKeys.map((item) => `<th>${item}</th>`);

    return `${rowStart}${headers}${rowEnd}`;
};

export const generateTableRows = (
    headerKeys: typeof TABLE_HEADER_KEYS,
    tableData: (
        | MicrosoftGraph.PasswordCredential
        | AzureAdGraphModels.PasswordCredential
    )[]
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

/**
 * Creates the mjml email template and the associated table
 * @param headerKeys A set of keys used to create headrs and map the data to the correct column
 * @param tableData The array of PasswordCredential objects
 * @returns A mjml parse result object. Get the 'html' property for the raw html
 */
export const generateMjmlTable = (
    headerKeys: typeof TABLE_HEADER_KEYS,
    tableData: (
        | MicrosoftGraph.PasswordCredential
        | AzureAdGraphModels.PasswordCredential
    )[]
) => {
    // running functions outside of html else the JS will get embedded as part of mjml
    const generatedHeaders = generateTableHeaders(headerKeys);
    const generatedTableRows = generateTableRows(headerKeys, tableData);

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

    return mjmlParse;
};

export const createEmailTransporter = async (
    transportType: EmailTransportTypes
) => {
    // did want to just reutnr a simple object, but the ethereal UN/PW is async, so if statements it is
    if (transportType === "ethereal") {
        const testAccount = await nodemailer.createTestAccount(); // ethereal.email test account

        return nodemailer.createTransport({
            host: "smtp.ethereal.email",
            port: 587,
            secure: false,
            auth: {
                user: testAccount.user, // generated ethereal user
                pass: testAccount.pass, // generated ethereal password
            },
        });
    }

    if (transportType === "mailtrap") {
        return nodemailer.createTransport({
            host: "smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: MAILTRAP_USERNAME,
                pass: MAILTRAP_PASSWORD,
            },
        });
    }

    // TODO: set up sendgrid
    if (transportType === "sendgrid") {
        return Promise.reject("Sendgrid is not yet available");
    }

    return Promise.reject("Please enter a transport type");
};
