import {
    ConfidentialClientApplication,
    Configuration,
    LogLevel as MsalLogLevel,
    NodeAuthOptions,
} from "@azure/msal-node";
import fetch, { Response } from "node-fetch";
import { ClientConnection } from "../service.types";

export interface MicrosoftServiceBaseInterface {
    request(
        connection: ClientConnection,
        requestUrl: string
    ): Promise<Response | undefined>;
}

export abstract class MicrosoftServiceBase {
    abstract scopes: string[];

    private connectToService = async (connection: ClientConnection) => {
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
                        console.log(`${clientId}|${message}`);
                    },
                    piiLoggingEnabled: false,
                    logLevel: MsalLogLevel.Verbose,
                },
            },
        };
        const cca: ConfidentialClientApplication = new ConfidentialClientApplication(
            config
        );

        const authResult = await cca.acquireTokenByClientCredential({
            scopes: this.scopes,
        });
        // console.log(authResult);
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
}
