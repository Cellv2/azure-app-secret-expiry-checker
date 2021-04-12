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

describe("services - filesystem-interface", () => {
    const mockedFsService = mocked(filesystemInterfaceInstance);

    it("should be the correct class and already instantiated", () => {
        expect(mockedFsService).toBeInstanceOf(FilesystemInterface);
    });

    describe("readDataFromFilesystemAsync", () => {
        it("should return the data in a valid file", async () => {
            expect.assertions(1);

            const data = await mockedFsService.readDataFromFilesystemAsync(
                fixurePath_valid
            );
            const expectedData = {
                test: "valid file",
            };

            expect(JSON.parse(data)).toMatchObject(expectedData);
        });

        it("should throw if an invalid file is passed in", async () => {
            const DIR_ID = nanoid(10);
            const invalidPath = path.resolve(__dirname, DIR_ID);

            expect.assertions(1);

            await expect(
                mockedFsService.readDataFromFilesystemAsync(invalidPath)
            ).rejects.toThrowError(
                `File cannot be read at ${invalidPath} - does the file exist?`
            );

            //TODO: how the heck do we get the catch to throw? fs is going to always just read the file regardless
        });

        it("should throw if the file is empty", async () => {
            expect.assertions(1);

            await expect(
                mockedFsService.readDataFromFilesystemAsync(
                    fixurePath_invalidNoContents
                )
            ).rejects.toThrowError(
                `The file at ${fixurePath_invalidNoContents} was empty`
            );
        });
    });
});
