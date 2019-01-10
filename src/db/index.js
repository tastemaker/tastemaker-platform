
import mongoose from 'mongoose';
import config from 'config';
import url from 'url';

import logger from 'utils/logger';

const uriString = config.get("db.uri");
const uri = url.parse(uriString);

logger.info(`Connecting to Mongo database server at ${uri.host}`);
mongoose.connect(uriString, { useNewUrlParser: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    // we're connected!
});