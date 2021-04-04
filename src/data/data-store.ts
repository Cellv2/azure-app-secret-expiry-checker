import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { RetrievedEndpointData } from "../types/data-store.types";
import { Data } from "../types/data.types";
import { AvailableMicrosoftServices } from "../types/microsoft-service.types";

export interface DataStoreConstructor {
    new (data: Data | Data[]): DataStoreInterface;
}
export interface DataStoreInterface {
    getDataObjectsToCheck: () => Data[];
    addItemToEndpointData: <
        E extends AvailableMicrosoftServices,
        D extends E extends "MsGraph"
            ? MicrosoftGraph.Application[]
            : AzureAdGraphModels.Application[]
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

    private _allRetrievedEndpointData: RetrievedEndpointData[] | undefined;

    getDataObjectsToCheck = (): Data[] => {
        return this._dataObjects;
    };

    getRetrievedEndpointData() {
        if (!this._allRetrievedEndpointData) {
            return undefined;
        }

        return this._allRetrievedEndpointData;
    }

    // have to type this here too due to https://github.com/Microsoft/TypeScript/issues/1373#issuecomment-217341850
    addItemToEndpointData = <
        E extends AvailableMicrosoftServices,
        D extends E extends "MsGraph"
            ? MicrosoftGraph.Application[]
            : AzureAdGraphModels.Application[]
    >(
        endpointUsed: E,
        data: D
    ) => {
        // ensure initialisation
        this._allRetrievedEndpointData = this._allRetrievedEndpointData ?? [];
        this._allRetrievedEndpointData.push({ endpointUsed, data });
    };
};

export default DataStore;
