import fetch from "node-fetch";
import { MsGraphService } from "./services/microsoft/ms-graph.service";

import { TENANT_ID_DEV } from "./secrets";

console.log("heya!");

export const useMsGraph: boolean = false;

const main = async (): Promise<void> => {
    const service = new MsGraphService();
    const connection = await service.connectToService();
    if (!connection) {
        throw new Error("Service connection was null");
    }

    const accessToken = connection.accessToken;
    const bearer = `Bearer ${accessToken}`;

    // TODO: add note about required permissions ()
    const url = useMsGraph
        ? "https://graph.microsoft.com/v1.0/users"
        : `https://graph.windows.net/${TENANT_ID_DEV}/users?api-version=1.6`;

    const result = await fetch(url, {
        headers: {
            Authorization: bearer,
        },
    });

    console.log(result);
};

main();
