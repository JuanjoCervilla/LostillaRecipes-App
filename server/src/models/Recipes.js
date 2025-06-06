import mongoose from "mongoose";

//Schema is an object to define the structure of our data
const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, 
  tags : [{ type: String, required: true }], // array of strings
  dinerNumber : { type: Number, required: true }, 
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      unit: { type: String, required: true },
    },
  ],
  instructions: [{ type: String, required: true }], // array of strings
  imageURL: { type: String, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

// Important to know : we have the database recipes and we have some collections. In our case, we have recipes and users
// Entonces aquí creamos la collection siguiendo la estructura del schema
export const RecipeModel = mongoose.model("recipes", RecipeSchema);
