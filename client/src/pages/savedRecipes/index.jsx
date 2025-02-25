import { useEffect, useState } from "react";
import RecipeItem from "../../components/recipe-list";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";

export default function SavedRecipes() {

  const [savedRecipes, setSavedRecipes] = useState([]);
  const userID = useGetUserID();

  useEffect(() => {
    const fetchSavedRecipes = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/${userID}`
        );
        setSavedRecipes(response.data.savedRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  
    return (
      // Muestra todas la lista de card si hay contenido en recipeList
      <div className="py-8 container mx-auto flex flex-wrap justify-center gap-10">
        {savedRecipes && savedRecipes.length > 0 ? (
          savedRecipes.map((item) => <RecipeItem item={item} />)
        ) : (
          <div>
            <p className="lg:text-4x1 text-xl text-center text-black font-extrabold">
              Nothing to show. Please search something
            </p>
          </div>
        )}
      </div>
    );
}
