import { mocked } from "ts-jest/utils";

import { areAllDataKeysValid } from "../data.utils";

describe("utils - areAllDataKeysValid", () => {
    const mockedFunction = mocked(areAllDataKeysValid, true);
    const validTest = [
        {
            tenantId: "",
            clientId: "",
            clientSecret: "",
            serviceToUse: "MsGraph",
        },
    ];
    const invalidTest = [
        {
            tenantId: "",
            clientId: "",
            clientSecret: "",
            serviceToUs: "MsGraph",
        },
    ];
    const invalidTest2 = [{ tenantId: "", clientId: "", clientSecret: "" }];
    const invalidTest3 = [
        { tenantId: "", clientId: "", clientSecret: "", serviceToUse: [] },
    ];

    it("returns true with correct input", () => {
        expect(mockedFunction(validTest)).toBeTruthy();
    });

    it("returns false with incorrect input", () => {
        expect(mockedFunction(invalidTest)).toBeFalsy();
        expect(mockedFunction(invalidTest2)).toBeFalsy();
        expect(mockedFunction(invalidTest3)).toBeFalsy();
    });
});
