import { Answers } from "inquirer";
import { Data } from "./data.types";

export interface CliAnswers extends Answers {
    singleOrMultipleInput: QuestionInputTypes;
    singleInputConfigTenantId: Data["tenantId"];
    singleInputConfigClientId: Data["clientId"];
    singleInputConfigClientSecret: Data["clientSecret"];
    singleInputConfigServiceToUse: Data["serviceToUse"];
    multipleInputDataLocation: QuestionDataLocations;
}
export type QuestionDataLocations = "localFile" | "cliArray" | "ftp";
export type QuestionInputTypes = "single" | "multiple";
