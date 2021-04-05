import { requiredDataKeys } from "../types/data.types";

const validKeysSorted = Object.keys(requiredDataKeys).sort();

// TODO: type guard this ?
export const areAllDataKeysValid = (inputAsJson: any[]): boolean =>
    inputAsJson.every((item: any[]) => {
        const itemKeysSorted = Object.keys(item).sort();

        if (
            JSON.stringify(validKeysSorted) !== JSON.stringify(itemKeysSorted)
        ) {
            return false;
        }

        const doesObjContainNonStringValue = Object.values(item).some(
            (val) => typeof val !== "string"
        );
        if (doesObjContainNonStringValue) {
            return false;
        }

        return true;
    });
