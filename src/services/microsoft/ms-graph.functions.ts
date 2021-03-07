import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { ClientConnection } from "../service.types";
import MsGraphApis from "./ms-graph.apis";
import { MsGraphServiceInterface } from "./ms-graph.service";

namespace MsGraphFunctions {
    /**
     * The Graph services use lookups based on the directory object ID, not the actual application ID
     * @param {MicrosoftServiceBaseInterface} service The instantiated service which will make the request
     * @param {ClientConnection} connection The connection string to connect to Azure with via the service
     * @param {string} applicationId The application ID to search
     */
    export const getSecretsForMsGraphApplicationsByAppId = async (
        service: MsGraphServiceInterface,
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
        return secrets;
    };
}
export default MsGraphFunctions;
