/* @flow */
import express from 'express';
import bodyParser from 'body-parser';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');

export let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.get('/api/data', (req : express$Request, res : express$Response) => res.sendFile(join(ROOT_DIR, 'data.json')));
