import { RetrievedSecretData } from "../types/data-store.types";
import { Data } from "../types/data.types";

import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
export interface DataStoreConstructor {
    new (): DataStoreInterface;
}
export interface DataStoreInterface {
    bulkAddSecretsToStore: (secrets: RetrievedSecretData[]) => void;
    getDataObjectsToCheck: () => Data[] | null;
    getRetrievedEndpointData: () => RetrievedSecretData[] | null;
    setDataObjectsToCheck: (data: Data[] | Data) => void;
    getEmailData: () =>
        | (MicrosoftGraph.PasswordCredential &
              AzureAdGraphModels.PasswordCredential)[]
        | null;
}

export const DataStore: DataStoreConstructor = class DataStore
    implements DataStoreInterface {
    private dataObjects: Data[] | null = null;
    private allRetrievedSecrets: RetrievedSecretData[] | null = null;

    getDataObjectsToCheck = (): Data[] | null => {
        return this.dataObjects;
    };

    setDataObjectsToCheck = (data: Data[] | Data): void => {
        if (!Array.isArray(data)) {
            // data can be created from either the single or multiple input types, so we force convert to an array for consistency
            this.dataObjects = [data];
        } else {
            this.dataObjects = data;
        }
    };

    getRetrievedEndpointData() {
        return this.allRetrievedSecrets;
    }

    bulkAddSecretsToStore = (secrets: RetrievedSecretData[]) => {
        this.allRetrievedSecrets = secrets;
    };

    getEmailData = () => {
        if (!this.allRetrievedSecrets) {
            return null;
        }

        return this.allRetrievedSecrets.flatMap<RetrievedSecretData["data"]>(
            (obj) => obj.data
        );
        // return this.allRetrievedSecrets.map(obj => obj.data).flat();
    };
};

const dataStoreInstance = new DataStore();

export default dataStoreInstance;
