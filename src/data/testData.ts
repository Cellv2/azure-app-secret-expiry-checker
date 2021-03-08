import {
    CLIENT_ID_DEV_2,
    CLIENT_SECRET_DEV_2,
    TENANT_ID_DEV,
} from "../config/secrets";

import { AvailableMicrosoftServices } from "../types/microsoft-service.types";

type Data = {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    serviceToUse: AvailableMicrosoftServices;
};

export const testData: Data[] = [
    {
        tenantId: TENANT_ID_DEV!,
        clientId: CLIENT_ID_DEV_2!,
        clientSecret: CLIENT_SECRET_DEV_2!,
        serviceToUse: "MsGraph",
    },
    {
        tenantId: TENANT_ID_DEV!,
        clientId: CLIENT_ID_DEV_2!,
        clientSecret: CLIENT_SECRET_DEV_2!,
        serviceToUse: "AadGraph",
    },
];
