import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js"

const router = express.Router()

// register router Post
router.post("/register", async(req, res) =>{ // async(req, res) --> req = variables requeridas and res = variables que envías 
    
    // Las variables requeridas son username and password. Haremos una call usando estas dos variables
    const { username, password } = req.body

    // Buscamos si username existe ya en la base de datos. UserModel en la collection de la base de datos
    const user = await UserModel.findOne({username : username}); 

    // Si el user ya existe, no estaríamos interesados en crearlo
    if (user) {
        return res.json({ message: "User already exists!" })
    }

    // En el caso de que el username no exista vamos a crear un hash para la password
    const  hashedPassword = await bcrypt.hash(password, 10 )

    // Add the user and hashedPassword to the database
    const newUser = new UserModel({username, password: hashedPassword})
    await newUser.save();

    // Mensaje cuando la importación ha sido realizada
    res.json({message : "User Registered Succesfully"});

});

// login router Post
router.post("/login", async(req, res) =>{
    
    // Las variables requeridas son username and password. Haremos una call usando estas dos variables
    const { username, password } = req.body

    // Buscamos si username existe ya en la base de datos. UserModel en la collection de la base de datos
    const user = await UserModel.findOne({username : username}); 

    // Si el usuario no existe no se podrá logear
    if (!user) {
        return res.json({ message : "User Doesn't Exist!" })
    }

    // Si el usuario existe comprobaremos su contraseña. No podemos hacer el unhash de una password pero si podemos
    // comparar dos password hashed 
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // Si la comparación no es buena, diremos que la password es incorrecta
    if (!isPasswordValid){
        return res.json({message : "Password Is Incorrect!"})
    }

    // creamos un token y un id como respuesto. no entiendo para que ????
    const token = jwt.sign({id: user._id}, "secret");

    res.json({token, userID: user._id})

})

export {router as userRouter};

export const verifyToken = (req, res, next) => {

    const token = req.headers.authorization;
    if (token) {
        jwt.verify(token, "secret", (err) => {
            if (err) return res.sendStatus(403);
            next();
        });
    }  else  {
        res.sendStatus(401);
    }
}