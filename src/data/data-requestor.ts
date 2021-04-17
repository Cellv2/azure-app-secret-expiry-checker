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
    requestSecretsForAllApps: (data: Data[]) => Promise<RetrievedSecretData[]>;
}

const DataRequestor: DataRequestorConstructor = class DataRequestor
    implements DataRequestorInterface {
    private msGraphServiceInstance = new MsGraphService();
    private aadGraphServiceInstance = new AadGraphService();

    requestSecretsForAllApps = async (
        data: Data[]
    ): Promise<RetrievedSecretData[]> => {
        let retrievedSecrets: RetrievedSecretData[] = [];

        await Promise.all(
            data.map(async (item) => {
                const { clientId, clientSecret, tenantId, serviceToUse } = item;

                const clientConnection: ClientConnection = {
                    clientId,
                    clientSecret,
                    tenantId,
                };

                // TODO: could probably make this more DRY
                // TODO: think I'd need to type the underlying namespace functions and use that as a ref to which function is used
                // TODO: then I could just pass in the args as the function signature is the same for both
                if (serviceToUse === "MsGraph") {
                    try {
                        const secret = await MsGraphFunctions.getSecretsForMsGraphApplicationsByAppId(
                            this.msGraphServiceInstance,
                            clientConnection,
                            clientId
                        );

                        retrievedSecrets.push({
                            endpointUsed: serviceToUse,
                            data: secret,
                        });
                    } catch (err) {
                        console.error(err);
                        return Promise.reject(
                            `Secrets not successfully retrieved from client ID ${clientId}`
                        );
                    }
                }

                if (serviceToUse === "AadGraph") {
                    try {
                        const secret = await AadGraphFunctions.getSecretsForAadGraphApplicationsByAppId(
                            this.aadGraphServiceInstance,
                            clientConnection,
                            clientId
                        );

                        retrievedSecrets.push({
                            endpointUsed: serviceToUse,
                            data: secret,
                        });
                    } catch (err) {
                        console.error(err);
                        return Promise.reject(
                            `Secrets not successfully retrieved from client ID ${clientId}`
                        );
                    }
                }
            })
        );

        return retrievedSecrets;
    };
};

const dataRequestorInstance = new DataRequestor();

export default dataRequestorInstance;
