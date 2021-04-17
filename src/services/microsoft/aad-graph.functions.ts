import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import { ClientConnection } from "../../types/microsoft-service.types";
import AadGraphApis from "./aad-graph.apis";
import { AadGraphServiceInterface } from "./aad-graph.service";

namespace AadGraphFunctions {
    /**
     * The Graph services use lookups based on the directory object ID, not the actual application ID
     * @param {AadGraphServiceInterface} service The instantiated service which will make the request
     * @param {ClientConnection} connection The connection string to connect to Azure with via the service
     * @param {string} applicationId The application ID to search
     */
    export const getSecretsForAadGraphApplicationsByAppId = async (
        service: AadGraphServiceInterface,
        connection: ClientConnection,
        applicationId: string
    ): Promise<AzureAdGraphModels.PasswordCredential[]> => {
        try {
            const response = await service.request(
                connection,
                AadGraphApis.getAllApplications()
            );
            if (!response) {
                throw new Error(
                    "A fatal error occurred while querying AAD Graph"
                );
            }
            if (!response.ok) {
                console.error("Response was not a 200");
                return Promise.reject("Response was not a 200");
            }

            const responseJson = await response.json();
            if (!responseJson.value) {
                console.error(
                    "There was no value property on the response. This probably shouldn't happen"
                );
                return Promise.reject(
                    "There was no value property on the response. This probably shouldn't happen"
                );
            }

            const allApplications = responseJson.value as AzureAdGraphModels.Application[];
            const targetApplication = allApplications.find(
                (app) => app.appId === applicationId
            );
            if (!targetApplication) {
                console.warn(
                    `Client ID "${connection.clientId}" in tenant "${connection.tenantId}" was not found`
                );
                return Promise.reject(
                    `Client ID "${connection.clientId}" in tenant "${connection.tenantId}" was not found`
                );
            }

            const secrets = targetApplication.passwordCredentials;
            console.log(secrets);
            if (secrets === undefined) {
                return Promise.reject(
                    `PasswordCredentials returned as undefined - the secrets may not be correct for ${connection.clientId}. `
                );
            }

            return secrets;
        } catch (err) {
            //TODO: make this better
            throw err;
        }
    };
}
export default AadGraphFunctions;
