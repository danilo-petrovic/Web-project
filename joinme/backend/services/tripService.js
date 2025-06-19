async function getAllTrips(db) {
  const snapshot = await db.collection("trips").get();
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

async function getTripById(db, id) {
  const doc = await db.collection("trips").doc(id).get();
  return doc.exists ? { id: doc.id, ...doc.data() } : null;
}

async function createTrip(db, tripData) {
  const newRef = await db.collection("trips").add({ ...tripData, joined: [] });
  return newRef.id;
}

async function updateTrip(db, id, data) {
  await db.collection("trips").doc(id).update(data);
}

async function deleteTrip(db, id) {
  await db.collection("trips").doc(id).delete();
}

async function joinTrip(db, id, userId, nickname) {
  const docRef = db.collection("trips").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return "not_found";

  const trip = doc.data();
  if (trip.joined?.some(u => u.userId === userId)) return "already_joined";

  const updated = [...(trip.joined || []), { userId, nickname }];
  await docRef.update({ joined: updated });
  return "joined";
}

async function leaveTrip(db, id, userId) {
  const docRef = db.collection("trips").doc(id);
  const doc = await docRef.get();
  if (!doc.exists) return false;

  const trip = doc.data();
  const filtered = (trip.joined || []).filter(u => u.userId !== userId);
  await docRef.update({ joined: filtered });
  return true;
}

module.exports = {
  getAllTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  joinTrip,
  leaveTrip,
};
