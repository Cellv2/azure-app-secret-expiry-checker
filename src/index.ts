import { testData } from "./data/testData";
import AadGraphFunctions from "./services/microsoft/aad-graph.functions";
import { AadGraphService } from "./services/microsoft/aad-graph.service";
import { MicrosoftServiceBaseInterface } from "./services/microsoft/microsoft-service-base";
import MsGraphFunctions from "./services/microsoft/ms-graph.functions";
import { MsGraphService } from "./services/microsoft/ms-graph.service";
import { ClientConnection } from "./services/service.types";

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
        let apiToCall: string;
        if (serviceToUse === "MsGraph") {
            service = new MsGraphService();
            // apiToCall = MsGraphFunctions.getUsers();
            // apiToCall = MsGraphFunctions.getAllApplications();
            MsGraphFunctions.getSecretsForMsGraphApplicationsByAppId(
                service,
                clientConnection,
                clientId
            );
        } else {
            service = new AadGraphService();
            // apiToCall = AadGraphFunctions.getUsers();
            // apiToCall = AadGraphFunctions.getAllApplications();
            AadGraphFunctions.getSecretsForAadGraphApplicationsByAppId(
                service,
                clientConnection,
                clientId
            );
        }
    });
};

main();
