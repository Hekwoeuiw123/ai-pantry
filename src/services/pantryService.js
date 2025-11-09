import { db } from "./firebase"
import { collection,addDoc,deleteDoc,doc,updateDoc, serverTimestamp } from "firebase/firestore"

export const pantryCollectionRef = collection(db,"pantry")

export const addPantryItem = async (item) => {
     // if new Date() dala hota to current time aajata jo user ke device me hai 
     // but if user ka device me wrong time set hai to issue aajata 
     // isliye serverTimestamp use kar rahe hai jo firebase server se time lega
     return addDoc(pantryCollectionRef,{
          ...item,
          createdAt: serverTimestamp()
     })
}

export const updatePantryItem = async (itemId,updatedData) => {
     const docRef = doc(db ,"pantry",itemId)
     return updateDoc(docRef,updatedData)
}

export const deletePantryItem = async (itemId) => {
     const docRef = doc(db ,"pantry",itemId)
     return deleteDoc(docRef)
}

