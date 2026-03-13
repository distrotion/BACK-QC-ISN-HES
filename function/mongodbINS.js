const { MongoClient } = require('mongodb');
const url = 'mongodb://127.0.0.1:19010';

let client = null;

async function getClient() {
  if (!client) {
    client = new MongoClient(url, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
  }
  return client;
}

exports.insertMany = async (db_input, collection_input, input) => {
  const c = await getClient();
  const db = c.db(db_input);
  const collection = db.collection(collection_input);
  return await collection.insertMany(input);
};

exports.find = async (db_input, collection_input, input) => {
  const c = await getClient();
  const db = c.db(db_input);
  const collection = db.collection(collection_input);
  return await collection.find(input).limit(1000).sort({ "_id": -1 }).toArray();
};

exports.update = async (db_input, collection_input, input1, input2) => {
  const c = await getClient();
  const db = c.db(db_input);
  const collection = db.collection(collection_input);
  return await collection.updateOne(input1, input2);
};
