'use strict';

require('dotenv').config();
const debug = require('debug')('simple-express-server');
const app = require('express')();
const cors = require('cors');
const figlet = require('figlet');
const helmet = require('helmet');

app.use(cors());
app.options('*', cors());
app.use(helmet());

const stare = require('../../')({
  engines: ['baremo'],
  baremo: {
    baseUrl: 'http://localhost:9200',
    _index: 'jurisprudencia',
    _source: '_source',
    titleProperty: 'caratulado',
    bodyProperty: 'attachment.content',
    snippetProperty: 'hechosFundantes',
    imageProperty: 'data',
    linkProperty: 'corte'
  }
});

app.get('/:engine', (request, response) => {
  let engine = request.params.engine;
  let { query, numberOfResults } = request.query;

  let metrics = ['lawsuit-ammount', 'courts','injuries', 'category', 'incapacity'];
  stare(engine, query, numberOfResults, metrics)
    .then(result => response.status(200).json(result))
    .catch(err => response.status(500).json(err));
});

app.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
  debug(figlet.textSync('StArE.js-server'));
  debug(`App running on [http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}]!`);
});