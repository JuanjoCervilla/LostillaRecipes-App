import { useState } from "react";
import axios from "axios";
import { useGetUserID } from "../../hooks/useGetUserID";
import { useNavigate } from "react-router-dom";

export default function CreateRecipes() {

  // Posible supresión : consigue el UserID de localStorage
  const userID = useGetUserID();

  // variable para crear nueva receta
  const [recipe, setRecipe] = useState({
    title: "",
    ingredients: [],
    instructions: "",
    imageURL: "",
    type: "",
    userOwner: userID,
  });

  // ??
  const navigate = useNavigate()
  
  // Va guardando en el setRecipe cualquier cambio que se haga en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
    console.log(recipe)
  };

  // añade los cambios de ingredientes
  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe({ ...recipe, ingredients });
  };

  // añade un ingrediente vacío para que puedas modificarlo luego
  const handleAddIngredient = () => {
    const ingredients = [...recipe.ingredients, ""];
    setRecipe({ ...recipe, ingredients });
  };

  // onSubmit button
  const onSubmit = async (event) => {
    event.preventDefault()
    try{
        await axios.post("http://localhost:3001/recipes", recipe); // se lanza el post de la API cuando clicas en el botón de create recipes
        alert("Recipe created ")  // sale una alerta cuando la receta es añadida a la base de datos
        navigate("/") // acto seguido te envía a la página de inicio
    } catch(err){
        console.error(err);
    }
  }
  
  return (
  <div class="flex justify-center bg-gray-100 p-5">   
    <div class="flex flex-col justify-center items-center p-5 bg-white rounded-md shadow-md m-5 w-[400px]">
      <h2 class="font-bold mt-0">Create Recipe</h2>
      <form class="flex flex-col" onSubmit={onSubmit} >
      <br></br>

      {/* Title */}
        <label htmlFor="title"  class="mb-[5px]">Title</label>
        <input
          type="text"
          id="title"
          name="title"
          value={recipe.title}
          onChange={handleChange}
          class="p-2 text-base rounded-md border border-gray-500"
        />
        <br></br>

      {/* Type */}
      <label htmlFor="type"  class="mb-[5px]">Type</label>
        <input
          type="text"
          id="type"
          name="type"
          value={recipe.type}
          onChange={handleChange}
          class="p-2 text-base rounded-md border border-gray-500"
        />
        <br></br>

        {/* Ingredients field */}
        <label htmlFor="ingredients"  class="mb-[5px]">Ingredients</label>
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
        <button type="button" onClick={handleAddIngredient} class="p-2 text-base rounded-md border border-gray-500  bg-[#dcdcdc] text-black">
          Add Ingredient
        </button>
        <br></br>

        {/* Instructions */}
        <label htmlFor="instructions"  class="mb-[5px]">Instructions</label>
        <textarea
          id="instructions"
          name="instructions"
          value={recipe.instructions}
          onChange={handleChange}
          class="p-2 text-base rounded-md border border-gray-500"
        ></textarea>
        <br></br>

        {/* Image URL */}
        <label htmlFor="imageUrl"  class="mb-[5px]">Image URL</label>
        <input
          type="text"
          id="imageURL"
          name="imageURL"
          value={recipe.imageURL}
          onChange={handleChange}
          class="p-2 text-base rounded-md border border-gray-500"
        />
        <br></br>
        <br></br>

        {/* Submit button */}
        <button type="submit" class="p-2 text-base rounded-md border border-gray-500  bg-[#9c9c9c] text-black">Create Recipe</button>
      </form>
    </div>
  </div>  
  );
}
