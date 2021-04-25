import { GraphRbacManagementModels as AzureAdGraphModels } from "@azure/graph";
import * as MicrosoftGraph from "@microsoft/microsoft-graph-types";
import { mocked } from "ts-jest/utils";
import { TABLE_HEADER_KEYS } from "../../constants/email.constants";
import {
    generateMjmlTable,
    generateTableHeaders,
    generateTableRows,
    normaliseData,
} from "../email.utils";

const testHeaderKeys = [
    "displayName",
    "keyId",
    "endDateTime",
    "customKeyIdentifier",
    "hint",
];

const testData = [
    {
        displayName: "App_1",
        endDateTime: "Some time in the future",
        keyId: "a guid",
        hint: "some hint",
    },
    {
        displayName: "App_2",
        endDateTime: "some time in the past",
        keyId: "another guid",
    },
];

describe("email utils", () => {
    describe("generateTableHeaders", () => {
        const mockedFunction = mocked(generateTableHeaders);

        it("produces the expected output", () => {
            //@ts-expect-error - we know this is incorrectly typed, but it should still work regardless of input
            expect(mockedFunction(testHeaderKeys)).toStrictEqual<string>(
                '<tr style="border-bottom:1px solid #ecedee;text-align:left;"><th>displayName</th>,<th>keyId</th>,<th>endDateTime</th>,<th>customKeyIdentifier</th>,<th>hint</th></tr>'
            );

            expect(mockedFunction(TABLE_HEADER_KEYS)).toStrictEqual<string>(
                '<tr style="border-bottom:1px solid #ecedee;text-align:left;"><th>displayName</th>,<th>keyId</th>,<th>endDateTime</th></tr>'
            );
        });
    });

    describe("generateTableRows", () => {
        const mockedFunction = mocked(generateTableRows);

        it("returns the correct rows depending on the columns provided", () => {
            expect(
                //@ts-expect-error - we expect this to error as the header keys are incorrectly typed
                mockedFunction(testHeaderKeys, testData)
            ).toStrictEqual<string>(
                "<tr><td>App_1</td>,<td>a guid</td>,<td>Some time in the future</td>,<td>null</td>,<td>some hint</td></tr><tr><td>App_2</td>,<td>another guid</td>,<td>some time in the past</td>,<td>null</td>,<td>null</td></tr>"
            );

            expect(
                mockedFunction(TABLE_HEADER_KEYS, testData)
            ).toStrictEqual<string>(
                "<tr><td>App_1</td>,<td>a guid</td>,<td>Some time in the future</td></tr><tr><td>App_2</td>,<td>another guid</td>,<td>some time in the past</td></tr>"
            );
        });
    });

    describe("generateMjmlTable", () => {
        const mockedFunction = mocked(generateMjmlTable);

        // would prefer actual HTML comparison rather than snapshots, but the line breaks are acting funny
        it("produces the expected output", async () => {
            //@ts-expect-error - we expect this to error as the header keys are incorrectly typed
            const testHeadersParse = mockedFunction(testHeaderKeys, testData);
            expect(testHeadersParse.errors).toHaveLength(0);
            expect(testHeadersParse.html).toMatchSnapshot();

            const actualHeadersParse = mockedFunction(
                TABLE_HEADER_KEYS,
                testData
            );
            expect(actualHeadersParse.errors).toHaveLength(0);
            expect(actualHeadersParse.html).toMatchSnapshot();
        });
    });

    describe("normaliseData", () => {
        const mockedFunction = mocked(normaliseData);

        // start/end dates on the AAD object is a Date
        const endDate: Date = new Date("2022-05-24T00:00:00.000Z");
        const startDate: Date = new Date("2021-04-25T00:00:00.000Z");

        const endDateTest = {
            displayName: "App_1",
            keyId: "a guid",
            hint: "some hint",
            endDate: endDate,
        };
        const endDateTest_expected = {
            ...endDateTest,
            endDateTime: "2022-05-24T00:00:00.000Z",
        };

        const startDateTest = {
            displayName: "App_2",
            endDateTime: "some time in the past",
            keyId: "another guid",
            startDate: startDate,
        };
        const startDateTest_expected = {
            ...startDateTest,
            startDateTime: "2021-04-25T00:00:00.000Z",
        };

        const notAlteredTest = {
            displayName: "I_should_not_be_altered",
            endDateTime: "random",
            keyId: "wat",
            startDateTime: "yes",
        };

        it("correctly adds the endDate property", () => {
            const inputData: (MicrosoftGraph.PasswordCredential &
                AzureAdGraphModels.PasswordCredential)[] = [endDateTest];

            const expectedData = [endDateTest_expected];
            expect(mockedFunction(inputData)).toEqual(expectedData);
        });

        it("correctly adds the startDate property", () => {
            const inputData: (MicrosoftGraph.PasswordCredential &
                AzureAdGraphModels.PasswordCredential)[] = [startDateTest];

            const expectedData = [startDateTest_expected];
            expect(mockedFunction(inputData)).toEqual(expectedData);
        });

        it("will add properties to multiple objects", () => {
            const inputData: (MicrosoftGraph.PasswordCredential &
                AzureAdGraphModels.PasswordCredential)[] = [
                startDateTest,
                endDateTest,
            ];

            const expectedData = [startDateTest_expected, endDateTest_expected];
            expect(mockedFunction(inputData)).toEqual(expectedData);
        });

        it("does not add properties if not required", () => {
            const inputData_single: (MicrosoftGraph.PasswordCredential &
                AzureAdGraphModels.PasswordCredential)[] = [notAlteredTest];

            const expectedData_single = [notAlteredTest];
            expect(mockedFunction(inputData_single)).toEqual(
                expectedData_single
            );

            const inputData_multiple: (MicrosoftGraph.PasswordCredential &
                AzureAdGraphModels.PasswordCredential)[] = [
                notAlteredTest,
                startDateTest,
                endDateTest,
                notAlteredTest,
                endDateTest,
                notAlteredTest,
            ];

            const expectedData_multiple = [
                notAlteredTest,
                startDateTest_expected,
                endDateTest_expected,
                notAlteredTest,
                endDateTest_expected,
                notAlteredTest,
            ];
            expect(mockedFunction(inputData_multiple)).toEqual(
                expectedData_multiple
            );
        });
    });
});
