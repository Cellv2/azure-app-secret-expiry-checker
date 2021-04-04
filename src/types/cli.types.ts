import { Answers } from "inquirer";
import { Data } from "./data.types";

export interface CliAnswers extends Answers {
    singleOrMultipleInput: QuestionInputTypes;
    singleInputConfigTenantId: Data["tenantId"];
    singleInputConfigClientId: Data["clientId"];
    singleInputConfigClientSecret: Data["clientSecret"];
    singleInputConfigServiceToUse: Data["serviceToUse"];
    multipleInputDataLocation: QuestionDataLocations;
    multipleInputCliArray: Data[];
    multipleInputLocalFileLocation: string; // note this is the *path*, not the data set in the file itself
}
export type QuestionDataLocations = "localFile" | "cliArray" | "ftp";
export type QuestionInputTypes = "single" | "multiple";
