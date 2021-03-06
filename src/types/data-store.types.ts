import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { AvailableMicrosoftServices } from "./microsoft-service.types";

// keeping this as chances are I'll add the application itself to the store at some point
type RetrievedEndpointData = {
    endpointUsed: AvailableMicrosoftServices;
    data: MicrosoftGraph.Application[] | AzureAdGraphModels.Application[];
};

export type RetrievedSecretData = {
    endpointUsed: AvailableMicrosoftServices;
    data:
        | MicrosoftGraph.PasswordCredential[]
        | AzureAdGraphModels.PasswordCredential[];
};
