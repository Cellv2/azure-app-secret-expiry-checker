// https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0
namespace MsGraphApis {
    const apiVersion = "v1.0";
    const baseUri: string = `https://graph.microsoft.com/${apiVersion}`;

    // https://docs.microsoft.com/en-us/graph/api/application-list?view=graph-rest-1.0
    export const getAllApplications = () => {
        return `${baseUri}/applications`;
    };
}

export default MsGraphApis;
