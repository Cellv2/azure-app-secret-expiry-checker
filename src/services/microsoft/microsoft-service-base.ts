import { AuthenticationResult } from "@azure/msal-node";

export interface MicrosoftServiceBaseInterface {
    connectToService(): Promise<AuthenticationResult | null>;
}

//TODO: should check whether we can make the coupled classes extend from the abstract base
// export abstract class MicrosoftServiceBase {
//     abstract connectToService(): Promise<void>;
// }
