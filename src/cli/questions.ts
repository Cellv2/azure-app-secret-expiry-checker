import { QuestionCollection } from "inquirer";
import { requiredDataKeys } from "../types/data.types";

const validKeysSorted = Object.keys(requiredDataKeys).sort();

export const questions: QuestionCollection<any> = [
    {
        type: "list",
        name: "singleOrMultipleInput",
        message: "Do you want to check a single Azure App secret or multiple?",
        choices: ["single", "multiple"],
    },
    {
        type: "input",
        name: "singleInputConfigTenantId",
        message: "Input tenant ID:",
        when: function (answers) {
            return answers.singleOrMultipleInput === "single";
        },
    },
    {
        type: "input",
        name: "singleInputConfigClientId",
        message: "Input client ID:",
        when: function (answers) {
            return answers.singleOrMultipleInput === "single";
        },
    },
    {
        type: "password",
        name: "singleInputConfigClientSecret",
        message: "Input client secret:",
        when: function (answers) {
            return answers.singleOrMultipleInput === "single";
        },
    },
    {
        type: "list",
        name: "singleInputConfigServiceToUse",
        message: "Select which service type to use:",
        choices: [
            { name: "Microsoft Graph", value: "MsGraph" },
            { name: "Azure AD Graph", value: "AadGraph" },
        ],
        when: function (answers) {
            return answers.singleOrMultipleInput === "single";
        },
    },
    {
        type: "list",
        name: "multipleInputDataLocation",
        message:
            "How would you like to input the required information (tenant ID, client ID and client secrets)",
        choices: [
            { name: "Use a local file", value: "localFile" },
            { name: "Direct input as an array", value: "cliArray" },
            { name: "FTP (NYI)", value: "ftp", disabled: true },
        ],
        when: function (answers) {
            return answers.singleOrMultipleInput === "multiple";
        },
    },
    {
        type: "input",
        name: "multipleInputLocalFileLocation",
        message: "Please input a full local file path:",
        when: function (answers) {
            return answers.multipleInputDataLocation === "localFile";
        },
    },
    {
        type: "input",
        name: "multipleInputCliArray",
        message: [
            "Please input an array of valid JSON objects to check. The format should be as below, with 'serviceToUse' being either MsGraph or AadGraph:",
            `${JSON.stringify(
                [
                    {
                        tenantId: "",
                        clientId: "",
                        clientSecret: "",
                        serviceToUse: "MsGraph",
                    },
                ],
                null,
                4
            )}`,
            "",
        ].join("\n"),

        // TODO: add validate to ensure that the input array is correct (if not array, but object is valid, can we update the answers hash?)
        validate: function (input) {
            try {
                JSON.parse(input);
            } catch (err) {
                return "Please ensure that the input is *valid* JSON (e.g. all keys are quoted)";
            }

            const inputAsJson = JSON.parse(input);

            if (!Array.isArray(inputAsJson)) {
                return "Please ensure you enter an array";
            }

            const areAllKeysValid = inputAsJson.every((item) => {
                const itemKeysSorted = Object.keys(item).sort();
                if (
                    JSON.stringify(validKeysSorted) !==
                    JSON.stringify(itemKeysSorted)
                ) {
                    return false;
                } else {
                    return true;
                }
            });

            if (!areAllKeysValid) {
                // TODO: add feedback on which keys aren't valid
                return `Keys do not match`;
            }

            // temp test data
            // [{"tenantId": "", "clientId": "", "clientSecret": "", "serviceToUse": "MsGraph"}]
            // [{"tenantId": "", "clientId": "", "clientSecret": "", "serviceToUse": "MsGraph", "qwe": "123"}]

            return true;
        },
        // TODO: add transformer to strip out secrets
        when: function (answers) {
            return answers.multipleInputDataLocation === "cliArray";
        },
    },
];
