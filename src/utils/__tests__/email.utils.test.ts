import {
    generateMjmlTable,
    generateTableHeaders,
    generateTableRows,
} from "../email.utils";
import { mocked } from "ts-jest/utils";
import { TABLE_HEADER_KEYS } from "../../constants/email.constants";

const testHeaderKeys = [
    "displayName",
    "keyId",
    "endDateTime",
    "customKeyIdentifier",
    "hint",
];

describe("email utils", () => {
    describe("generateTableHeaders", () => {
        const mockedFunction = mocked(generateTableHeaders);

        it("produces the expected output", () => {
            //@ts-ignore - we know this is incorrectly typed, but it should still work regardless of input
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

        it("returns the correct rows depending on the columns provided", () => {
            expect(
                //@ts-ignore
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
});
