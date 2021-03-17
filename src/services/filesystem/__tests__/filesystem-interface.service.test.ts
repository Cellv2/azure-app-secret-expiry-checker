import { mocked } from "ts-jest/utils";
import filesystemInterfaceInstance, {
    FilesystemInterface,
} from "../filesystem-interface.service";

describe("services - filesystem-interface", () => {
    const mockedFsService = mocked(filesystemInterfaceInstance);

    it("should be the correct class and already instantiated", () => {
        expect(mockedFsService).toBeInstanceOf(FilesystemInterface);
    });
});
