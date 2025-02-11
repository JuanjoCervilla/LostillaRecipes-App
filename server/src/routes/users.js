import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { UserModel } from "../models/Users.js"

const router = express.Router()

//  creating possibles routes : resgister and login

// register router
// async(req, res) --> req = variables requeridas and res = variables que envías 
router.post("/register", async(req, res) =>{
    
    // tenemos que asegurarnos que cuando llamamos a esto desde el front lleve tanto username como password
    const { username, password } = req.body

    // vamos a confirmar que este user existe en la base de datos
    const user = await UserModel.findOne({username : username}); 

    // if the user is already we don't continue. We want null as value, if we want to register an user
    if (user) {
        return res.json({ message: "User already exists!" })
    }

    // we use bcrypt to hash the password 
    const  hashedPassword = await bcrypt.hash(password, 10 )

    // add the user to the database
    const newUser = new UserModel({username, password: hashedPassword})
    await newUser.save();

    //recogemos la respuesta de la API
    res.json({message : "User Registered Succesfully"});

});

// login router
router.post("/login", async(req, res) =>{
    
    const { username, password } = req.body
    const user = await UserModel.findOne({username : username}); 

    // buscamos si el user existe o no
    if (!user) {
        return res.json({ message : "User Doesn't Exist!" })
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid){
        return res.json({message : "Username or Password Is Incorrect!"})
    }

    const token = jwt.sign({id: user._id}, "secret");


    res.json({token, userID: user._id})

})







export {router as userRouter};