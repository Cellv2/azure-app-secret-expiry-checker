import { testData } from "./data/testData";
import AadGraphFunctions from "./services/microsoft/aad-graph.functions";
import { AadGraphService } from "./services/microsoft/aad-graph.service";
import { MicrosoftServiceBaseInterface } from "./services/microsoft/microsoft-service-base";
import MsGraphFunctions from "./services/microsoft/ms-graph.functions";
import { MsGraphService } from "./services/microsoft/ms-graph.service";
import { ClientConnection } from "./services/service.types";

console.log("heya!");

export const useMsGraph: boolean = false;

const main = async (): Promise<void> => {
    const data = testData;
    data.forEach(async (item) => {
        const { clientId, clientSecret, tenantId, serviceToUse } = item;

        let service: MicrosoftServiceBaseInterface;
        let apiToCall: string;
        if (serviceToUse === "MsGraph") {
            service = new MsGraphService();
            apiToCall = MsGraphFunctions.getUsers();
        } else {
            service = new AadGraphService();
            apiToCall = AadGraphFunctions.getUsers();
        }

        const clientConnection: ClientConnection = {
            clientId,
            clientSecret,
            tenantId,
        };
        const response = await service.request(clientConnection, apiToCall);

        console.log(response);
        console.log(new Date().toISOString());
    });
};

main();
