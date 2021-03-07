import { CLIENT_ID_DEV_2, CLIENT_SECRET_DEV_2, TENANT_ID_DEV } from "./secrets";
import MsGraphFunctions from "./services/microsoft/ms-graph.functions";
import { MsGraphService } from "./services/microsoft/ms-graph.service";
import { ClientConnection } from "./services/service.types";

console.log("heya!");

export const useMsGraph: boolean = true;

const main = async (): Promise<void> => {
    if (!CLIENT_ID_DEV_2 || !CLIENT_SECRET_DEV_2 || !TENANT_ID_DEV) {
        throw new Error(
            "Please check that the required entries are in the .env file"
        );
    }

    const service = new MsGraphService();
    const clientConnection: ClientConnection = {
        clientId: CLIENT_ID_DEV_2,
        clientSecret: CLIENT_SECRET_DEV_2,
        tenantId: TENANT_ID_DEV,
    };
    const response = await service.request(
        clientConnection,
        MsGraphFunctions.getUsers()
    );

    console.log(response);
};

main();
