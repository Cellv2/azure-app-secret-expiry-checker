import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";

// AAD types have `[property: string]: any` in there, so we pick only the types we're interested in
type SelectedAadKeys = Pick<
    AzureAdGraphModels.PasswordCredential,
    "startDate" | "endDate"
>;

export const TABLE_HEADER_KEYS: Array<
    keyof MicrosoftGraph.PasswordCredential | keyof SelectedAadKeys
> = ["displayName", "keyId", "endDateTime"];
