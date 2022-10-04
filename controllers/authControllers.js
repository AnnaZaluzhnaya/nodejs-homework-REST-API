const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {User, schemas} = require('../models/user');
const RequestError = require('../helpers/errors');

const {SECRET_KEY} = process.env;


const register = async (req,res) => {
    const { value: {email, password} } = schemas.registerSchema.validate(req.body);
    const user = await User.findOne({email});
    if(user){
        throw RequestError(409, "Email in use");
    }

    try {
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({email, password: hashPassword })
        res.status(201).json({email: newUser.email})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

const login = async (req,res) => {
    const { value: {email, password} } = schemas.loginSchema.validate(req.body);
    
    const user = await User.findOne({email});
    if(!user){
        throw RequestError(401, "Email not found");
    }

    try { 
    const passwordCompare = await bcrypt.compare(password, user.password);  

    if(!passwordCompare) {
        throw RequestError(401, "Password wrong"); 
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '1h'});
    res.json({
        token,
    })
    }catch (error) {
        res.status(500).json({message: error.message})
    }
}

module.exports = {
    register,
    login,
};

