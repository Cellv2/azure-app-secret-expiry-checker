import inquirer from "inquirer";
import dataRequestorInstance from "../data/data-requestor";
import dataStoreInstance from "../data/data-store";
import filesystemInterfaceInstance from "../services/filesystem/filesystem-interface.service";
import { CliAnswers } from "../types/cli.types";
import { Data } from "../types/data.types";
import { cliQuestions } from "./questions";

// main entry point for all questions prompted for user input
export const askQuestions = async (): Promise<void> => {
    // let store: DataStoreInterface;
    await inquirer
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

                dataStoreInstance.setDataObjectsToCheck(dataObj);
            }

            if (answers.singleOrMultipleInput === "multiple") {
                if (answers.multipleInputDataLocation === "cliArray") {
                    dataStoreInstance.setDataObjectsToCheck(
                        answers.multipleInputCliArray
                    );
                }

                // TODO: imeplement this
                if (answers.multipleInputDataLocation === "ftp") {
                    console.log("NYI");
                }

                if (answers.multipleInputDataLocation === "localFile") {
                    try {
                        const fileData = await filesystemInterfaceInstance.readDataFromFilesystemAsync(
                            answers.multipleInputLocalFileLocation
                        );

                        dataStoreInstance.setDataObjectsToCheck(
                            JSON.parse(fileData)
                        );
                    } catch (err) {
                        console.error(err);
                        return;
                    }
                }
            }
        })
        .then(async () => {
            const storeData = dataStoreInstance.getDataObjectsToCheck();

            if (storeData) {
                const allSecrets = await dataRequestorInstance.requestSecretsForAllApps(
                    storeData
                );

                console.log("---------------------");
                console.log("secrets are added below");
                console.log("---------------------");
                dataStoreInstance.bulkAddSecretsToStore(allSecrets);

                console.log(dataStoreInstance.getRetrievedEndpointData());
            } else {
                console.error("no store data!");
            }
        });
};
