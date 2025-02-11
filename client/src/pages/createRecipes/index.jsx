import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";

export default function CreateRecipes() {

  const userID = useGetUserID();

  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    imageURL: "",
    type: "",
    userOwner: userID,
  });

  const navigate = useNavigate()
  
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
    console.log(recipe)
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  const onSubmit = async (event) => {
    event.preventDefault()
    try{
        await axios.post("http://localhost:3001/recipes", recipe);
        alert("Recipe created ")
        navigate("/")
    } catch(err){
        console.error(err);
    }
  }


  return (
    <div class="flex flex-col justify-center items-center p-5 bg-white rounded-md shadow-md m-5 w-[400px]">
    <h2 class="mt-0">Create Recipe</h2>
    <form class="flex flex-col" onSubmit={onSubmit} >
      <label htmlFor="title"  class="font-bold mb-[5px]">Title</label>
      <input
        type="text"
        id="title"
        name="title"
        value={recipe.title}
        onChange={handleChange}
        class="p-2 text-base rounded-md border border-gray-500"
      />
    <label htmlFor="type"  class="font-bold mb-[5px]">Type</label>
      <input
        type="text"
        id="type"
        name="type"
        value={recipe.type}
        onChange={handleChange}
        class="p-2 text-base rounded-md border border-gray-500"
      />
      <label htmlFor="ingredients"  class="font-bold mb-[5px]">Ingredients</label>
      {recipe.ingredients.map((ingredient, index) => (
        <input
          key={index}
          type="text"
          name="ingredients"
          value={ingredient}
          onChange={(event) => handleIngredientChange(event, index)}
          class="p-2 text-base rounded-md border border-gray-500"
        />
      ))}
      <button type="button" onClick={handleAddIngredient} class="p-2 text-base rounded-md border border-gray-500  bg-[#9c9c9c] text-black">
        Add Ingredient
      </button>
      <label htmlFor="instructions"  class="font-bold mb-[5px]">Instructions</label>
      <textarea
        id="instructions"
        name="instructions"
        value={recipe.instructions}
        onChange={handleChange}
        class="p-2 text-base rounded-md border border-gray-500"
      ></textarea>
      <label htmlFor="imageUrl"  class="font-bold mb-[5px]">Image URL</label>
      <input
        type="text"
        id="imageURL"
        name="imageURL"
        value={recipe.imageURL}
        onChange={handleChange}
        class="p-2 text-base rounded-md border border-gray-500"
      />
      <br></br>
      <button type="submit" class="p-2 text-base rounded-md border border-gray-500  bg-[#9c9c9c] text-black">Create Recipe</button>
    </form>
  </div>

    
  );
}
