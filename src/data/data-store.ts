import { RetrievedSecretData } from "../types/data-store.types";
import { Data } from "../types/data.types";

export interface DataStoreConstructor {
    new (data: Data | Data[]): DataStoreInterface;
}
export interface DataStoreInterface {
    bulkAddSecretsToStore: (secrets: RetrievedSecretData[]) => void;
    getDataObjectsToCheck: () => Data[];
    getRetrievedEndpointData: () => RetrievedSecretData[] | undefined;
}

export const DataStore: DataStoreConstructor = class DataStore
    implements DataStoreInterface {
    private _dataObjects: Data[];
    constructor(data: Data | Data[]) {
        // data can be created from either the single or multiple input types, so we force convert to an array for consistency
        if (!Array.isArray(data)) {
            this._dataObjects = [data];
        } else {
            this._dataObjects = data;
        }
    }

    private allRetrievedSecrets: RetrievedSecretData[] | undefined;

    getDataObjectsToCheck = (): Data[] => {
        return this._dataObjects;
    };

    getRetrievedEndpointData() {
        if (!this.allRetrievedSecrets) {
            return undefined;
        }

        return this.allRetrievedSecrets;
    }

    bulkAddSecretsToStore = (secrets: RetrievedSecretData[]) => {
        this.allRetrievedSecrets = secrets;
    };
};

export default DataStore;
