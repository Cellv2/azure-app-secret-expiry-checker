import mockFs from "mock-fs";
import { nanoid } from "nanoid";
import path from "path";
import { mocked } from "ts-jest/utils";
import filesystemInterfaceInstance, {
    FilesystemInterface,
} from "../filesystem-interface.service";

const fixurePath_valid = path.resolve(
    __dirname,
    "./__fixtures__/fs-interface_valid.json"
);
const fixurePath_invalidNoContents = path.resolve(
    __dirname,
    "./__fixtures__/fs-interface_invalid-noContents.json"
);

describe("filesystem-interface service", () => {
    beforeEach(() => {
        mockFs({
            "readDataFromFilesystemAsync/dir": {
                "valid.json": mockFs.load(fixurePath_valid),
                "invalidNoContents.json": mockFs.load(
                    fixurePath_invalidNoContents
                ),
            },
        });
    });

    afterEach(() => {
        mockFs.restore();
    });

    const mockedService = mocked(filesystemInterfaceInstance);

    it("should be the correct class and already instantiated", () => {
        expect(mockedService).toBeInstanceOf(FilesystemInterface);
    });

    describe("readDataFromFilesystemAsync", () => {
        it("should return the data in a valid file", async () => {
            expect.assertions(1);

            const data = await mockedService.readDataFromFilesystemAsync(
                `readDataFromFilesystemAsync/dir/valid.json`
            );
            const expectedData = {
                test: "valid file",
            };

            expect(JSON.parse(data)).toMatchObject(expectedData);
        });

        it("should throw if an invalid file is passed in", async () => {
            expect.assertions(1);

            const invalidPath = `readDataFromFilesystemAsync/dir/${nanoid(10)}`;
            await expect(
                mockedService.readDataFromFilesystemAsync(invalidPath)
            ).rejects.toThrowError(
                `File cannot be read at ${invalidPath} - does the file exist?`
            );

            //TODO: how the heck do we get the catch to throw? fs is going to always just read the file regardless
        });

        it("should throw if the file is empty", async () => {
            expect.assertions(1);

            const invalidPath = `readDataFromFilesystemAsync/dir/invalidNoContents.json`;
            await expect(
                mockedService.readDataFromFilesystemAsync(invalidPath)
            ).rejects.toThrowError(`The file at ${invalidPath} was empty`);
        });
    });
    describe("services - filesystem-interface", () => {});
});
