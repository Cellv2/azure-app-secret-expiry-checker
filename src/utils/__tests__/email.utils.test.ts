import {
    generateMjmlTable,
    generateTableHeaders,
    generateTableRows,
} from "../email.utils";
import { mocked } from "ts-jest/utils";
import { TABLE_HEADER_KEYS } from "../../constants/email.constants";

describe("email utils", () => {
    describe("generateTableHeaders", () => {
        const mockedFunction = mocked(generateTableHeaders);

        fit("produces the expected output", () => {
            const testHeaderKeys = [
                "displayName",
                "keyId",
                "endDateTime",
                "customKeyIdentifier",
                "hint",
            ];
            //@ts-ignore - we know this is incorrectly typed, but it should still work regardless of input
            expect(mockedFunction(testHeaderKeys)).toStrictEqual<string>(
                '<tr style="border-bottom:1px solid #ecedee;text-align:left;"><th>displayName</th>,<th>keyId</th>,<th>endDateTime</th>,<th>customKeyIdentifier</th>,<th>hint</th></tr>'
            );

            expect(mockedFunction(TABLE_HEADER_KEYS)).toStrictEqual<string>(
                '<tr style="border-bottom:1px solid #ecedee;text-align:left;"><th>displayName</th>,<th>keyId</th>,<th>endDateTime</th></tr>'
            );
        });
    });
});
