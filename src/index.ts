import inquirer from "inquirer";
import { cliQuestions } from "./cli/questions";
import Config from "./config/config";
import dataRequestorInstance from "./data/data-requestor";
import DataStore, { DataStoreInterface } from "./data/data-store";
import { testData } from "./data/testData";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";
import AadGraphFunctions from "./services/microsoft/aad-graph.functions";
import { AadGraphService } from "./services/microsoft/aad-graph.service";
import { MicrosoftServiceBaseInterface } from "./services/microsoft/microsoft-service-base";
import MsGraphFunctions from "./services/microsoft/ms-graph.functions";
import { MsGraphService } from "./services/microsoft/ms-graph.service";
import { CliAnswers } from "./types/cli.types";
import { Data } from "./types/data.types";
import { ClientConnection } from "./types/microsoft-service.types";

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
    let store: DataStoreInterface;
    inquirer
        .prompt(cliQuestions)
        .then((answers: CliAnswers) => {
            console.log(JSON.stringify(answers, null, 4));
            if (answers.singleOrMultipleInput === "single") {
                const dataObj: Data = {
                    clientId: answers.singleInputConfigClientId,
                    clientSecret: answers.singleInputConfigClientSecret,
                    serviceToUse: answers.singleInputConfigServiceToUse,
                    tenantId: answers.singleInputConfigTenantId,
                };

                store = new DataStore(dataObj);
            }

            if (answers.singleOrMultipleInput === "multiple") {
                if (answers.multipleInputDataLocation === "cliArray") {
                    store = new DataStore(answers.multipleInputCliArray);
                }
            }

            // TODO: imeplement this
            if (answers.multipleInputDataLocation === "ftp") {
                console.log("NYI");
            }

            // TODO: imeplement this
            if (answers.multipleInputDataLocation === "localFile") {
                console.log("NYI");
            }
        })
        .then(() => {
            dataRequestorInstance.requestSecretsForAllApps(
                store.getDataObjectsToCheck()
            );
        });
};

inq();
