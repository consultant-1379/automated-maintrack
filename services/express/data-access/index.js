const mongodb = require('mongodb');

const { makeDb } = require('./db-operator');
const { Id } = require('./../Id');

const { MongoClient } = mongodb;
const url = process.env.MONGODB_URI;
const client = new MongoClient(url, { useNewUrlParser: true });

async function dbConnector() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(process.env.MONGODB_DATABASE_NAME);
}

const dbOperator = makeDb({ dbConnector, Id });
module.exports = { dbOperator, dbConnector };
