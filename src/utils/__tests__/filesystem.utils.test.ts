import fs from "fs";
import path from "path";
import { mocked } from "ts-jest/utils";
import { ensureDirExistsForWritesAsync } from "../filesystem.utils";

const fixtureDir = path.resolve(__dirname, "./__fixtures__");
const newFixtureDir = path.resolve(__dirname, "./__fixtures__/tmp");
const fixtureFile = path.resolve(
    __dirname,
    "./__fixtures__/filesystem-test-data.json"
);

describe("utils - ensureDirExistsForWritesAsync", () => {
    afterAll(() => {
        // TODO: uncomment this when #3 is fixed
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
