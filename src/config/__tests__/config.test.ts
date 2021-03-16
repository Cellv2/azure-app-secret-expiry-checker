import path from "path";
import { mocked } from "ts-jest/utils";
import Config from "../config";

describe("config class", () => {
    const testInputPath = Symbol().toString();
    const testOutputDir = Symbol().toString();
    const testOutputFileName = Symbol().toString();

    const projectRoot = path.resolve(__dirname, "../../../");

    const oneParamConfig = new Config(testInputPath);
    const twoParamConfig = new Config(testInputPath, testOutputDir);
    const threeParamConfig = new Config(
        testInputPath,
        testOutputDir,
        testOutputFileName
    );

    const mockedOneParamConfig = mocked(oneParamConfig, true);
    const mockedTwoParamConfig = mocked(twoParamConfig, true);
    const mockedThreeParamConfig = mocked(threeParamConfig, true);

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should construct as the correct class", () => {
        let mocked = mockedOneParamConfig;
        expect(mocked).toBeInstanceOf(Config);

        mocked = mockedTwoParamConfig;
        expect(mocked).toBeInstanceOf(Config);

        mocked = mockedThreeParamConfig;
        expect(mocked).toBeInstanceOf(Config);
    });

    it("should return the correct outputs when constructed with one param only", () => {
        const mocked = mockedOneParamConfig;
        const spyGetInputFilePath = jest.spyOn(mocked, "getInputFilePath");
        const spyGetOutputFileDir = jest.spyOn(mocked, "getOutputFileDir");
        const spyGetOutputFileName = jest.spyOn(mocked, "getOutputFileName");
        const spyGetRootDir = jest.spyOn(mocked, "getRootDir");

        expect(mocked.getInputFilePath()).toBe(testInputPath);
        expect(spyGetInputFilePath).toBeCalledTimes(1);

        expect(mocked.getOutputFileDir()).toBe(Config.defaultOutputDir);
        expect(spyGetOutputFileDir).toBeCalledTimes(1);

        expect(mocked.getOutputFileName()).toBe(Config.defaultFileName);
        expect(spyGetOutputFileName).toBeCalledTimes(1);

        expect(mocked.getRootDir()).toBe(projectRoot);
        expect(spyGetRootDir).toBeCalledTimes(1);
    });

    it("should return the correct outputs when constructed with two params", () => {
        const mocked = mockedTwoParamConfig;
        const spyGetInputFilePath = jest.spyOn(mocked, "getInputFilePath");
        const spyGetOutputFileDir = jest.spyOn(mocked, "getOutputFileDir");
        const spyGetOutputFileName = jest.spyOn(mocked, "getOutputFileName");
        const spyGetRootDir = jest.spyOn(mocked, "getRootDir");

        expect(mocked.getInputFilePath()).toBe(testInputPath);
        expect(spyGetInputFilePath).toBeCalledTimes(1);

        expect(mocked.getOutputFileDir()).toBe(testOutputDir);
        expect(spyGetOutputFileDir).toBeCalledTimes(1);

        expect(mocked.getOutputFileName()).toBe(Config.defaultFileName);
        expect(spyGetOutputFileName).toBeCalledTimes(1);

        expect(mocked.getRootDir()).toBe(projectRoot);
        expect(spyGetRootDir).toBeCalledTimes(1);
    });

    it("should return the correct outputs when constructed with three params", () => {
        const mocked = mockedThreeParamConfig;

        const spyGetInputFilePath = jest.spyOn(mocked, "getInputFilePath");
        const spyGetOutputFileDir = jest.spyOn(mocked, "getOutputFileDir");
        const spyGetOutputFileName = jest.spyOn(mocked, "getOutputFileName");
        const spyGetRootDir = jest.spyOn(mocked, "getRootDir");

        expect(mocked.getInputFilePath()).toBe(testInputPath);
        expect(spyGetInputFilePath).toBeCalledTimes(1);

        expect(mocked.getOutputFileDir()).toBe(testOutputDir);
        expect(spyGetOutputFileDir).toBeCalledTimes(1);

        expect(mocked.getOutputFileName()).toBe(testOutputFileName);
        expect(spyGetOutputFileName).toBeCalledTimes(1);

        expect(mocked.getRootDir()).toBe(projectRoot);
        expect(spyGetRootDir).toBeCalledTimes(1);
    });
});
