import fetch from "node-fetch";
import AadGraphFunctions from "./services/microsoft/aad-graph.functions";
import MsGraphFunctions from "./services/microsoft/ms-graph.functions";
import { MsGraphService } from "./services/microsoft/ms-graph.service";


console.log("heya!");

export const useMsGraph: boolean = false;

const main = async (): Promise<void> => {
    const service = new MsGraphService();
    const connection = await service.connectToService();
    if (!connection) {
        // TODO: Add logging
        throw new Error("Service connection was null");
    }

    const accessToken = connection.accessToken;
    const bearer = `Bearer ${accessToken}`;

    // TODO: add note about required permissions ()
    const url = useMsGraph
        ? MsGraphFunctions.getUsers()
        : AadGraphFunctions.getUsers();

    const result = await fetch(url, {
        headers: {
            Authorization: bearer,
        },
    });

    console.log(result);
};

main();
