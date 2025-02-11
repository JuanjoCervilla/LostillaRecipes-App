import { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../../context";

export default function Details() {
  const { id } = useParams();
  const {
    recipeDetailsData,
    setRecipeDetailsData,
    planningList,
    handleAddToPlanning,
  } = useContext(GlobalContext);
 

  console.log(recipeDetailsData)
  useEffect(() => {
    async function getRecipeDetails() {
      const response = await fetch(
        `http://localhost:3001/recipes/${id}` 
      );
      const data = await response.json();
      console.log(data)

      if (data) {
        setRecipeDetailsData(data);
      }
    }
    getRecipeDetails();
  }, []);

  console.log(recipeDetailsData?.ingredients)

  return (
    <div className="container mx-auto py-10 grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="row-start-2 lg:row-start-auto">
        <div className="h-96 overflow-hidden rounded-xl group">
          <img
            src={recipeDetailsData?.imageURL}
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-sm text-cyan-700 font-medium">
          {recipeDetailsData?.type}
        </span>
        <h3 className="font-bold text-2xl truncate text-black">
          {recipeDetailsData?.title}
        </h3>
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
              ? "Remove from planning"
              : "Add to planning"}
          </button>
        </div>
        <br />
        <div>
          <span className="text-2xl font-semibold text-black">
            Instructions:
          </span> <br></br>
          <span className="text-sm text-black-700 font-medium">
          {recipeDetailsData?.instructions}
        </span>
        </div>
        <br />
        <div>
          <span className="text-2xl font-semibold text-black">
            Ingredients:
          </span>
          <ul className="flex flex-col gap-3">
            {Array.isArray(recipeDetailsData?.ingredients) ? (
              recipeDetailsData.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className="text-sm font-medium text-black">{ingredient}</span>
                </li>
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
  );
}
