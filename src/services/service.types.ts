export type AvailableMicrosoftServices = "MsGraph" | "AadGraph";

export type ClientConnection = {
    tenantId: string;
    clientId: string;
    clientSecret: string;
};
