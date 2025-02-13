import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

import express from "express";

const router = express.Router();

// searchBar router Get
router.get("/", async (req, res) => {
    try {
      const { search } = req.query; // Extract the 'search' parameter from the query string
      const filter = search
      ? { 
          $or: [ // Use $or to search in both title and tags
              { title: { $regex: search, $options: "i" } }, // Search in title (case-insensitive)
              { tags: { $regex: search, $options: "i" } } // Search in tags (case-insensitive)
          ]
      }
      : {};
  
      const response = await RecipeModel.find(filter); // Find recipes based on the filter
      res.json(response);

    } catch (err) {
        res.json(err); // Improved error handling
    }
});

// recipeId information router Get
router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract the id from the URL parameters
      const recipe = await RecipeModel.findById(id); // Mongoose will match by the ObjectId
  
      // if recipe is not found
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" }); // Handle non-existent ObjectId
      }
    
      // if recipe is founded
      res.json(recipe); // Respond with the found recipe
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(400).json({ error: "Invalid recipe ID format" }); // Handle invalid ObjectId format
      }
      res.json(err); // Generic error handler
    }
  });
  
// new recipes router POST
router.post("/", async (req, res) => {

  // las variables requeridas para el post tendrá la misma estructura que el RecipeModel
  const newRecipe = new RecipeModel(req.body); 

  // intentamos guardar la variable requerida
  try {
    const response = await newRecipe.save(); 
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

// 
router.put("/", async (req, res) => {
  try {
    const recipe = await RecipeModel.findById(req.body.recipeID);
    const user = await UserModel.findById(req.body.userID);

    user.savedRecipes.push(recipe);
    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    res.json(err);
  }
});

// aquí va a coger todos los id del saved list asociados al user
router.get("/savedRecipes/ids", async (req, res) => {
  try {
    const user = await UserModel.findById(req.body.userID);
    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);  
  }
});

// aquí va a coger todo lo que hay dentro de los id del savedRecipes 
router.get("/savedRecipes", async (req, res) => {
    try {
      const user = await UserModel.findById(req.body.userID);
      const savedRecipes = await RecipeModel.find({
        _id: {$in: user.savedRecipes}
        });
      res.json({ savedRecipes });
    } catch (err) {
      res.json(err);
    }
  });
  

export { router as recipesRouter };
