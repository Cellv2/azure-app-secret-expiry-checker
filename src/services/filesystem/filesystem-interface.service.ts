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

const ensureDirExistsAsync = async (dirPathToTest: string) => {
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

const FilesystemInterface: FilesystemInterfaceConstructor = class FilesystemInterface
    implements FilesystemInterfaceInterface {
    readDataFromFIlesystemAsync = async (inputFilePath: string) => {};

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

        await ensureDirExistsAsync(targetDir);

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
