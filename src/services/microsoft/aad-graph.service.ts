interface AadGraphServiceConstructor {
    new (): AadGraphServiceInterface;
}

interface AadGraphServiceInterface {}

export const AadGraphService: AadGraphServiceConstructor = class AadGraphService
    implements AadGraphServiceInterface {};
