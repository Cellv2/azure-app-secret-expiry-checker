import {
    MicrosoftServiceBase,
    MicrosoftServiceBaseInterface,
} from "./microsoft-service-base";

interface MsGraphServiceConstructor {
    new (): MsGraphServiceInterface;
}

export interface MsGraphServiceInterface extends MicrosoftServiceBaseInterface {}

export const MsGraphService: MsGraphServiceConstructor = class MsGraphService
    extends MicrosoftServiceBase
    implements MsGraphServiceInterface {
    scopes = ["https://graph.microsoft.com/.default"];
};
