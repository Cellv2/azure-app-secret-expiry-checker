import { TENANT_ID_DEV } from "../../config/secrets";

// https://docs.microsoft.com/en-us/previous-versions/azure/ad/graph/api/api-catalog
namespace AadGraphApis {
    const apiVersionString = "api-version=1.6";
    const baseUri: string = `https://graph.windows.net/${TENANT_ID_DEV}`;

    // https://docs.microsoft.com/en-us/previous-versions/azure/ad/graph/api/entity-and-complex-type-reference#application-entity
    export const getAllApplications = () => {
        return `${baseUri}/applications?${apiVersionString}`;
    };
}

export default AadGraphApis;
