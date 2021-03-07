import { AuthenticationResult } from "@azure/msal-node";
import { Response } from "node-fetch";

import { ClientConnection } from "../service.types";

export interface MicrosoftServiceBaseInterface {
    connectToService(
        connection: ClientConnection
    ): Promise<AuthenticationResult | null>;
    request(
        connection: ClientConnection,
        requestUrl: string
    ): Promise<Response | undefined>;
}

//TODO: should check whether we can make the coupled classes extend from the abstract base
// export abstract class MicrosoftServiceBase {
//     abstract connectToService(): Promise<void>;
// }
