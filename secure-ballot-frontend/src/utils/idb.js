import { openDB } from 'idb';

const DB_NAME = 'secureVote';
const STORE_NAME = 'keys';

async function initDB() {
  return await openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    },
  });
}

export async function savePrivateKey(privateKey) {
  const db = await initDB();
  await db.put(STORE_NAME, privateKey, 'privateKey');
}

export async function getPrivateKey() {
  const db = await initDB();
  return db.get(STORE_NAME, 'privateKey');
}

export async function deletePrivateKey() {
  const db = await initDB();
  return db.delete(STORE_NAME, 'privateKey');
}