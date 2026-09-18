// src/repositories/user.repository.js
import { db } from '../config/firebaseAdmin.js';

const collection = db.collection('users');

export const userRepository = {
  async findById(uid) {
    const doc = await collection.doc(uid).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  },

  async create(uid, data) {
    const userData = { ...data, createdAt: new Date().toISOString() };
    await collection.doc(uid).set(userData);
    return { id: uid, ...userData };
  },

  async update(uid, data) {
    await collection.doc(uid).update(data);
    const doc = await collection.doc(uid).get();
    return { id: doc.id, ...doc.data() };
  }
};