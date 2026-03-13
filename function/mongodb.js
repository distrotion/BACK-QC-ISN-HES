const { MongoClient } = require('mongodb');
const url = 'mongodb://172.23.10.70:27017';

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
  return await collection.find(input).limit(30000).sort({ "_id": -1 }).toArray();
};

exports.findsome = async (db_input, collection_input, input) => {
  const c = await getClient();
  const db = c.db(db_input);
  const collection = db.collection(collection_input);
  return await collection.find(input).limit(30000).sort({ "_id": -1 }).project({ "PO": 1, "CP": 1, "ALL_DONE": 1 }).toArray();
};

exports.findproject = async (db_input, collection_input, input1, input2) => {
  const c = await getClient();
  const db = c.db(db_input);
  const collection = db.collection(collection_input);
  return await collection.find(input1).limit(500).sort({ "_id": -1 }).project(input2).toArray();
};

exports.update = async (db_input, collection_input, input1, input2) => {
  const c = await getClient();
  const db = c.db(db_input);
  const collection = db.collection(collection_input);
  return await collection.updateOne(input1, input2);
};

exports.findSAP = async (urls, db_input, collection_input, input) => {
  // findSAP uses a custom URL — create a short-lived client for this case
  const sapClient = new MongoClient(urls, {
    maxPoolSize: 5,
    serverSelectionTimeoutMS: 5000,
  });
  await sapClient.connect();
  try {
    const db = sapClient.db(db_input);
    const collection = db.collection(collection_input);
    return await collection.find(input).limit(30000).sort({ "_id": -1 }).toArray();
  } finally {
    await sapClient.close();
  }
};
