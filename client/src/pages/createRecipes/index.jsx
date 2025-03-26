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
    tags: [],
    dinerNumber: 1,
    ingredients: [
      {
        name: "",
        quantity: 0,
        unit: "",
      },
    ], // Array of ingredient objects
    instructions: [""],
    imageURL: "",
    userOwner: userID,
  });

    // State to track incomplete fields
    const [incompleteFields, setIncompleteFields] = useState({
      title: false,
      type: false,
      dinerNumber: false,
      ingredients: [],
      instructions: false,
      imageURL:false,
    });

  const [currentTag, setCurrentTag] = useState(""); // Track the current tag being typed
  const predefinedTags = ["Vegetarian", "Vegan", "Gluten-Free", "Spicy"]; // Sample predefined tags

  // ??
  const navigate = useNavigate();

  // GENARAL
  // Va guardando en el setRecipe cualquier cambio que se haga en los campos del formulario
  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe({ ...recipe, [name]: value });
    
    // Clear incomplete field status when something is entered
    if (incompleteFields[name] !== undefined) {
      setIncompleteFields(prev => ({ ...prev, [name]: false }));
    }
  };

  // TAG FIELD
  // Function to handle changes in the tag input field
  const handleTagChange = (event) => {
    setCurrentTag(event.target.value);
  };

  // Function to add a tag when the user presses Enter
  const handleTagKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent form submission

      if (currentTag.trim() !== "") {
        // Avoid adding empty tags
        if (!recipe.tags.includes(currentTag.trim())) {
          // This prevents duplicate tags
          setRecipe({ ...recipe, tags: [...recipe.tags, currentTag.trim()] });
        }
        setCurrentTag(""); // Clear the input field after adding
      }
    }
  };
  // Function to remove a tag when the user clicks the "X"
  const removeTag = (index) => {
    const newTags = recipe.tags.filter((_, i) => i !== index);
    setRecipe({ ...recipe, tags: newTags });
  };
  // Function to handle suggestions (if needed)
  const filteredTags = predefinedTags.filter(
    (tag) =>
      tag.toLowerCase().includes(currentTag.toLowerCase()) &&
      !recipe.tags.includes(tag)
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

    // Clear incomplete ingredient field status
    const newIncompleteIngredients = [...incompleteFields.ingredients];
    newIncompleteIngredients[index] = false;
    setIncompleteFields(prev => ({ 
      ...prev, 
      ingredients: newIncompleteIngredients 
    }));
  };

  const handleDeleteIngredient = () => {
    if (recipe.ingredients.length > 1) {
      setRecipe((prevRecipe) => ({
        ...prevRecipe,
        ingredients: prevRecipe.ingredients.slice(0, -1)
      }));
  
      // Also update the incomplete ingredients tracking
      setIncompleteFields((prevIncomplete) => {
        const newIncompleteIngredients = [...prevIncomplete.ingredients];
        newIncompleteIngredients.pop();
        return {
          ...prevIncomplete,
          ingredients: newIncompleteIngredients
        };
      });
    }
  };

  // añade los cambios de instruction
  const handleInstructionChange = (event, index) => {
    const { value } = event.target;
    const instructions = [...recipe.instructions];
    instructions[index] = value;
    setRecipe({ ...recipe, instructions });

    // Clear instruction incomplete status
    const newIncompleteInstructions = [...incompleteFields.ingredients];
    newIncompleteInstructions[index] = false;
    setIncompleteFields(prev => ({ 
      ...prev, 
      instructions: false 
    }));
  };
  // añade un instruction vacío para que puedas modificarlo luego
  const handleAddInstruction = () => {
    const instructions = [...recipe.instructions, " "];
    setRecipe({ ...recipe, instructions });
  };

  const handleDeleteInstruction = (event) => {
    // Prevent any default form submission behavior
    event.preventDefault();
    
    if (recipe.instructions.length > 1) {
      setRecipe((prevRecipe) => {
        const updatedInstructions = prevRecipe.instructions.slice(0, -1);
        return { ...prevRecipe, instructions: updatedInstructions };
      });
  
      // Update incomplete instructions tracking
      setIncompleteFields((prevIncomplete) => ({
        ...prevIncomplete,
        instructions: recipe.instructions.length > 2 
          ? false 
          : recipe.instructions[0].trim() === ''
      }));
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
  
    // Reset incomplete fields
    const newIncompleteFields = {
      title: !recipe.title,
      type: !recipe.type,
      dinerNumber: recipe.dinerNumber <= 0,
      ingredients: recipe.ingredients.map(ingredient => 
        !ingredient.name || ingredient.quantity <= 0
      ),
      instructions: recipe.instructions.some(instruction => !instruction.trim()), 
      imageURL: !recipe.imageURL
    };
  
    setIncompleteFields(newIncompleteFields);
  
    // Check if any fields are incomplete
    const isAnyFieldIncomplete = 
      newIncompleteFields.title ||
      newIncompleteFields.type ||
      newIncompleteFields.dinerNumber ||
      newIncompleteFields.ingredients.some(Boolean) ||
      newIncompleteFields.instructions ||
      newIncompleteFields.imageURL;
  
    if (isAnyFieldIncomplete) {
      return; // Prevent form submission if validation fails
    }
  
    try {
      await axios.post("http://localhost:3001/recipes", recipe);
      alert("Recipe created!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("There was an error while submitting the recipe.");
    }
  };
  

  return (
    <div class="flex justify-center bg-white p-5">
      <div class="flex flex-col justify-center items-center p-5 bg-gray-100 rounded-md shadow-md m-5 w-[400px]">
        <h1 class="font-bold mt-0">New Recipe</h1>
        <form class="flex flex-col" onSubmit={onSubmit}>
          <br></br>

          {/* Title field */}
          <label htmlFor="title" class="mb-[5px]">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            placeholder="Type your recipe title..."
            value={recipe.title}
            onChange={handleChange}
            className={`p-2 text-base rounded-md border ${
              incompleteFields.title ? 'border-red-500' : 'border-gray-500'
            }`}
          />
          {incompleteFields.title && (
            <p className="text-red-500 text-sm mt-1">Title is required</p>
          )}
          <br />

          {/* Type field*/}
          <label htmlFor="type" class="mb-[5px]">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={recipe.type}
            onChange={handleChange}
            className={`p-2 text-base rounded-md border ${
              incompleteFields.type ? 'border-red-500' : 'border-gray-500'
            }`}
          >
            <option value="">Select a type</option>
            <option value="Main dish">Main dish</option>
            <option value="Dessert">Dessert</option>
            <option value="Appetizer">Appetizer</option>
            <option value="Drink">Drink</option>
          </select>
          {incompleteFields.type && (
            <p className="text-red-500 text-sm mt-1">Type is required</p>
          )}
          <br />

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
              <div
                key={index}
                className="bg-gray-200 text-gray-800 py-1 px-3 rounded-full flex items-center"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(index)}
                  className="ml-2 text-red-500"
                >
                  x
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
                    setRecipe({
                      ...recipe,
                      tags: [...recipe.tags, suggestedTag],
                    });
                    setCurrentTag(""); // Clear input after selecting a suggestion
                  }}
                >
                  {suggestedTag}
                </div>
              ))}
            </div>
          )}
          <br />

          {/* dinerNumber */}
          <label htmlFor="type" class="mb-[5px]">
            Number of diners
          </label>
          <input
            type="number"
            id="dinerNumber"
            name="dinerNumber"
            value={recipe.dinerNumber}
            onChange={handleChange}
            className={`p-2 text-base rounded-md border ${
              incompleteFields.dinerNumber ? 'border-red-500' : 'border-gray-500'
            }`}
          />
          {incompleteFields.dinerNumber && (
            <p className="text-red-500 text-sm mt-1">Number of diners is required</p>
          )}
          <br />

          {/* Ingredients field */}
          <label htmlFor="ingredients" class="mb-[5px]">
            Ingredients
          </label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} class="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Name"
                value={ingredient.name}
                onChange={(event) =>
                  handleIngredientChange(event, index, "name")
                }
                class="p-2 text-base rounded-md border border-gray-500"
              />
              <input
                type="number"
                placeholder="Quantity"
                value={ingredient.quantity}
                onChange={(event) =>
                  handleIngredientChange(event, index, "quantity")
                }
                class="p-2 text-base rounded-md border border-gray-500 w-20"
              />
              <input
                type="text"
                placeholder="Unit (kg, L, etc.)"
                value={ingredient.unit}
                onChange={(event) =>
                  handleIngredientChange(event, index, "unit")
                }
                class="p-2 text-base rounded-md border border-gray-500 w-20"
              />
            </div>
          ))}
          <div className="flex justify-center items-center gap-2">
            <button
              type="button"
              onClick={handleAddIngredient}
              className="px-4 py-1 text-sm font-medium rounded-lg border border-gray-400 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 shadow-sm w-auto max-w-max"
            >
              Add Ingredient
            </button>
            {recipe.ingredients.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteIngredient}
                className="px-4 py-1 text-sm font-medium rounded-lg border border-gray-400 bg-gray-300 text-gray-700 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 shadow-sm w-auto max-w-max"
              >
                Delete Ingredient
              </button>
            )}
          </div>
          {/* Notification for incomplete fields */}
          {(incompleteFields.ingredients.some(Boolean)) && (
            <p className="text-red-500 text-sm mt-1">
              Please complete all ingredient fields
            </p>
          )}
          <br />

          {/* Instructions field */}
          <label htmlFor="intruction" class="mb-[5px]">
            Instructions
          </label>
          {recipe.instructions.map((instruction, index) => (
            <div key={index} class="flex flex-col gap-2 mb-2 w-full">
              <textarea
                name="instructions"
                value={instruction}
                onChange={(event) => handleInstructionChange(event, index)}
                class="p-2 text-base rounded-md border border-gray-500 w-full resize-y"
                rows="2" // Adjust height (3 lines)
                placeholder="Write your instruction..."
              />
            </div>
          ))}
          <div className="flex justify-center items-center gap-2">
            <button
              type="button"
              onClick={handleAddInstruction}
              className="px-4 py-1 text-sm font-medium rounded-lg border border-gray-400 bg-gray-200 text-gray-700 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 shadow-sm w-auto max-w-max"
            >
              Add Instruction
            </button>
            {recipe.instructions.length > 1 && (
              <button
                type="button"
                onClick={handleDeleteInstruction}
                className="px-4 py-1 text-sm font-medium rounded-lg border border-gray-400 bg-gray-300 text-gray-700 hover:bg-gray-300 hover:border-gray-500 transition-all duration-200 shadow-sm w-auto max-w-max"
              >
                Delete Instruction
              </button>
            )}
          </div>
          {incompleteFields.instructions && (
            <p className="text-red-500 text-sm mt-1">
              Please complete all instruction fields
            </p>
          )}
          <br />

          {/* Image URL */}
          <label htmlFor="imageUrl" className="mb-[5px]">
            Image URL
          </label>
          <input
            type="text"
            id="imageURL"
            name="imageURL"
            placeholder="Copy your URL image..."
            value={recipe.imageURL}
            onChange={handleChange}
            className={`p-2 text-base rounded-md border ${
              incompleteFields.imageURL ? 'border-red-500' : 'border-gray-500'
            }`}
          />
          {incompleteFields.imageURL && (
            <p className="text-red-500 text-sm mt-1">An image is required</p>
          )}
          <br />

          {Object.values(incompleteFields).some(
            val => val === true || (Array.isArray(val) && val.some(Boolean))
          ) && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
              <strong className="font-bold">Not all fields are completed!</strong>
              <span className="block sm:inline"> Please review and fill in all required fields.</span>
            </div>
          )}
          <br />

          {/* Submit button */}
          <div class="flex justify-center items-center">
            <button
              type="submit"
              class="px-6 py-2 text-lg font-semibold rounded-lg border border-blue-500 bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:from-blue-600 hover:to-teal-500 hover:shadow-xl transition-all duration-300 w-auto max-w-max"
            >
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
