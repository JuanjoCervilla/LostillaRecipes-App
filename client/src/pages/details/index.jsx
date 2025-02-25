import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";
import { useGetUserID } from "../../hooks/useGetUserID";
import axios from "axios";

export default function Details() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  
  const userID = useGetUserID();
  
  const {
    recipeDetailsData,
    setRecipeDetailsData,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getRecipeDetails() {
      try {
        setIsLoading(true);
        const response = await fetch(`http://localhost:3001/recipes/${id}`);
        const data = await response.json();
        
        if (data) {
          setRecipeDetailsData(data);
        }
      } catch (error) {
        console.error("Failed to fetch recipe details:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getRecipeDetails();
    
    return () => {
      // Optional: Reset recipe details when component unmounts
      // setRecipeDetailsData(null);
    };
  }, [id, setRecipeDetailsData]);

  // Fetch saved recipes whenever the component mounts or userID changes
  useEffect(() => {
    const fetchSavedRecipes = async () => {
      if (!userID) return;
      
      try {
        const response = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        console.log("Fetched saved recipes:", response.data);
        setSavedRecipes(response.data.savedRecipes || []);
      } catch (err) {
        console.error("Error fetching saved recipes:", err);
        setSavedRecipes([]);
      }
    };

    fetchSavedRecipes();
  }, [userID]);

  const toggleSaveRecipe = async(recipeID) => {
    if (!userID || !recipeID || isSaving) return;
    
    try {
      setIsSaving(true);
      console.log(`Toggling save status for recipe ${recipeID}`);
      
      const response = await axios.put("http://localhost:3001/recipes", {
        recipeID, 
        userID
      });
      
      console.log("Toggle response:", response.data);
      
      if (response.data && Array.isArray(response.data.savedRecipes)) {
        setSavedRecipes(response.data.savedRecipes);
      } else {
        // Fallback if response format is unexpected
        const updatedResponse = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(updatedResponse.data.savedRecipes || []);
      }
    } catch (err) {
      console.error("Error toggling recipe save status:", err);
      // Refresh saved recipes list on error to ensure UI state is correct
      try {
        const refreshResponse = await axios.get(
          `http://localhost:3001/recipes/savedRecipes/ids/${userID}`
        );
        setSavedRecipes(refreshResponse.data.savedRecipes || []);
      } catch (refreshErr) {
        console.error("Failed to refresh saved recipes:", refreshErr);
      }
    } finally {
      setIsSaving(false);
    }
  };

  // Determine if the current recipe is saved
  const isRecipeSaved = Boolean(
    savedRecipes && 
    Array.isArray(savedRecipes) && 
    recipeDetailsData && 
    recipeDetailsData._id &&
    savedRecipes.includes(recipeDetailsData._id)
  );

  if (isLoading) {
    return (
      <div className="container mx-auto py-20 text-center">
        <div className="animate-pulse text-xl font-medium">Loading recipe...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      {/* Image */}
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group shadow-lg">
          {recipeDetailsData?.imageURL ? (
            <img
              src={recipeDetailsData.imageURL}
              className="w-full h-full object-cover block group-hover:scale-105 duration-300"
              alt={recipeDetailsData.title || "Recipe visualization"}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex flex-col gap-5">
        {/* Recipe's title */}
        <h1 className="font-bold text-3xl text-black">
          {recipeDetailsData?.title}
        </h1>
        
        {/* Recipe's metadata */}
        <div className="flex flex-wrap gap-2">
          {recipeDetailsData?.type && (
            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full text-sm font-medium">
              {recipeDetailsData.type}
            </span>
          )}
          
          {recipeDetailsData?.tags?.map((tag, index) => (
            <span key={index} className="px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">
              {tag}
            </span>
          ))}
        </div>
        
        {/* Button Save Recipe */}
        <div className="mt-2">
          <button
            onClick={() => toggleSaveRecipe(recipeDetailsData?._id)}
            disabled={isSaving}
            className={`px-6 py-3 rounded-lg text-sm uppercase font-medium tracking-wider shadow-md transition-all duration-200 ${
              isRecipeSaved
                ? "bg-red-500 hover:bg-red-600 text-white" 
                : "bg-black hover:bg-gray-800 text-white"
            } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSaving ? (
              <span>Processing...</span>
            ) : isRecipeSaved ? (
              "Remove from saved"
            ) : (
              "Save recipe"
            )}
          </button>
        </div>
        
        {/* Instructions */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-black border-b border-gray-200 pb-2">
            Instructions
          </h2>
          <div className="mt-4">
            {recipeDetailsData?.instructions?.length > 0 ? (
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                {recipeDetailsData.instructions.map((instruction, index) => (
                  <li key={index} className="pl-2">
                    <span className="font-medium text-black">Step {index + 1}:</span>{" "}
                    {instruction}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-500 italic">No instructions available</p>
            )}
          </div>
        </div>
        
        {/* Ingredients */}
        <div className="mt-4">
          <h2 className="text-2xl font-semibold text-black border-b border-gray-200 pb-2">
            Ingredients
          </h2>
          <div className="mt-4">
            {Array.isArray(recipeDetailsData?.ingredients) && recipeDetailsData.ingredients.length > 0 ? (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {recipeDetailsData.ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500 flex-shrink-0"></span>
                    <span className="text-gray-700">
                      <span className="font-medium">{ingredient.name}</span>
                      {ingredient.quantity && ingredient.unit ? (
                        <span> - {ingredient.quantity} {ingredient.unit}</span>
                      ) : null}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No ingredients available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}