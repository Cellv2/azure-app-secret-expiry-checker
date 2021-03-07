import {
    MicrosoftServiceBase,
    MicrosoftServiceBaseInterface,
} from "./microsoft-service-base";

interface AadGraphServiceConstructor {
    new (): AadGraphServiceInterface;
}

export interface AadGraphServiceInterface extends MicrosoftServiceBaseInterface {}

export const AadGraphService: AadGraphServiceConstructor = class AadGraphService
    extends MicrosoftServiceBase
    implements AadGraphServiceInterface {
    scopes = ["https://graph.windows.net/.default"];
};
