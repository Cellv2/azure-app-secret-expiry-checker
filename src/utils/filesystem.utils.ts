import fs from "fs";
import { areAllDataKeysValid } from "./data.utils";

// TODO: should this be split out into different functions / the functionality separated cleanly? it just force creates the dir
// TODO: e.g. checkDirExists with a 'should create' param
export const ensureDirExistsForWritesAsync = async (dirPathToTest: string) => {
    try {
        await fs.promises.access(dirPathToTest);
        console.log("The provided path exists");
        console.log(`Creating output at ${dirPathToTest}`);
    } catch (err) {
        console.log(`Path provided does not exist!`);
        console.log(`Creating directory at ${dirPathToTest}`);

        try {
            await fs.promises.mkdir(dirPathToTest);
            console.log(`Directory successfully created at ${dirPathToTest}`);
        } catch (err) {
            console.error("Unable to create directory - exiting...");
            throw err;
        }
    }
};

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
        await fs.promises.mkdir(dirPathToCreate);
    } catch (err) {
        throw new Error(`Unable to create directory at ${dirPathToCreate}`);
    }
};

export const checkFileExistsForRead = (pathToCheck: string): boolean => {
    try {
        fs.accessSync(pathToCheck);
    } catch (err) {
        return false;
    }

    return true;
};

export const checkFileHasValidData = (pathToCheck: string): boolean => {
    try {
        const file = fs.readFileSync(pathToCheck, "utf-8");

        try {
            JSON.parse(file);
        } catch (err) {
            console.error(
                "Please ensure that the input is *valid* JSON (e.g. all keys are quoted)"
            );
            return false;
        }

        const inputAsJson = JSON.parse(file);

        if (!Array.isArray(inputAsJson)) {
            console.error("Please ensure the file contains an array of data");
            return false;
        }

        if (!areAllDataKeysValid(inputAsJson)) {
            // TODO: add feedback on which keys aren't valid
            console.error(`Keys do not match`);
            return false;
        }

        return true;
    } catch (err) {
        console.error(
            `Something went wrong when reading file at ${pathToCheck}`
        );
        return false;
    }
};
