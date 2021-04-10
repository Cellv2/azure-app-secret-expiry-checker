import inquirer from "inquirer";
import dataRequestorInstance from "../data/data-requestor";
import DataStore, { DataStoreInterface } from "../data/data-store";
import filesystemInterfaceInstance from "../services/filesystem/filesystem-interface.service";
import { CliAnswers } from "../types/cli.types";
import { Data } from "../types/data.types";
import { cliQuestions } from "./questions";

// main entry point for all questions prompted for user input
export const askQuestions = (): void => {
    let store: DataStoreInterface;
    inquirer
        .prompt(cliQuestions)
        .then(async (answers: CliAnswers) => {
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

                // TODO: imeplement this
                if (answers.multipleInputDataLocation === "ftp") {
                    console.log("NYI");
                }

                if (answers.multipleInputDataLocation === "localFile") {
                    // data validity should have already been checked at the time of input
                    const fileData = await filesystemInterfaceInstance.readDataFromFIlesystemAsync(
                        answers.multipleInputLocalFileLocation
                    );

                    if (!fileData) {
                        console.error(
                            "The file returned no usable data - please ensure the file exists and is valid!"
                        );
                        return;
                    }

                    // TODO: might want to type guard this
                    store = new DataStore(JSON.parse(fileData));
                }
            }
        })
        .then(async () => {
            const allSecrets = await dataRequestorInstance.requestSecretsForAllApps(
                store.getDataObjectsToCheck()
            );

            console.log("---------------------");
            console.log("secrets are added below");
            console.log("---------------------");
            store.bulkAddSecretsToStore(allSecrets);

            console.log(store.getRetrievedEndpointData());
        });
};