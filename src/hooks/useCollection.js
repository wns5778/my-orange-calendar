import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc
} from 'firebase/firestore'
import { db } from '../firebase'

// Realtime-synced Firestore collection scoped to users/{uid}/{name}
export function useCollection(uid, name, orderField) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!db || !uid) {
      setItems([])
      setLoading(false)
      return
    }
    const ref = collection(db, 'users', uid, name)
    const q = orderField ? query(ref, orderBy(orderField)) : query(ref)
    const unsub = onSnapshot(q, (snap) => {
      setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
      setLoading(false)
    })
    return unsub
  }, [uid, name, orderField])

  async function add(data) {
    const ref = collection(db, 'users', uid, name)
    return addDoc(ref, data)
  }

  async function update(id, data) {
    const ref = doc(db, 'users', uid, name, id)
    return updateDoc(ref, data)
  }

  async function remove(id) {
    const ref = doc(db, 'users', uid, name, id)
    return deleteDoc(ref)
  }

  return { items, loading, add, update, remove }
}
