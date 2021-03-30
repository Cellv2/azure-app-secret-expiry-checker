import { Data } from "../types/data.types";

interface DataStoreConstructor {
    new (data: Data | Data[]): DataStoreInterface;
}

interface DataStoreInterface {
    getDataObjectsToCheck: () => Data[];
}

export const DataStore: DataStoreConstructor = class DataStore
    implements DataStoreInterface {
    private _dataObjects: Data[];
    constructor(data: Data | Data[]) {
        if (!Array.isArray(data)) {
            this._dataObjects = [data];
        } else {
            this._dataObjects = data;
        }
    }

    getDataObjectsToCheck = (): Data[] => {
        return this._dataObjects;
    };
};

export default DataStore;
