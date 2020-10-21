/* @flow */
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';
import { join } from 'path';

const ROOT_DIR = join(__dirname, '..');

export let app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/api/data', (req : express$Request, res : express$Response) => res.sendFile(join(ROOT_DIR, 'data.json')));

app.get('/api/data/circulating', async function (req, res) {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    res.status(200).send(data.circulating_supply.toString());
});

app.get('/api/data/total', async function (req, res) {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    res.status(200).send(data.total_supply.toString());
});

app.get('/api/data/volume', async function (req, res) {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    res.status(200).send(data.volume.toString());
});

app.get('/api/data/price', async function (req, res) {
    let data = JSON.parse(fs.readFileSync('data.json', 'utf8'))
    res.status(200).send(data.price.toString());
});
