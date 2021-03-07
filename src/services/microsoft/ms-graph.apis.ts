// https://docs.microsoft.com/en-us/graph/api/overview?view=graph-rest-1.0
namespace MsGraphApis {
    const apiVersion = "v1.0";
    const baseUri: string = `https://graph.microsoft.com/${apiVersion}`;

    export const getUsers = () => {
        return `${baseUri}/users`;
    };

    // https://docs.microsoft.com/en-us/graph/api/application-list?view=graph-rest-1.0
    export const getAllApplications = () => {
        return `${baseUri}/applications`;
    };

    // https://docs.microsoft.com/en-us/graph/api/application-get?view=graph-rest-1.0
    export const getApplicationById = (applicationId: string) => {
        return `${baseUri}/applications/${applicationId}`;
    };
}

export default MsGraphApis;
