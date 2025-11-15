import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuthData } from "./AuthContext";
import { getFavoriteRecipe } from "../services/favoritePantryService";

const FavoritesContext = createContext()

export function useFavorites() {
  return useContext(FavoritesContext)
}

export function FavoriteProvider({ children }) {
  const [favorites, setFavorites] = useState([])
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuthData()

  useEffect(() => {
    if (!currentUser) {
      setLoading(false)
      setFavorites([])
      return
    }
    setLoading(true)
    const unsubscribe = getFavoriteRecipe(currentUser.uid, (favoriteData) => {
      setFavorites(favoriteData)
      setLoading(false)
    })

    return () => unsubscribe();
  }, [currentUser])

  // isse Chk karunga ki kya recipeItem already present hai kya in favorite in Recipe.jsx
  // here we simply adding the Recipe Item in Map like "Pasta" → "Fm34jf923kdfadf"
  const favoriteIdMap = useMemo(() => {
    return new Map(favorites.map((favoriteItem) => [favoriteItem.title, favoriteItem.id]))
  }, [favorites])

  // favorites so iske pass id hai iska and wahi ID map kiya with TITLE
  const value = {
    favorites,
    loading,
    favoriteIdMap,
  };

  return <FavoritesContext.Provider value={value}>
    {children}
  </FavoritesContext.Provider>
}