interface ConfigConstructor {
    new (
        inputFilePath: string,
        outputFileDir: string,
        outputFileName: string
    ): void;
}

interface ConfigInterface {
    getInputFilePath: () => string;
    getOutputFileDir: () => string;
    getOutputFileName: () => string;
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

    getInputFilePath = (): string => {
        return this.inputFilePath;
    };

    getOutputFileDir = (): string => {
        return this.outputFileDir;
    };

    getOutputFileName = (): string => {
        return this.outputFileName;
    };
};

export default Config;
