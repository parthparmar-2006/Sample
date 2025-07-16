const models = require("../models/user-model");
const bcrypt = require("bcrypt");
const home = async (req, res) => {
    try {
        res.status(200).send("Home Page");
    } catch (error) {
        res.status(404).send("Page Not Found");
    }
}
const register = async (req, res) => {
    try {
        const {username, email, phone, password} = req.body;
        const userExist = await models.User.findOne({email});
        if (userExist) {
            return res.status(400).json({msg: "User Email Already In Use"});
        } 
        const userCreated = await models.User.create({username, email, phone, password});
        res.status(201).json({msg: "User Registered", token: await userCreated.generateToken(), userId: userCreated._id.toString()});
    } catch (error) {
        res.status(404).json("Page Not Found");
    }
}
const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userExist = await models.User.findOne({email});
        if (!userExist) {
            return res.status(400).json({msg: "Login Failed"});
        }
        const isValid = await bcrypt.compare(password, userExist.password);
        if (isValid) {
            res.status(200).json({msg: "User Logged In", token: await userExist.generateToken(), userId: userExist._id.toString()});
        } else {
            res.status(401).json("Login Failed");
        }
    } catch (error) {
        res.status(400).json("Login Failed");
    }
}
module.exports = { home, register, login };