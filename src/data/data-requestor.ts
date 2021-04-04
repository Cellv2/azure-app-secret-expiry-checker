import AadGraphFunctions from "../services/microsoft/aad-graph.functions";
import { AadGraphService } from "../services/microsoft/aad-graph.service";
import MsGraphFunctions from "../services/microsoft/ms-graph.functions";
import { MsGraphService } from "../services/microsoft/ms-graph.service";
import { RetrievedSecretData } from "../types/data-store.types";
import { Data } from "../types/data.types";
import { ClientConnection } from "../types/microsoft-service.types";

interface DataRequestorConstructor {
    new (): DataRequestorInterface;
}

interface DataRequestorInterface {
    requestSecretsForAll: (data: Data[]) => RetrievedSecretData[];
}

const DataRequestor: DataRequestorConstructor = class DataRequestor
    implements DataRequestorInterface {
    private msGraphServiceInstance = new MsGraphService();
    private aadGraphServiceInstance = new AadGraphService();

    requestSecretsForAll = (data: Data[]): RetrievedSecretData[] => {
        let retrievedSecrets: RetrievedSecretData[] = [];

        data.forEach(async (item) => {
            const { clientId, clientSecret, tenantId, serviceToUse } = item;

            const clientConnection: ClientConnection = {
                clientId,
                clientSecret,
                tenantId,
            };

            let secretFromService: RetrievedSecretData["data"];
            if (serviceToUse === "MsGraph") {
                secretFromService = await MsGraphFunctions.getSecretsForMsGraphApplicationsByAppId(
                    this.msGraphServiceInstance,
                    clientConnection,
                    clientId
                );
            }
            if (serviceToUse === "AadGraph") {
                secretFromService = await AadGraphFunctions.getSecretsForAadGraphApplicationsByAppId(
                    this.aadGraphServiceInstance,
                    clientConnection,
                    clientId
                );
            }

            if (!secretFromService) {
                console.warn(
                    `Secrets not successfully retrieved from client ID ${clientId}`
                );
            }

            retrievedSecrets.push({
                endpointUsed: serviceToUse,
                data: secretFromService,
            });
        });

        return retrievedSecrets;
    };
};

const dataRequestorInstance = new DataRequestor();

export default dataRequestorInstance;
