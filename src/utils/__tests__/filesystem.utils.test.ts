import fs from "fs";
import path from "path";
import { mocked } from "ts-jest/utils";
import {
    checkFileExistsForRead,
    ensureDirExistsForWritesAsync,
    doesDirExistsForWritesAsync,
    createDirIfNotExistsAsync,
} from "../filesystem.utils";
import { nanoid } from "nanoid";
import rimraf from "rimraf";

const TEST_DIR_ROOT = path.resolve(__dirname, "./__tempTestDir");

const existingDir = path.resolve(__dirname, "./__fixtures__");
const fixtureDir = path.resolve(__dirname, "./__fixtures__");
const newFixtureDir = path.resolve(__dirname, "./__fixtures__/tmp");
const invalidFixtureDir = path.resolve(__dirname, "./__fixtures__/tmp");

const validFixtureFile = path.resolve(
    __dirname,
    "./__fixtures__/filesystem-test-data.json"
);
const invalidFixtureFile = path.resolve(__dirname, `${Symbol().toString()}`);

describe("utils - checkFileExistsForRead", () => {
    const mockedFunction = mocked(checkFileExistsForRead);

    it("returns true for an existing file", () => {
        expect(mockedFunction(validFixtureFile)).toBeTruthy();
    });

    it("returns false for a missing file", () => {
        expect(mockedFunction(invalidFixtureFile)).toBeFalsy();
    });
});

xdescribe("utils - ensureDirExistsForWritesAsync", () => {
    afterAll(() => {
        // TODO: uncomment this when #3 is fixed
        // TODO: also make sure this isn't eating other files (I think it deleted filesystem-test-data.json ?)
        // rimraf(`${fixtureDir}/*`, (err) => console.error(err));
    });

    const mockedFunction = mocked(ensureDirExistsForWritesAsync);

    it("does not error for an existing path", async () => {
        await expect(mockedFunction(fixtureDir)).resolves.not.toThrow();
    });

    xit("creates the dir if it does not exist", async () => {
        await expect(mockedFunction(newFixtureDir)).resolves.not.toThrow();
        expect(fs.existsSync(newFixtureDir)).toBeTruthy();
    });

    it("errors with invalid dir", () => {
        // //@ts-expect-error - testing to ensure the catches work
        // await expect(mockedFunction(1)).rejects.toThrow();
    });
});

describe("utils - doesDirExistsForWritesAsync", () => {
    const mockedFunction = mocked(doesDirExistsForWritesAsync);

    it("returns true for an existing directory", async () => {
        expect.assertions(1);
        await expect(mockedFunction(fixtureDir)).resolves.toBeTruthy();
    });

    it("returns false for a missing directory", async () => {
        expect.assertions(1);
        await expect(mockedFunction(invalidFixtureDir)).resolves.toBeFalsy();
    });
});

describe("utils - createDirIfNotExistsAsync", () => {
    // *****
    // * This test suite seems to cause some EPERM exceptions on Windows from time to time
    // TODO: Look into why this is happening
    // *****

    beforeAll(() => {
        if (!fs.existsSync(TEST_DIR_ROOT)) {
            fs.mkdirSync(TEST_DIR_ROOT);
        } else {
            rimraf.sync(`${TEST_DIR_ROOT}/*`);
        }
    });

    afterAll(() => {
        if (fs.existsSync(TEST_DIR_ROOT)) {
            // intentionally not removing the entire folder, because if we delete the whole folder we seem to get EPERM issues far more frequently
            rimraf.sync(`${TEST_DIR_ROOT}/*`);
        }
    });

    const mockedFunction = mocked(createDirIfNotExistsAsync);

    it("creates the dir if the path is valid", async () => {
        const DIR_ID = nanoid(10);
        const testDir = path.resolve(TEST_DIR_ROOT, DIR_ID);

        expect.assertions(2);

        await expect(mockedFunction(testDir)).resolves.not.toThrow();
        await expect(fs.promises.access(testDir)).resolves.not.toThrow();
    });

    it("does not throw if dir already exists", async () => {
        const DIR_ID = nanoid(10);
        const testDir = path.resolve(TEST_DIR_ROOT, DIR_ID);

        expect.assertions(1);

        await fs.promises.mkdir(testDir);
        await expect(mockedFunction(testDir)).resolves.not.toThrow();
    });

    it("handles recursive path creation", async () => {
        const DIR_ID = nanoid(10);
        const recursiveDirPath = path.resolve(
            TEST_DIR_ROOT,
            "./subfolder/",
            DIR_ID
        );

        expect.assertions(3);

        await expect(fs.promises.access(recursiveDirPath)).rejects.toThrow();
        await expect(mockedFunction(recursiveDirPath)).resolves.not.toThrow();
        await expect(
            fs.promises.access(recursiveDirPath)
        ).resolves.not.toThrow();
    });

    it("throws when an invalid path is provided", async () => {
        // node does not allow us to explicitly use octal escape sequences directly, so we split it up
        const partialInvalidDirPath = path.resolve(
            TEST_DIR_ROOT,
            "./subfolder/"
        );
        const invalidDirPath = `${partialInvalidDirPath}\000`;
        const errorString = `Unable to create directory at ${invalidDirPath}`;

        expect.assertions(1);
        await expect(mockedFunction(invalidDirPath)).rejects.toThrowError(
            errorString
        );
    });
});
