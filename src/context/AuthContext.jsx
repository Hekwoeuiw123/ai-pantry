import { createContext, useContext, useState,useEffect } from "react";
import { signInWithEmail, signInWithGoogle, signOutUser, signUpWithEmail } from "../hooks/useAuth";
import { InfinitySpin } from 'react-loader-spinner'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const AuthContext = createContext()

// Context data that will we use over application
export const useAuthData = () => useContext(AuthContext)

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null)
    const [loading, setLoading] = useState(true)

    // The Firebase listener that return cancle function for that listner
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false); // once we got the Ans of ( null or user data ) then load = false
        });
        return () => { unsubscribe() };  // Canceling previous listner
    }, []);

    // Data that will used globally
    const value = {
        currentUser,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signOutUser
    }

    // I used Children Pattern of react Here ...
    return (<AuthContext.Provider value={value} >
        {/* If i used Loading here then i dont need to use in some other pages */}
        {children}
        {/* {loading ? <InfinitySpin width="200" height="100" color="#07d104ff" /> : children} */}
    </AuthContext.Provider>)
}