const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const webPush = require('web-push');
const bodyParser = require('body-parser').json()
const exerciseRoute = require('./routes/exercises');
const userRoute = require('./routes/user')
require('dotenv').config();
const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: true })
const connection = mongoose.connection;
const vapidKeys = {
    publicVapidKey: "BIiXsNrUfJ4v4kIwiShRyslSi742Z9AkC_P4bgkUOzz1NSjvI85kXAU_-fXn5xaqkfTzSQLFZmgCo5QW2GAx6Xk",
    privateVapidKey: "9yei0oj89YM4g_ytJGWCidfEPZGNa7yaVO0-PmJaCJo"
}
webPush.setVapidDetails('mailto:pratibha.h@innovify.in', vapidKeys.publicVapidKey, vapidKeys.privateVapidKey);


connection.once('open', () => {
    console.log("Mongodb connection established")
})
const app = express();
let subscription = null;
app.use(cors({ origin: '*' }));
app.post('/subscribe', bodyParser, (req, res) => {
    subscription = req.body
    res.status(201).json({});
});

app.use(function (req, res, next) {
    if (req.url !== '/subscribe') {
        req.subscription = subscription
        req.webPush = webPush
    }
    next();
});
app.use('/exercises', bodyParser, exerciseRoute);
app.use('/users', bodyParser, userRoute);
app.use(express.json());
module.exports = app;