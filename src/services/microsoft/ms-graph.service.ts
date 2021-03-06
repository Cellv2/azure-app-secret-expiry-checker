import {
    AuthenticationResult,
    ConfidentialClientApplication,
    Configuration,
    NodeAuthOptions,
    LogLevel as MsalLogLevel,
} from "@azure/msal-node";
import {
    CLIENT_ID_DEV,
    CLIENT_SECRET_DEV,
    TENANT_ID_DEV,
    CLIENT_ID_DEV_2,
    CLIENT_SECRET_DEV_2,
} from "../../secrets";
import { MicrosoftServiceBaseInterface } from "./microsoft-service-base";

import { useMsGraph } from "../../index";

interface MsGraphServiceConstructor {
    new (): MsGraphServiceInterface;
}

interface MsGraphServiceInterface extends MicrosoftServiceBaseInterface {}

export const MsGraphService: MsGraphServiceConstructor = class MsGraphService
    implements MsGraphServiceInterface {
    //TODO: split these out into their separate classes / make abstract class

    connectToService = async () => {
        const clientId = CLIENT_ID_DEV_2!;
        const clientSecret = CLIENT_SECRET_DEV_2!;

        const authConfig: NodeAuthOptions = {
            authority: `https://login.microsoftonline.com/${TENANT_ID_DEV}`,
            clientId,
            clientSecret,
        };

        const config: Configuration = {
            auth: authConfig,
            system: {
                loggerOptions: {
                    loggerCallback(loglevel, message, containsPii) {
                        console.log(
                            `${MsalLogLevel[loglevel]}|${clientId}|${message}`
                        );
                    },
                    piiLoggingEnabled: false,
                    logLevel: MsalLogLevel.Verbose,
                },
            },
        };
        const cca: ConfidentialClientApplication = new ConfidentialClientApplication(
            config
        );

        let _scopes: string[];
        if (useMsGraph) {
            _scopes = ["https://graph.microsoft.com/.default"];
        } else {
            _scopes = ["https://graph.windows.net/.default"];
        }
        const authResult = await cca.acquireTokenByClientCredential({
            scopes: _scopes,
        });
        // console.log(authResult);
        console.log(new Date().toISOString());
        return authResult;
    };
};
