import { testData } from "./data/testData";
import AadGraphFunctions from "./services/microsoft/aad-graph.functions";
import { AadGraphService } from "./services/microsoft/aad-graph.service";
import { MicrosoftServiceBaseInterface } from "./services/microsoft/microsoft-service-base";
import MsGraphFunctions from "./services/microsoft/ms-graph.functions";
import { MsGraphService } from "./services/microsoft/ms-graph.service";
import { ClientConnection } from "./types/microsoft-service.types";

import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";
import Config from "./config/config";

import inquirer, { QuestionCollection } from "inquirer";

console.log("heya!");

const main = async (): Promise<void> => {
    const data = testData;
    data.forEach(async (item) => {
        const { clientId, clientSecret, tenantId, serviceToUse } = item;

        const clientConnection: ClientConnection = {
            clientId,
            clientSecret,
            tenantId,
        };

        let service: MicrosoftServiceBaseInterface;
        if (serviceToUse === "MsGraph") {
            service = new MsGraphService();
            MsGraphFunctions.getSecretsForMsGraphApplicationsByAppId(
                service,
                clientConnection,
                clientId
            );
        } else {
            service = new AadGraphService();
            AadGraphFunctions.getSecretsForAadGraphApplicationsByAppId(
                service,
                clientConnection,
                clientId
            );
        }
    });
};

const mainFs = () => {
    const config = new Config("", "", "");
    // console.log(config.getRootDir());
    console.log(Config.rootDir);

    filesystemInterfaceInstance.writeDataToFilesystemAsync("", "");
};

// main();

// mainFs();

const inq = () => {
    const questions: QuestionCollection<any> = [
        {
            type: "list",
            name: "singleOrMultipleInput",
            message:
                "Do you want to check a single Azure App secret or multiple?",
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
            message:
                'Please input an array of objects to check [{tenantId: "", clientId: "", clientSecret: ""}] :',
            // TODO: add validate to ensure that the input array is correct (if not array, but object is valid, can we update the answers hash?)
            // validate: function (input) {

            // },
            // TODO: add transformer to strip out secrets
            when: function (answers) {
                return answers.multipleInputDataLocation === "cliArray";
            },
        },
    ];

    inquirer.prompt(questions).then((answers) => {
        console.log(JSON.stringify(answers, null, 4));
    });
};

inq();
