// This software is free software. See AUTHORS and LICENSE for more
// information on the copying conditions.

"use strict";

const equals = require("equals");
const filename = "test/fixtures/test-vector.json";
const fs = require("fs");
const rules = require("../../lib/common/rules");
const scrape = require("../../lib/server/scrape");

describe("the rules functionality", () => {
    it("does not introduce regressions", (done) => {

        scrape.scrape((err, data) => {
            if (err) {
                throw err;
            }

            const novel = JSON.parse(data).map(policy => ({
                [policy.eprintid]: rules.apply(policy).map(compliance => ({
                    [compliance.field_id]: compliance.is_compliant
                })).reduce((all, one) => (Object.assign(all, one)))
            })).reduce((all, one) => (Object.assign(all, one)));

            const orig = JSON.parse(fs.readFileSync(filename));

            const ok = equals(orig, novel);
            console.log(ok);
            done();
        });

    }).timeout(30000);
});
