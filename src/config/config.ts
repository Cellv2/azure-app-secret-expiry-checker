import path from "path";

interface ConfigConstructor {
    new (
        inputFilePath: string,
        outputFileDir?: string,
        outputFileName?: string
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
    private outputFileDir: string | undefined;
    private outputFileName: string | undefined;
    constructor(
        inputFilePath: string,
        outputFileDir: string | undefined,
        outputFileName: string | undefined
    ) {
        this.inputFilePath = inputFilePath;
        this.outputFileDir = outputFileDir;
        this.outputFileName = outputFileName;
    }

    static rootDir: string = path.resolve(__dirname, "../../");
    static defaultFileName: string = "data.json";
    static defaultOutputDir: string = "tmp";

    getInputFilePath = (): string => {
        return this.inputFilePath;
    };

    // returns the defaults if outputFileDir constructor param is undefined
    getOutputFileDir = (): string => {
        return this.outputFileDir ?? Config.defaultOutputDir;
    };

    // returns the defaults if outputFileName constructor param is undefined
    getOutputFileName = (): string => {
        return this.outputFileName ?? Config.defaultFileName;
    };

    getRootDir = (): string => {
        return Config.rootDir;
    };
};

export default Config;
