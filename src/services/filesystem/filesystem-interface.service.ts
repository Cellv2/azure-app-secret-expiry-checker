interface FilesystemInterfaceConstructor {
    new (): FilesystemInterfaceInterface;
}

interface FilesystemInterfaceInterface {
    readDataFromFIlesystemAsync(filePath: string): Promise<void>;
    writeDataToFilesystemAsync(outputDir?: string): Promise<void>;
}

const FilesystemInterface: FilesystemInterfaceConstructor = class FilesystemInterface
    implements FilesystemInterfaceInterface {
    readDataFromFIlesystemAsync = async (filePath: string) => {};

    writeDataToFilesystemAsync = async (outputDir?: string) => {};
};

const filesystemInterfaceInstance = new FilesystemInterface();

export default filesystemInterfaceInstance;
