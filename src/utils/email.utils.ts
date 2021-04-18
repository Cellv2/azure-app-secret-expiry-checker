import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import mjml2html from "mjml";
import { TABLE_HEADER_KEYS } from "../constants/email.constants";
import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";

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
    console.log(generatedTableRows)

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
