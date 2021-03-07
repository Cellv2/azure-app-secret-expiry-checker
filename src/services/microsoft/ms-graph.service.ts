import {
    ConfidentialClientApplication,
    Configuration,
    LogLevel as MsalLogLevel,
    NodeAuthOptions,
} from "@azure/msal-node";
import fetch from "node-fetch";
import { useMsGraph } from "../../index";
import { ClientConnection } from "../service.types";
import {
    MicrosoftServiceBase,
    MicrosoftServiceBaseInterface,
} from "./microsoft-service-base";

interface MsGraphServiceConstructor {
    new (): MsGraphServiceInterface;
}

interface MsGraphServiceInterface extends MicrosoftServiceBaseInterface {}

export const MsGraphService: MsGraphServiceConstructor = class MsGraphService
    extends MicrosoftServiceBase
    implements MsGraphServiceInterface {
    scopes = ["https://graph.microsoft.com/.default"];
};
