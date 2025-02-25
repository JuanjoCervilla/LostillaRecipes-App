import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {

  // The useParams hook in React Router is used to access URL parameters inside a React component.
  const { id } = useParams();

  const {
    recipeDetailsData,
    setRecipeDetailsData,
    planningList,
    handleAddToPlanning,
  } = useContext(GlobalContext);

  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(
        `http://localhost:3001/recipes/${id}` 
      );

      const data = await response.json();

      if (data) {
        setRecipeDetailsData(data);
      }
    }
    getRecipeDetails();
  }, []);


  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">

      {/* Image */}
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={recipeDetailsData?.imageURL}
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
            alt = "Recipe visualization"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">

        {/* Recipe's title */}
        <h1 className="font-bold text-2xl truncate text-black">
          {recipeDetailsData?.title}
        </h1>

        {/* Recipe's type */}
        <span className="text-sm text-cyan-700 font-medium">
          {recipeDetailsData?.type}
        </span>

        {/* Recipe's tags */}
        <span className="text-sm text-orange-700 font-medium">
          {recipeDetailsData?.tags?.join(" - ")}
        </span>
        
        {/* Button Save Recipe */}
        <div>
          <button
            onClick={() => handleAddToPlanning(recipeDetailsData?.recipe)}
            className="p-3 px-8 rounded-lg text-sm uppercase font-medium tracking-wider mt-3 inline-block shadow-md bg-black text-white"
          >
            {planningList &&
            planningList.length > 0 &&
            planningList.findIndex(
              (item) => item._id === recipeDetailsData?._id
            ) !== -1
              ? "Remove from saved"
              : "Save recipe"}
          </button>
        </div>
        <br />

        {/* Instructions */}
        <div>
          <span className="text-2xl font-semibold text-black">
            Instructions:
          </span>
          <div className="mt-3">
            <ol className="list-decimal list-inside text-sm text-700 font-medium">
              {recipeDetailsData?.instructions?.map((instruction, index) => (
                <li key={index}>{instruction}</li>
              ))}
            </ol>
          </div>
        </div>
        <br />

        {/* Ingredients */}
        <div>
          <span className="text-2xl font-semibold text-black">Ingredients:</span>
          <div className="mt-3">
            <ul className="list-disc pl-5 flex flex-col gap-3">
              {Array.isArray(recipeDetailsData?.ingredients) && recipeDetailsData.ingredients.length > 0 ? (
                recipeDetailsData.ingredients.map((ingredient, index) => (
                  <li key={index} className="text-sm text-700 font-medium">{ingredient.name} - {ingredient.quantity} {ingredient.unit} </li>
                ))
              ) : (
                <li>
                  <span className="text-sm text-gray-600">No ingredients available</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        
      </div>
    </div>
  );
}
