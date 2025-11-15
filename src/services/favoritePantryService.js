import { collection , doc , addDoc , updateDoc , deleteDoc , serverTimestamp, query, onSnapshot  } from "firebase/firestore";
import { db } from "./firebase";

export const addFavoriteRecipe = (userId , recipeData)=>{
    const favoriteCollRef = collection(db , 'users' , userId , 'favorites')
    return addDoc(favoriteCollRef , {
        ...recipeData,
        isCooked : false,
        createdAt : serverTimestamp()
    })
}

export const getFavoriteRecipe = (userId , callback) =>{
    // Used to Read All data in favorites collection
    const favoritesCollectionRef = collection(db, 'users', userId, 'favorites');
    const q = query(favoritesCollectionRef)
    // Gives realTime data
    return onSnapshot(q , (snapshot) =>{
        const favorite = []
        snapshot.forEach(favItemDoc => {
            favorite.push({
                id : favItemDoc.id ,
                ...favItemDoc.data()
            })
        });
        // ye callback we pass to get the data from favorite = [] jo ye snapshot ne diya
        callback(favorite)
    })

}

export const removeFavoriteRecipe = ( userId , favoriteId) =>{
    const docRef = doc(db , 'users' ,userId ,'favorites',favoriteId)
    return deleteDoc(docRef)
}
