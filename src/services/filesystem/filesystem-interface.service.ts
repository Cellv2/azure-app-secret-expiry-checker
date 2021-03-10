import fs from "fs";
import path from "path";
import Config from "../../config/config";

interface FilesystemInterfaceConstructor {
    new (): FilesystemInterfaceInterface;
}

interface FilesystemInterfaceInterface {
    readDataFromFIlesystemAsync(inputFilePath: string): Promise<void>;
    writeDataToFilesystemAsync(
        outputDir: string,
        outputFileName: string
    ): Promise<void>;
}

const FilesystemInterface: FilesystemInterfaceConstructor = class FilesystemInterface
    implements FilesystemInterfaceInterface {
    readDataFromFIlesystemAsync = async (inputFilePath: string) => {};

    // TODO: add a check whether the file exists - if yes confirm that we can overwrite it (writefile just blitzes the current file)
    // ^ fsPromises.access(path)
    writeDataToFilesystemAsync = async (
        outputDir: string,
        outputFileName: string
    ) => {
        let outputFilePath: string;
        if (typeof outputDir !== "string" || outputDir.length === 0) {
            console.warn(
                `An invalid directory was provided, falling back to ${Config.defaultOutputDir}`
            );
            outputFilePath = path.join(Config.rootDir, Config.defaultOutputDir);
        } else {
            outputFilePath = outputDir;
        }

        if (typeof outputFileName !== "string" || outputFileName.length === 0) {
            console.warn(
                `An invalid file name was provided, falling back to ${Config.defaultFileName}`
            );
            outputFilePath = path.join(outputFilePath, Config.defaultFileName);
        } else {
            outputFilePath = path.join(outputFilePath, outputFileName);
        }

        // TODO: fix file dirs not being created if they do not exist
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
