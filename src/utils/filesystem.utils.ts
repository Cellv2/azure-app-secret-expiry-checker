import fs from "fs";
import { areAllDataKeysValid } from "./data.utils";

export const doesDirExistsForWritesAsync = async (
    dirPathToTest: string
): Promise<boolean> => {
    try {
        await fs.promises.access(dirPathToTest);
        return true;
    } catch (err) {
        return false;
    }
};

/**
 * Creates a directory if it does not already exist
 * @param {string} dirPathToCreate The full path to create
 */
export const createDirIfNotExistsAsync = async (
    dirPathToCreate: string
): Promise<void> => {
    if (await doesDirExistsForWritesAsync(dirPathToCreate)) {
        return;
    }

    try {
        await fs.promises.mkdir(dirPathToCreate, { recursive: true });
        await fs.promises.access(dirPathToCreate); // the dir should exist at this point, but just to be sure
    } catch (err) {
        throw new Error(`Unable to create directory at ${dirPathToCreate}`);
    }
};

export const checkFileExistsForRead = (pathToCheck: string): boolean => {
    try {
        fs.accessSync(pathToCheck, fs.constants.F_OK);
    } catch (err) {
        return false;
    }

    return true;
};

export const checkFileHasValidData = async (
    pathToCheck: string
): Promise<void> => {
    try {
        const file = await fs.promises.readFile(pathToCheck, "utf-8");

        try {
            JSON.parse(file);
        } catch (err) {
            return Promise.reject(
                new Error(
                    "Please ensure that the input is *valid* JSON (e.g. all keys are quoted)"
                )
            );
        }

        const inputAsJson = JSON.parse(file);

        if (!Array.isArray(inputAsJson)) {
            return Promise.reject(
                new Error("Please ensure the file contains an array of data")
            );
        }

        if (!areAllDataKeysValid(inputAsJson)) {
            // TODO: add feedback on which keys aren't valid
            return Promise.reject(new Error("Keys do not match"));
        }

        return Promise.resolve();
    } catch (err) {
        throw new Error(
            `Something went wrong when reading file at ${pathToCheck}`
        );
    }
};
