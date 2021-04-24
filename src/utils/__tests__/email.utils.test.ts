import {
    generateMjmlTable,
    generateTableHeaders,
    generateTableRows,
} from "../email.utils";
import { mocked } from "ts-jest/utils";
import { TABLE_HEADER_KEYS } from "../../constants/email.constants";

import fs from "fs";
import path from "path";

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

    describe("generateMjmlTable", async () => {
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
});
