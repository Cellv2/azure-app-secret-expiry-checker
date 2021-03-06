import { TENANT_ID_DEV } from "../../secrets";

namespace AadGraphFunctions {
    const apiVersionString = "api-version=1.6";
    const baseUri: string = `https://graph.windows.net/${TENANT_ID_DEV}`;

    export const getUsers = () => {
        return `${baseUri}/users?${apiVersionString}`;
    };
}

export default AadGraphFunctions;
