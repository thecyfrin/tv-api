const bodyParser = require("body-parser");
const env = require("dotenv");
const express = require("express");
const userRoute = require("../routes/user_routes");
require('../config/db');


const app = express();
env.config();

const PORTNUMBER = process.env.PORT || 8080;

app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use("/.netlify/functions/app", userRoute);

module.exports.handler = serverless(app);


