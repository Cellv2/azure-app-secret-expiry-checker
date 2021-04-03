import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { Data } from "../types/data.types";
import { AvailableMicrosoftServices } from "../types/microsoft-service.types";


interface DataStoreConstructor {
    new (data: Data | Data[]): DataStoreInterface;
}

interface DataStoreInterface {
    getDataObjectsToCheck: () => Data[];
    setEndpointData: <E extends AvailableMicrosoftServices, D extends (E extends "MsGraph" ? MicrosoftGraph.Application[] : AzureAdGraphModels.Application[])>(endpointUsed: E, data: D ) => void;
}


type AllEndpointData = {
    endpointUsed: AvailableMicrosoftServices
    data: MicrosoftGraph.Application[] | AzureAdGraphModels.Application[]
}




// type MyData<E> = ExtractEndpointUsed<E> extends ""

export const DataStore: DataStoreConstructor = class DataStore
    implements DataStoreInterface
     {
    private _dataObjects: Data[];
    constructor(data: Data | Data[]) {
        // data can be created from either the single or multiple input types, so we force convert to an array for consistency
        if (!Array.isArray(data)) {
            this._dataObjects = [data];
        } else {
            this._dataObjects = data;
        }
    }

    private _allEndpointData:AllEndpointData | undefined;



    getDataObjectsToCheck = (): Data[] => {
        return this._dataObjects;
    };

    // setDataFromEndpoints = () => {

    // }

    getEndpointData()  {
        if (!this._allEndpointData) {
            return undefined
        }

        const {endpointUsed, data} = this._allEndpointData
        if (endpointUsed === "MsGraph") {
            return data as MicrosoftGraph.Application[]
        }

        if (endpointUsed === "AadGraph") {
            return data as AzureAdGraphModels.Application[]
        }
    }

    setEndpointData = <E extends AvailableMicrosoftServices, D extends (E extends "MsGraph" ? MicrosoftGraph.Application[] : AzureAdGraphModels.Application[])> (endpointUsed: E, data: D ) => {

    }
};

export default DataStore;

const tempData = [{"tenantId": "", "clientId": "", "clientSecret": "", "serviceToUse": "MsGraph"}]
// const x = new DataStore(tempData);
// x.setEndpointData("AadGraph",)
