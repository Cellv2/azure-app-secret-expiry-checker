export type AvailableMicrosoftServices = "MsGraph" | "AadGraph";

export type ClientConnection = {
    tenantId: string;
    clientId: string; // the application ID, *not* the directory object ID
    clientSecret: string;
};
