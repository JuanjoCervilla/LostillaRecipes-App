import mongoose from "mongoose";

//Schema is an object to define the structure of our data
const UserSchema = new mongoose.Schema({
    username: {type: String, required:true, unique:true},
    password: {type: String, required:true },
    savedRecipes: [{type: mongoose.Schema.Types.ObjectId, ref: "recipes"}]
});

//We create the collection or table called users que sigue la estructura del schema
export const UserModel = mongoose.model("users", UserSchema)