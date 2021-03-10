import path from "path";

interface ConfigConstructor {
    new (
        inputFilePath: string,
        outputFileDir: string,
        outputFileName: string
    ): ConfigInterface;
    rootDir: string;
    defaultFileName: string;
    defaultOutputDir: string;
}

interface ConfigInterface {
    getInputFilePath: () => string;
    getOutputFileDir: () => string;
    getOutputFileName: () => string;
    getRootDir: () => string;
}

/**
 * This should be initialised when the CLI options are selected
 * @param inputFilePath
 * @param outputFileDir
 * @param outputFileName
 */
const Config: ConfigConstructor = class Config implements ConfigInterface {
    private inputFilePath: string;
    private outputFileDir: string;
    private outputFileName: string;
    constructor(
        inputFilePath: string,
        outputFileDir: string,
        outputFileName: string
    ) {
        this.inputFilePath = inputFilePath;
        this.outputFileDir = outputFileDir;
        this.outputFileName = outputFileName;
    }

    static rootDir: string = path.resolve(__dirname, "../../");
    static defaultFileName: string = "data.json";
    static defaultOutputDir: string = "dataOutput";

    getInputFilePath = (): string => {
        return this.inputFilePath;
    };

    getOutputFileDir = (): string => {
        return this.outputFileDir;
    };

    getOutputFileName = (): string => {
        return this.outputFileName;
    };

    getRootDir = (): string => {
        return Config.rootDir;
    };
};

export default Config;
