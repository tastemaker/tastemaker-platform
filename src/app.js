import 'babel-polyfill'; // This needs to come VERY FIRST so ES6 polyfills will be available in ES5 browsers

import express from 'express';
import passport from 'passport';
import bodyParser from 'body-parser';

import logger from 'utils/logger';
import db from 'db';
import { setupAuthentication, authenticate } from './auth';
import config from 'config';


const app = express();

// Allow CORS requests
app.options("/*", function(req, res, next){
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    res.sendStatus(200);
});

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// parse application/x-www-form-urlencoded
// for easier testing with Postman or plain HTML forms
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())

setupAuthentication(app);

app.get('/', (req, res) => res.send('Hello Ladies!'));

// Juan remove
//app.get('/test', authenticate(), (req, res) => res.send('Sample response!'));

const port = config.get("app.port");

app.listen(port, () => {
    logger.info(`Tastemaker platform listening on port ${port}!`);
});

