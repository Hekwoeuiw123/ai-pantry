import React, { useContext } from 'react'
import { auth } from '../services/firebase'
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth'

function useAuth() {
    const signUpWithEmail = (email, pass) => {
        return createUserWithEmailAndPassword(auth, email, pass)
    }
    const signInWithEmail = (email, pass) => {
        return signInWithEmailAndPassword(auth, email, pass)
    }
    const signInWithGoogle = () => {
        const provider = new GoogleAuthProvider();
        return signInWithPopup(auth, provider)
    }
    const signOutUser = () => {
        return signOut(auth)
    }

    return {signUpWithEmail ,signInWithEmail ,signInWithGoogle ,signOutUser}
}

export const {signUpWithEmail ,signInWithEmail ,signInWithGoogle ,signOutUser} =  useAuth()
