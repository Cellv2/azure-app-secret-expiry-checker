import fs from "fs";
import path from "path";
import { mocked } from "ts-jest/utils";
import {
    checkFileExistsForRead,
    ensureDirExistsForWritesAsync,
} from "../filesystem.utils";

const fixtureDir = path.resolve(__dirname, "./__fixtures__");
const newFixtureDir = path.resolve(__dirname, "./__fixtures__/tmp");

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

describe("utils - ensureDirExistsForWritesAsync", () => {
    afterAll(() => {
        // TODO: uncomment this when #3 is fixed
        // TODO: also make sure this isn't eating other files (I think it deleted filesystem-test-data.json ?)
        // rimraf(`${fixtureDir}/*`, (err) => console.error(err));
    });

    const mockedFunction = mocked(ensureDirExistsForWritesAsync);

    it("does not error for an existing path", async () => {
        await expect(mockedFunction(fixtureDir)).resolves.not.toThrow();
    });

    it("creates the dir if it does not exist", async () => {
        await expect(mockedFunction(newFixtureDir)).resolves.not.toThrow();
        expect(fs.existsSync(newFixtureDir)).toBeTruthy();
    });
});
