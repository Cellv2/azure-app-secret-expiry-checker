import {
    ConfidentialClientApplication,
    Configuration,
    NodeAuthOptions,
} from "@azure/msal-node";
import { CLIENT_ID_DEV, CLIENT_SECRET_DEV, TENANT_ID_DEV } from "../../secrets";

interface MsGraphServiceConstructor {
    new (): MsGraphServiceInterface;
}

interface MsGraphServiceInterface {}

export const MsGraphService: MsGraphServiceConstructor = class MsGraphService
    implements MsGraphServiceInterface {};

export const connectToService = async () => {
    const authConfig: NodeAuthOptions = {
        authority: `https://login.microsoftonline.com/${TENANT_ID_DEV}`,
        clientId: `${CLIENT_ID_DEV}`,
        clientSecret: `${CLIENT_SECRET_DEV}`,
    };

    const config: Configuration = {
        auth: authConfig,
    };
    const cca: ConfidentialClientApplication = new ConfidentialClientApplication(
        config
    );

    const authResult = await cca.acquireTokenByClientCredential({
        scopes: ["https://graph.microsoft.com/.default"],
    });
    console.log(authResult);
};
