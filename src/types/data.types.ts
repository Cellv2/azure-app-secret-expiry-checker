import { AvailableMicrosoftServices } from "./microsoft-service.types";
import { KeysEnum } from "./utilities.types";

export type Data = {
    tenantId: string;
    clientId: string;
    clientSecret: string;
    serviceToUse: AvailableMicrosoftServices;
};

export const requiredDataKeys: KeysEnum<Data> = {
    tenantId: true,
    clientId: true,
    clientSecret: true,
    serviceToUse: true,
} as const;
