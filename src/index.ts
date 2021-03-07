import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { testData } from "./data/testData";
import AadGraphApis from "./services/microsoft/aad-graph.apis";
import { AadGraphService } from "./services/microsoft/aad-graph.service";
import { MicrosoftServiceBaseInterface } from "./services/microsoft/microsoft-service-base";
import MsGraphApis from "./services/microsoft/ms-graph.apis";
import { MsGraphService } from "./services/microsoft/ms-graph.service";
import { ClientConnection } from "./services/service.types";

console.log("heya!");

const getSecretsForAadGraphApplicationsByAppId = async (
    service: MicrosoftServiceBaseInterface,
    connection: ClientConnection,
    applicationId: string
) => {
    const response = await service.request(
        connection,
        AadGraphApis.getAllApplications()
    );
    if (!response) {
        throw new Error("A fatal error occurred while querying AAD Graph");
    }

    if (!response.ok) {
        console.error("Response was not a 200");
        return;
    }

    const responseJson = await response.json();
    if (!responseJson.value) {
        console.error(
            "There was no value property on the response. This probably shouldn't happen"
        );
        return;
    }

    const allApplications = responseJson.value as AzureAdGraphModels.Application[];
    const targetApplication = allApplications.find(
        (app) => app.appId === applicationId
    );
    if (!targetApplication) {
        console.warn(
            `Client ID "${connection.clientId}" in tenant "${connection.tenantId}" was not found`
        );
        return;
    }

    const secrets = targetApplication.passwordCredentials;
    console.log(secrets);
};

/**
 * The Graph services use lookups based on the directory object ID, not the actual application ID
 * @param {MicrosoftServiceBaseInterface} service The instantiated service which will make the request
 * @param {ClientConnection} connection The connection string to connect to Azure with via the service
 * @param {string} applicationId The application ID to search
 */
const getSecretsForMsGraphApplicationsByAppId = async (
    service: MicrosoftServiceBaseInterface,
    connection: ClientConnection,
    applicationId: string
) => {
    const response = await service.request(
        connection,
        MsGraphApis.getAllApplications()
    );
    if (!response) {
        throw new Error("A fatal error occurred while querying MS Graph");
    }

    if (!response.ok) {
        console.error("Response was not a 200");
        return;
    }

    const responseJson = await response.json();
    if (!responseJson.value) {
        console.error(
            "There was no value property on the response. This probably shouldn't happen"
        );
        return;
    }

    const allApplications = responseJson.value as MicrosoftGraph.Application[];
    const targetApplication = allApplications.find(
        (app) => app.appId === applicationId
    );
    if (!targetApplication) {
        console.warn(
            `Client ID "${connection.clientId}" in tenant "${connection.tenantId}" was not found`
        );
        return;
    }

    const secrets = targetApplication.passwordCredentials;
    console.log(secrets);
};

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
        let apiToCall: string;
        if (serviceToUse === "MsGraph") {
            service = new MsGraphService();
            // apiToCall = MsGraphFunctions.getUsers();
            // apiToCall = MsGraphFunctions.getAllApplications();
            getSecretsForMsGraphApplicationsByAppId(
                service,
                clientConnection,
                clientId
            );
        } else {
            service = new AadGraphService();
            // apiToCall = AadGraphFunctions.getUsers();
            // apiToCall = AadGraphFunctions.getAllApplications();
            getSecretsForAadGraphApplicationsByAppId(
                service,
                clientConnection,
                clientId
            );
        }

        // const response = await service.request(clientConnection, apiToCall);

        // console.log(response);
        console.log(new Date().toISOString());
        // console.log(await response?.json());
    });
};

main();
