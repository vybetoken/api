/* @flow */

// eslint-disable-next-line import/no-commonjs, import/no-unassigned-import
require('babel-register');
// eslint-disable-next-line import/no-commonjs, import/no-unassigned-import
require("dotenv").config();

// eslint-disable-next-line import/no-commonjs
const { pullData } = require('./server/get_data');

pullData(process.env.API_KEY).catch(err => {
    console.error('Error in pullData()', err.stack);
    // eslint-disable-next-line no-process-exit, unicorn/no-process-exit
    process.exit(1);
});
