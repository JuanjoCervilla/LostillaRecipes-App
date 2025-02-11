import mongoose from "mongoose";

//Schema is an object to define the structure of our data
const RecipeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String, required: true }],
  instructions: { type: String, required: true },
  imageURL: { type: String, required: true },
  type: { type: String, required: true },
  userOwner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
});

//We create the collection or table called users que sigue la estructura del schema
export const RecipeModel = mongoose.model("recipes", RecipeSchema);
