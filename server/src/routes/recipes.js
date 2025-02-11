import { RecipeModel } from "../models/Recipes.js";
import { UserModel } from "../models/Users.js";

import express from "express";

const router = express.Router();

// router.get("/", async (req, res) => {
//   try {
//     const response = await RecipeModel.find({}); // no condtions en el find va a hacer que busque todo el documento
//     res.json(response);
//   } catch (err) {
//     res.json(err);
//   }
// });

router.get("/", async (req, res) => {
    try {
      const { search } = req.query; // Extract the 'search' parameter from the query string
      const filter = search
        ? { title: { $regex: search, $options: "i" } } // Case-insensitive partial match
        : {}; // If no search term, return all documents
  
      const response = await RecipeModel.find(filter); // Find recipes based on the filter
      res.json(response);
    } catch (err) {
        res.json(err); // Improved error handling
    }
});


router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params; // Extract the id from the URL parameters
      const recipe = await RecipeModel.findById(id); // Mongoose will match by the ObjectId
  
      if (!recipe) {
        return res.status(404).json({ message: "Recipe not found" }); // Handle non-existent ObjectId
      }
  
      res.json(recipe); // Respond with the found recipe
    } catch (err) {
      if (err.kind === "ObjectId") {
        return res.status(400).json({ error: "Invalid recipe ID format" }); // Handle invalid ObjectId format
      }
      res.json(err); // Generic error handler
    }
  });
  



router.post("/", async (req, res) => {
  const newRecipe = new RecipeModel(req.body);

  try {
    const response = await newRecipe.save(); // no condtions en el find va a hacer que busque todo el documento
    res.json(response);
  } catch (err) {
    res.json(err);
  }
});

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
