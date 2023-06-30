//firebase has its own backend structure, so it
//has to be filtered if we want to see objects like we use to
export default function filterFirebaseData(data) {
  return data.docs.map((doc) => ({
    ...doc.data(),
    id: doc.id,
  }));
}
