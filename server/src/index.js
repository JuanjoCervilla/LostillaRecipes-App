import express from "express"; // create API
import cors from "cors"; // allow you to set the rules of communication between your front and back
import mongoose from "mongoose"; // mongodb arms to create simple request

import { userRouter } from "./routes/users.js";
import { recipesRouter } from "./routes/recipes.js";

const app = express();

app.use(express.json()); // middleware when you get data from the front, you're going to convert into json file
app.use(cors());

// cualquier endpoint del userRouter se guardará aquí directamente. /auth es el root
app.use("/auth", userRouter);
app.use("/recipes", recipesRouter);

// connection with our database6
mongoose.connect(
  "mongodb+srv://jjcergoma:Pacopico1809@recipes.d5wvq.mongodb.net/recipes?retryWrites=true&w=majority&appName=recipes",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

app.listen(3001, () => console.log("SERVER STARTED FOOL! "));
