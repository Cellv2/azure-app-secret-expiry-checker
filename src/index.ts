import { askQuestions } from "./cli";
import Config from "./config/config";
import filesystemInterfaceInstance from "./services/filesystem/filesystem-interface.service";

console.log("heya!");

const mainFs = () => {
    const config = new Config("", "", "");
    // console.log(config.getRootDir());
    console.log(Config.rootDir);

    filesystemInterfaceInstance.writeDataToFilesystemAsync("", "");
};
// mainFs();

const main = async (): Promise<void> => {
    askQuestions();
};

main();
