import React, { createContext, useContext, useEffect, useState } from 'react'
import { useAuthData } from '../context/AuthContext';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../services/firebase';
import { toast } from 'react-toastify';
const PantryContext = createContext()
export const usePantry = () => useContext(PantryContext)

export function PantryProvider({ children }) {
  const [item, setItem] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser } = useAuthData()
  useEffect(() => {
    if (!currentUser) {
      setItem([])
      setLoading(false)
      return
    }
    setLoading(true)

    const collectionRef = collection(db, 'pantry')
    const qry = query(collectionRef, where('userID', '==', currentUser.uid))

    // so basically ye listner hai jo automatic run hoga whenever  collection chnges
    // thats the reason we put him inside context read kr rahe hai docs ko 

    // Snapshot ye basically contain all data in array where doc.id id hai auto generated one 
    // doc.data() have all other stuff that we have in form 
    const unSubscribe = onSnapshot(qry, (snapshot) => {
      const pantryItem = []
      snapshot.forEach(doc => {
        pantryItem.push({
          id: doc.id,
          ...doc.data()
        })
      })
      // console.log(pantryItem)
      setItem(pantryItem);
      setLoading(false);
    },
      (error) => {
        toast.error("Error in Getting the data")
        setLoading(false)
      }
    )
    // cleaning the listner
    return () => unSubscribe()
  }, [currentUser])
  const value = {
    item,
    loading
  }
  return (
  <PantryContext.Provider value={value}>
    {children}
  </PantryContext.Provider>
  )
}
