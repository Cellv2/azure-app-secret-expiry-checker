import { AvailableMicrosoftServices } from "./microsoft-service.types";

export type Data = {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    serviceToUse: AvailableMicrosoftServices;
};
