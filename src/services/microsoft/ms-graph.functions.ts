namespace MsGraphFunctions {
    const apiVersion = "v1.0";
    const baseUri: string = `https://graph.microsoft.com/${apiVersion}`;

    export const getUsers = () => {
        return `${baseUri}/users`;
    };
}

export default MsGraphFunctions;
