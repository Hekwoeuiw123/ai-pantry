import { toast } from "react-toastify"
import { db } from "./firebase"
import { collection, addDoc, deleteDoc, doc, updateDoc, serverTimestamp, writeBatch } from "firebase/firestore"

export const pantryCollectionRef = collection(db, "pantry")

export const addPantryItem = async (item) => {
     // if new Date() dala hota to current time aajata jo user ke device me hai 
     // but if user ka device me wrong time set hai to issue aajata 
     // isliye serverTimestamp use kar rahe hai jo firebase server se time lega
     return addDoc(pantryCollectionRef, {
          ...item,
          createdAt: serverTimestamp()
     })
}

export const updatePantryItem = async (itemId, updatedData) => {
     const docRef = doc(db, "pantry", itemId)
     return updateDoc(docRef, updatedData)
}

export const deletePantryItem = async (itemId) => {
     const docRef = doc(db, "pantry", itemId)
     return deleteDoc(docRef)
}

function parseQuantity(q) {
  if (!q) return 0;

  // take first part before comma: "1/2, cubed" → "1/2"
  let main = q.split(",")[0].trim();

  // if it contains a fraction like "1/2"
  if (main.includes("/")) {
    const [num, den] = main.split("/").map(Number);
    if (!isNaN(num) && !isNaN(den)) {
      return num / den;
    }
  }

  // remove all letters (g, tbsp, kg, ml etc)
  let numeric = main.replace(/[a-zA-Z]/g, "").trim();

  // if it's still not a number, return 1 (default)
  const value = parseFloat(numeric);
  return isNaN(value) ? 1 : value;
}


export const updatePantryAfterCooking = async (userId, pantryItems, recipeIngredients) => {
     // so bahut se update sath me krne ho to hum ek batch ban skte hai and un sbko
     // combine krke ek sath update kr skte hai in one transaction
     const batch = writeBatch(db)

     for (let recipeIng of recipeIngredients) {
          //Clean the recipe ingredient name (e.g., "Chicken Breast (diced)" -> "chicken breast")
          const cleanedRecipeName = recipeIng.item.toLowerCase().split('(')[0].trim()
          // so find mujhe first matching item  joki db me hoga  to item in ingredient wo dega
          // and here we returing one whole Recipeitem 
          const pantryMatch = pantryItems.find((pantryItem) =>
               pantryItem.name.toLowerCase().includes(cleanedRecipeName)
          )
          
          if (pantryMatch) {
               const recipeQty = parseQuantity(recipeIng.quantity);
               const newQuantity = pantryMatch.quantity - recipeQty
               console.log(cleanedRecipeName , pantryMatch.quantity,newQuantity)
               const itemDoc = doc(db, 'pantry', pantryMatch.id);
               if(newQuantity <= 0){
                   batch.delete(itemDoc)
               }
               else{
                    batch.update(itemDoc , {quantity : newQuantity})
               }
               
          }
     }
     await batch.commit();
}