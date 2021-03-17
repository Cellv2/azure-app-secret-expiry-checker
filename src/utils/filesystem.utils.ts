import fs from "fs";

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
