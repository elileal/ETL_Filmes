const MongoClient = require('mongodb').MongoClient
require('dotenv').config({
  path: '.env'
});
const assert = require('assert');
const chalk = require("chalk");

// MONGO DB
const user = encodeURIComponent(process.env.DB_USERNAME);
const password = encodeURIComponent(process.env.DB_PASSWORD);
const authMechanism = 'DEFAULT';
// const databaseURI = 'mongodb+srv://eliabeleal:Lq36AEJuvjmRtYrK@cluster0-qvwdl.mongodb.net/test?retryWrites=true&w=majority'

const client = new MongoClient(
  `mongodb://${user}:${password}@${process.env.DBMONGO_HOST}:${process.env.DBMONGO_PORT}/${process.env.DB_NAME}?authMechanism=${authMechanism}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

const { extractTransform } = require('./etl');

client.connect(function (err) {
  assert.equal(null, err);
  console.log(chalk.green('Connected successfully to server'));
  console.log("- - - - - - - - - - - - - - - - - - - - - -  ");
  const origin = client.db('MovieLens');
  const etl = client.db('ETL');

  extractTransform(origin, etl);

})