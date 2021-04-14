import fs from "fs";
import mockFs from "mock-fs";
import { nanoid } from "nanoid";
import path from "path";
import { mocked } from "ts-jest/utils";
import {
    checkFileExistsForRead,
    checkFileHasValidData,
    createDirIfNotExistsAsync,
    doesDirExistsForWritesAsync,
} from "../filesystem.utils";

const fixurePath_valid = path.resolve(
    __dirname,
    "./__fixtures__/fs-data_valid.json"
);
const fixurePath_valid2 = path.resolve(
    __dirname,
    "./__fixtures__/fs-data_valid-2.json"
);
const fixurePath_validAsTxt = path.resolve(
    __dirname,
    "./__fixtures__/fs-data_valid-txtFIle.txt"
);
const fixurePath_invalidKeys = path.resolve(
    __dirname,
    "./__fixtures__/fs-data_invalid-keys.json"
);
const fixurePath_invalidNotArr = path.resolve(
    __dirname,
    "./__fixtures__/fs-data_invalid-notArr.json"
);
const fixurePath_invalidNotValidJson = path.resolve(
    __dirname,
    "./__fixtures__/fs-data_invalid-notValidJson.json"
);

describe("filesystem utils", () => {
    beforeEach(() => {
        mockFs({
            "checkFileExistsForRead/dir": {
                "valid.json": "content",
            },
            "doesDirExistsForWritesAsync/dir/empty": {
                /** empty dir */
            },
            "createDirIfNotExistsAsync/dir": {
                /** empty but tests get written into it */
            },
            "checkFileHasValidData/dir": {
                valid: mockFs.load(fixurePath_valid),
                valid2: mockFs.load(fixurePath_valid2),
                validAsTxt: mockFs.load(fixurePath_validAsTxt),
                invalidKeys: mockFs.load(fixurePath_invalidKeys),
                invalidNotArr: mockFs.load(fixurePath_invalidNotArr),
                invalidNotValidJson: mockFs.load(
                    fixurePath_invalidNotValidJson
                ),
            },
        });
    });

    afterEach(() => {
        mockFs.restore();
    });

    describe("checkFileExistsForRead", () => {
        const mockedFunction = mocked(checkFileExistsForRead);

        it("returns true for an existing file", () => {
            expect.assertions(1);

            const testPath = "checkFileExistsForRead/dir/valid.json";
            expect(mockedFunction(testPath)).toBeTruthy();
        });

        it("returns false for a missing file", () => {
            expect.assertions(1);

            const testPath = `checkFileExistsForRead/dir/${nanoid(10)}.json`;
            expect(mockedFunction(testPath)).toBeFalsy();
        });
    });

    describe("doesDirExistsForWritesAsync", () => {
        const mockedFunction = mocked(doesDirExistsForWritesAsync);

        it("returns true for an existing directory", async () => {
            expect.assertions(1);

            const testPath = "doesDirExistsForWritesAsync/dir/empty";
            await expect(mockedFunction(testPath)).resolves.toBeTruthy();
        });

        it("returns false for a missing directory", async () => {
            expect.assertions(1);

            const testPath = `doesDirExistsForWritesAsync/dir/${nanoid(10)}`;
            await expect(mockedFunction(testPath)).resolves.toBeFalsy();
        });
    });

    describe("createDirIfNotExistsAsync", () => {
        const mockedFunction = mocked(createDirIfNotExistsAsync);

        it("creates the dir if the path is valid", async () => {
            expect.assertions(2);

            const testPath = `createDirIfNotExistsAsync/dir/${nanoid(10)}`;
            await expect(mockedFunction(testPath)).resolves.not.toThrow();
            await expect(fs.promises.access(testPath)).resolves.not.toThrow();
        });

        it("does not throw if dir already exists", async () => {
            expect.assertions(1);

            const testPath = `createDirIfNotExistsAsync/dir/${nanoid(10)}`;
            await fs.promises.mkdir(testPath);
            await expect(mockedFunction(testPath)).resolves.not.toThrow();
        });

        it("handles recursive path creation", async () => {
            expect.assertions(3);

            const testPath = `createDirIfNotExistsAsync/dir/${nanoid(
                10
            )}/subfolder/${nanoid(10)}`;

            await expect(fs.promises.access(testPath)).rejects.toThrow();
            await expect(mockedFunction(testPath)).resolves.not.toThrow();
            await expect(fs.promises.access(testPath)).resolves.not.toThrow();
        });

        it("throws when an invalid path is provided", async () => {
            expect.assertions(1);

            // octal escape sequences aren't supported and will cause errors on dir/file creation
            const testPath = `createDirIfNotExistsAsync/dir/octal\000`;
            const errorString = `Unable to create directory at ${testPath}`;
            await expect(mockedFunction(testPath)).rejects.toThrowError(
                errorString
            );
        });
    });

    describe("checkFileHasValidData", () => {
        const mockedFunction = mocked(checkFileHasValidData);

        it("resolves if the data in the file is valid", async () => {
            expect.assertions(3);

            const valid = `checkFileHasValidData/dir/valid`;
            const valid2 = `checkFileHasValidData/dir/valid2`;
            const validAsTxt = `checkFileHasValidData/dir/validAsTxt`;

            await expect(mockedFunction(valid)).resolves.not.toThrow();
            await expect(mockedFunction(valid2)).resolves.not.toThrow();
            await expect(mockedFunction(validAsTxt)).resolves.not.toThrow();
        });

        it("throws if data in the file is invalid", async () => {
            expect.assertions(3);

            const invalidKeys = `checkFileHasValidData/dir/invalidKeys`;
            const invalidNotArr = `checkFileHasValidData/dir/invalidNotArr`;
            const invalidNotValidJson = `checkFileHasValidData/dir/invalidNotValidJson`;

            await expect(mockedFunction(invalidKeys)).rejects.toThrowError(
                "Keys do not match"
            );
            await expect(mockedFunction(invalidNotArr)).rejects.toThrowError(
                "Please ensure the file contains an array of data"
            );
            await expect(
                mockedFunction(invalidNotValidJson)
            ).rejects.toThrowError(
                "Please ensure that the input is *valid* JSON (e.g. all keys are quoted)"
            );
        });

        it("does not create the dir or file if incorrectly called", async () => {
            expect.assertions(4);

            const invalidDir = `checkFileHasValidData/dir/${nanoid(10)}`;
            const invalidFile = `checkFileHasValidData/dir/${nanoid(
                10
            )}/test.json`;

            await expect(mockedFunction(invalidDir)).rejects.toThrowError(
                `Something went wrong when reading file at ${invalidDir}`
            );
            await expect(fs.promises.access(invalidDir)).rejects.toThrow();

            await expect(mockedFunction(invalidFile)).rejects.toThrowError(
                `Something went wrong when reading file at ${invalidFile}`
            );
            await expect(fs.promises.stat(invalidFile)).rejects.toThrow();
        });

        it("throws when an invalid path is provided", async () => {
            expect.assertions(1);

            // node does not allow us to explicitly use octal escape sequences directly, so we split it up
            const invalidFile = `checkFileHasValidData/dir/\000\\test.json`;
            const errorString = `Something went wrong when reading file at ${invalidFile}`;

            await expect(mockedFunction(invalidFile)).rejects.toThrowError(
                errorString
            );
        });
    });
});
