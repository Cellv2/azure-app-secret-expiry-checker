import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { RetrievedSecretData } from "../types/data-store.types";
import { Data } from "../types/data.types";
import { AvailableMicrosoftServices } from "../types/microsoft-service.types";

export interface DataStoreConstructor {
    new (data: Data | Data[]): DataStoreInterface;
}
export interface DataStoreInterface {
    bulkAddSecretsToStore: (secrets: RetrievedSecretData[]) => void;
    getDataObjectsToCheck: () => Data[];
    getRetrievedEndpointData: () => RetrievedSecretData[] | undefined;
    addItemToEndpointData: <
        E extends AvailableMicrosoftServices,
        D extends E extends "MsGraph"
            ? MicrosoftGraph.PasswordCredential[]
            : E extends "AadGraph"
            ? AzureAdGraphModels.PasswordCredential[]
            : undefined
    >(
        endpointUsed: E,
        data: D
    ) => void;
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

    // have to type this here too due to https://github.com/Microsoft/TypeScript/issues/1373#issuecomment-217341850
    addItemToEndpointData = <
        E extends AvailableMicrosoftServices,
        D extends E extends "MsGraph"
            ? MicrosoftGraph.PasswordCredential[]
            : E extends "AadGraph"
            ? AzureAdGraphModels.PasswordCredential[]
            : undefined
    >(
        endpointUsed: E,
        data: D
    ) => {
        // ensure initialisation
        this.allRetrievedSecrets = this.allRetrievedSecrets ?? [];
        this.allRetrievedSecrets.push({ endpointUsed, data });
    };

    bulkAddSecretsToStore = (secrets: RetrievedSecretData[]) => {
        this.allRetrievedSecrets = secrets;
    };
};

export default DataStore;
