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
    type: "",
    tags : [],
    dinerNumber: 1,
    ingredients: [
      {
        name: "",
        quantity: 0,
        unit: "",
      },
    ], // Array of ingredient objects
    instructions: [],
    imageURL: "",
    userOwner: userID,
  });

  // ??
  const navigate = useNavigate()

  const [currentTag, setCurrentTag] = useState(""); // Track the current tag being typed
  const predefinedTags = ["Vegetarian", "Vegan", "Gluten-Free", "Spicy", "Dessert"]; // Sample predefined tags

  // Va guardando en el setRecipe cualquier cambio que se haga en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
    console.log(recipe)
  };

  // Function to handle changes in the tag input field
  const handleTagChange = (event) => {
    setCurrentTag(event.target.value);
  };
  // Function to add a tag when the user presses Enter
  const handleTagKeyDown = (event) => {
    if (event.key === "Enter" && currentTag.trim() !== "") {
      // Avoid adding empty tags
      if (!recipe.tags.includes(currentTag.trim())) {
        setRecipe({ ...recipe, tags: [...recipe.tags, currentTag.trim()] });
      }
      setCurrentTag(""); // Clear the input field after adding
    }
  };
  // Function to remove a tag when the user clicks the "X"
  const removeTag = (index) => {
    const newTags = recipe.tags.filter((_, i) => i !== index);
    setRecipe({ ...recipe, tags: newTags });
  };
  // Function to handle suggestions (if needed)
  const filteredTags = predefinedTags.filter((tag) =>
    tag.toLowerCase().includes(currentTag.toLowerCase()) && !recipe.tags.includes(tag)
  );
  

  // Adds a new empty ingredient to the ingredients array
  const handleAddIngredient = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [
        ...prevRecipe.ingredients,
        { name: "", quantity: 0, unit: "" },
      ],
    }));
  };
  // Handles changes in ingredient fields (name, quantity, unit)
  const handleIngredientChange = (event, index, field) => {
    const { value } = event.target;
    setRecipe((prevRecipe) => {
      const updatedIngredients = [...prevRecipe.ingredients];
      updatedIngredients[index] = {
        ...updatedIngredients[index],
        [field]: value,
      };
      return { ...prevRecipe, ingredients: updatedIngredients };
    });
  };

  // añade los cambios de instruction
  const handleInstructionChange = (event, index) => {
    const { value } = event.target;
    const instructions = [...recipe.instructions];
    instructions[index] = value;
    setRecipe({ ...recipe, instructions });
  };
  // añade un instruction vacío para que puedas modificarlo luego
  const handleAddInstruction = () => {
    const instructions = [...recipe.instructions, ""];
    setRecipe({ ...recipe, instructions });
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

      {/* Title field */}
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

      {/* Type field*/}
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

        {/* Tags field */}
          <label htmlFor="tags" className="mb-[5px]">
            Tags
          </label>

          {/* Tag input field */}
          <input
            type="text"
            value={currentTag}
            onChange={handleTagChange}
            onKeyDown={handleTagKeyDown}
            className="p-2 text-base rounded-md border border-gray-500"
            placeholder="Type a tag and press Enter"
          />

          {/* Display added tags */}
          <div className="flex gap-2 mt-2">
            {recipe.tags.map((tag, index) => (
              <div key={index} className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full flex items-center">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-red-500"
                >
                  X
                </button>
              </div>
            ))}
          </div>

          {/* Show suggested tags */}
          {currentTag && filteredTags.length > 0 && (
            <div className="mt-2 border border-gray-300 rounded-md bg-white shadow-md">
              {filteredTags.map((suggestedTag, index) => (
                <div
                  key={index}
                  className="p-2 cursor-pointer hover:bg-gray-200"
                  onClick={() => {
                    setRecipe({ ...recipe, tags: [...recipe.tags, suggestedTag] });
                    setCurrentTag(""); // Clear input after selecting a suggestion
                  }}
                >
                  {suggestedTag}
                </div>
              ))}
            </div>
          )}

        {/* <label htmlFor="tags"  class="mb-[5px]">Tags</label>
        {recipe.tags.map((tag, index) => (
          <div key={index} className="flex items-center gap-2 mb-2">
            <input
              type="text"
              name="tags"
              value={tag}
              onChange={(event) => handleTagChange(event, index)}
              className="p-2 text-base rounded-md border border-gray-500 w-[90%]"
            />
            <button
              type="button"
              onClick={() => removeTag(index)}
              className="bg-red-500 text-white p-1 rounded-full"
            >
              X
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddTag}
          className="p-2 text-base rounded-md border border-gray-500 bg-[#dcdcdc] text-black"
        >
          Add Tag
        </button>
        <br></br> */}

      {/* dinerNumber */}
       <label htmlFor="type"  class="mb-[5px]">Number of diners</label>
        <input
          type="number"
          id="dinerNumber"
          name="dinerNumber"
          value={recipe.dinerNumber}
          onChange={handleChange}
          class="p-2 text-base rounded-md border border-gray-500"
        />
        <br></br>

        {/* Ingredients field */}
        <label htmlFor="ingredients" class="mb-[5px]">Ingredients</label>
        {recipe.ingredients.map((ingredient, index) => (
          <div key={index} class="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Name"
              value={ingredient.name}
              onChange={(event) => handleIngredientChange(event, index, "name")}
              class="p-2 text-base rounded-md border border-gray-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(event) => handleIngredientChange(event, index, "quantity")}
              class="p-2 text-base rounded-md border border-gray-500 w-20"
            />
            <input
              type="text"
              placeholder="Unit (kg, L, etc.)"
              value={ingredient.unit}
              onChange={(event) => handleIngredientChange(event, index, "unit")}
              class="p-2 text-base rounded-md border border-gray-500 w-20"
            />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddIngredient}
          class="p-2 text-base rounded-md border border-gray-500 bg-[#dcdcdc] text-black"
        >
          Add Ingredient
        </button>

        {/* Instructions field */}
        <label htmlFor="intruction"  class="mb-[5px]">Instructions</label>
        {recipe.instructions.map((instruction, index) => (
          <input
            key={index}
            type="text"
            name="instructions"
            value={instruction}
            onChange={(event) => handleInstructionChange(event, index)}
            class="p-2 text-base rounded-md border border-gray-500"
          />
        ))}
        <button type="button" onClick={handleAddInstruction} class="p-2 text-base rounded-md border border-gray-500  bg-[#dcdcdc] text-black">
          Add Instruction
        </button>
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
