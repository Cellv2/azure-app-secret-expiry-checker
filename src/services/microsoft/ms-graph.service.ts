import {
    ConfidentialClientApplication,
    Configuration,
    LogLevel as MsalLogLevel,
    NodeAuthOptions,
} from "@azure/msal-node";
import fetch from "node-fetch";
import { useMsGraph } from "../../index";
import { ClientConnection } from "../service.types";
import { MicrosoftServiceBaseInterface } from "./microsoft-service-base";

interface MsGraphServiceConstructor {
    new (): MsGraphServiceInterface;
}

interface MsGraphServiceInterface extends MicrosoftServiceBaseInterface {}

export const MsGraphService: MsGraphServiceConstructor = class MsGraphService
    implements MsGraphServiceInterface {
    //TODO: split these out into their separate classes / make abstract class

    // connectToService = async () => {
    connectToService = async (connection: ClientConnection) => {
        const { clientId, clientSecret, tenantId } = connection;

        const authConfig: NodeAuthOptions = {
            authority: `https://login.microsoftonline.com/${tenantId}`,
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

    request = async (connection: ClientConnection, requestUrl: string) => {
        const connectedService = await this.connectToService(connection);
        if (!connectedService) {
            // TODO: Add logging
            throw new Error("Service connection was null");
        }

        const bearerToken = `Bearer ${connectedService.accessToken}`;

        const result = await fetch(requestUrl, {
            headers: {
                Authorization: bearerToken,
            },
        });

        if (!result.ok) {
            console.warn(
                `Connection issue for clientId ${connection.clientId}`
            );
            return;
        }

        return result;
    };
};
