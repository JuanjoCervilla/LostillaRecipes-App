import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";
import { verifyToken } from "./users.js";

import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// Combined search and filter route
router.get("/", async (req, res) => {
  try {
    const { search, types } = req.query; // Extract 'search' and 'types' parameters from the query string

    // Construct search filter if search parameter is provided
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } }, // Search in title (case-insensitive)
            { tags: { $regex: search, $options: "i" } }, // Search in tags (case-insensitive)
          ],
        }
      : {};

    // Construct type filter if types parameter is provided
    const typeFilter = types
      ? {
          type: { $in: types.split(",").map((type) => type.trim()) }, // Filter by type
        }
      : {};

    // Combine search and type filters
    const filter = { ...searchFilter, ...typeFilter };

    // Find recipes based on the filter
    const response = await RecipeModel.find(filter);
    res.json(response);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
router.post("/", verifyToken, async (req, res) => {

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

// Save or Remove a Recipe
router.put("/",verifyToken, async (req, res) => {
  try {
    const { recipeID, userID } = req.body;
    
    if (!recipeID || !userID) {
      return res.status(400).json({ error: "Recipe ID and User ID are required" });
    }
  
    const recipe = await RecipeModel.findById(recipeID);
    const user = await UserModel.findById(userID);

    if (!recipe || !user) {
      return res.status(404).json({ error: "User or Recipe not found" });
    }

    // Check if recipe is already saved
    const recipeIndex = user.savedRecipes.indexOf(recipeID);
    
    if (recipeIndex === -1) {
      // Recipe not saved yet, add it
      user.savedRecipes.push(recipe._id);
    } else {
      // Recipe already saved, remove it
      user.savedRecipes.splice(recipeIndex, 1);
    }
    
    await user.save();

    res.json({ savedRecipes: user.savedRecipes });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});

// Get id of saved recipes for user ID given 
router.get("/savedRecipes/ids/:userID", async (req, res) => {
  try {

    const user = await UserModel.findById(req.params.userID);

    res.json({ savedRecipes: user?.savedRecipes });
  } catch (err) {
    res.json(err);  
  }
});

  // Get saved recipes
router.get("/savedRecipes/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const validRecipeIDs = user.savedRecipes.filter(id =>
      mongoose.Types.ObjectId.isValid(id)
    );

    if (validRecipeIDs.length === 0) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const savedRecipes = await RecipeModel.find({
      _id: { $in: validRecipeIDs },
    });

    res.status(200).json({ savedRecipes });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: err.message });
  }
});
  
export { router as recipesRouter };
