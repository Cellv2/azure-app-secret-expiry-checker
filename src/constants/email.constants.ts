import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";

export const TABLE_HEADER_KEYS: Array<
    keyof MicrosoftGraph.PasswordCredential
> = ["displayName", "keyId", "endDateTime"];
