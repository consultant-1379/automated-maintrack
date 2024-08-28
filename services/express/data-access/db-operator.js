function makeDb({ dbConnector, Id }) {
  async function findAll(collection) {
    const db = await dbConnector();
    const result = await db.collection(collection).find({});
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  }

  async function findById(entityId, collection) {
    const db = await dbConnector();
    const result = await db.collection(collection).find({ _id: entityId });
    return (await result.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  }

  async function findBySearchQuery(searchCriteria, collection) {
    const db = await dbConnector();
    const searchResults = await db.collection(collection).find(searchCriteria);
    return (await searchResults.toArray()).map(({ _id: id, ...found }) => ({
      id,
      ...found,
    }));
  }

  async function insert({ id: _id = Id.makeId(), ...entityInfo }, collection) {
    const db = await dbConnector();
    const result = await db
      .collection(collection)
      .insertOne({ _id, ...entityInfo });
    const { _id: id, ...insertedInfo } = result.ops[0];
    return { id, ...insertedInfo };
  }

  async function update({ id: _id, ...entityInfo }, collection) {
    const db = await dbConnector();
    const result = await db
      .collection(collection)
      .updateOne({ _id }, { $set: { ...entityInfo } });
    return result.modifiedCount > 0 ? { id: _id, ...entityInfo } : null;
  }

  async function remove({ id: _id }, collection) {
    const db = await dbConnector();
    const result = await db.collection(collection).deleteOne({ _id });
    return result.deletedCount;
  }

  async function dropCollection(collection) {
    if (process.env.NODE_ENV !== 'PROD' && process.env.NODE_ENV !== 'STAG') {
      const db = await dbConnector();
      const collections = await db.listCollections().toArray();
      for (const dbCollection of collections) {
        if (dbCollection.name === collection) {
          const result = await db.dropCollection(collection);
          return result;
        }
      }
    }
    return false;
  }

  return Object.freeze({
    findAll,
    findById,
    findBySearchQuery,
    insert,
    remove,
    update,
    dropCollection,
  });
}

module.exports = { makeDb };
