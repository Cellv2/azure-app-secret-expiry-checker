import fs from "fs";
import { areAllDataKeysValid } from "./data.utils";

export const ensureDirExistsForWritesAsync = async (dirPathToTest: string) => {
    try {
        await fs.promises.access(dirPathToTest);
        console.log("The provided path exists");
        console.log(`Creating output at ${dirPathToTest}`);
    } catch (err) {
        console.warn(`Path provided does not exist!`);
        console.warn(`Creating directory at ${dirPathToTest}`);
        fs.mkdir(dirPathToTest, { recursive: true }, (err, path) => {
            if (!err) {
                console.log(`Directory successfully created at ${path}`);
            } else {
                console.error("Unable to create directory - exiting...");
                throw err;
            }
        });
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
