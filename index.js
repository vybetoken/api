/* @flow */

// eslint-disable-next-line import/no-commonjs, import/no-unassigned-import
require('babel-register');

// eslint-disable-next-line import/no-commonjs
let { app } = require('./server');

app.listen(8000, () => console.log(`Vybe API listening on port 8000!`));
