import fs from "fs";
import path from "path";
import Config from "../../config/config";
import {
    checkFileExistsForRead,
    createDirIfNotExistsAsync,
    doesDirExistsForWritesAsync
} from "../../utils/filesystem.utils";

interface FilesystemInterfaceConstructor {
    new (): FilesystemInterfaceInterface;
}

export interface FilesystemInterfaceInterface {
    /**
     * If resolves, it returns the contets of the file in utf-8 encoding
     * If rejects, returns a relevant error
     *
     * Checks:
     * - The file exists and the underlying process has access to it
     * - The size of the file is not 0 (i.e. it has some kind of data in it)
     * @param {string} inputFilePath The path to the file which should be read and returned
     * @returns A string with the contents of the file
     */
    readDataFromFilesystemAsync(inputFilePath: string): Promise<string>;
    writeDataToFilesystemAsync(
        outputDir: string,
        outputFileName: string
    ): Promise<void>;
}

/**
 * A default export with this class being instantiated is provided from this file, so instantiation should not be needed in most cases
 */
export const FilesystemInterface: FilesystemInterfaceConstructor = class FilesystemInterface
    implements FilesystemInterfaceInterface {
    readDataFromFilesystemAsync = async (
        inputFilePath: string
    ): Promise<string> => {
        if (!checkFileExistsForRead(inputFilePath)) {
            return Promise.reject(
                new Error(
                    `File cannot be read at ${inputFilePath} - does the file exist?`
                )
            );
        }

        try {
            const fileContents = await fs.promises.readFile(
                inputFilePath,
                "utf-8"
            );

            if (!fileContents.length) {
                return Promise.reject(
                    new Error(`The file at ${inputFilePath} was empty`)
                );
            }

            return fileContents;
        } catch (err) {
            return Promise.reject(
                new Error(
                    `There was an issue reading the file at ${inputFilePath}`
                )
            );
        }
    };

    // TODO: add a check whether the file exists - if yes confirm that we can overwrite it (writefile just blitzes the current file)
    // ^ fsPromises.access(path)
    writeDataToFilesystemAsync = async (
        outputDir: string,
        outputFileName: string
    ) => {
        let targetDir: string;
        let targetFileName: string;
        if (typeof outputDir !== "string" || outputDir.length === 0) {
            console.warn(
                `An invalid directory was provided, falling back to ${Config.defaultOutputDir}`
            );
            targetDir = path.join(Config.rootDir, Config.defaultOutputDir);
        } else {
            targetDir = outputDir;
        }

        if (typeof outputFileName !== "string" || outputFileName.length === 0) {
            console.warn(
                `An invalid file name was provided, falling back to ${Config.defaultFileName}`
            );
            targetFileName = Config.defaultFileName;
        } else {
            targetFileName = outputFileName;
        }

        const doesDirExist = await doesDirExistsForWritesAsync(targetDir);
        if (!doesDirExist) {
            try {
                console.warn(
                    `Directory at ${targetDir} does not exist, creating...`
                );
                await createDirIfNotExistsAsync(targetDir);
                console.log(`${targetDir} created!`);
            } catch (err) {
                console.error(err);
            }
        }

        const outputFilePath: string = path.join(targetDir, targetFileName);
        fs.writeFile(outputFilePath, "KEKW", (err) => {
            if (err) {
                throw err;
            }

            console.log(`File saved at ${outputFilePath}`);
        });
    };
};

const filesystemInterfaceInstance = new FilesystemInterface();

export default filesystemInterfaceInstance;
