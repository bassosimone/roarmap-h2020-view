// This software is free software. See AUTHORS and LICENSE for more
// information on the copying conditions.

"use strict";

const database = require("./database");
const express = require("express");

const availableApis = (_, res) => {
    res.json({
        "/api": "Return this list of APIs",
        "/api/": "Same as '/api'",
        "/api/v1/institutions": "Scrape and return all roarmap institutions",
        "/api/version": "Returns API version",
    });
};

const app = express();
app.get("/api", availableApis);
app.get("/api/", availableApis);

app.get("/api/v1/institutions", (_, res) => {
    database.query((err, d) => {
        if (err) {
            res.status(500).send("Internal server error");
            return;
        }
        res.json(d);
    });
});

app.get("/api/version", (_, res) => {
    res.json({
        version: 1
    });
});
app.use(express.static(`${__dirname}/../../static`));
app.use(express.static(`${__dirname}/../../node_modules/bootstrap/dist/css`));

exports.main = () => {
    console.log("Slave worker started");
    app.listen(process.env.PORT || 8080, () => {
        console.log("web application started");
    });
};
