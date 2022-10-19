const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");
const gravatar = require('gravatar');
const jimp = require('jimp');

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
        const avatarURL = gravatar.url(email);
        const newUser = await User.create({email, password: hashPassword, avatarURL })
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

    
    const passwordCompare = await bcrypt.compare(password, user.password);  

    if(!passwordCompare) {
        throw RequestError(401, "Password wrong"); 
    }

    const payload = {
        id: user._id,
    }

    const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '1h'});
    await User.findByIdAndUpdate(user._id, {token})
    res.json({
        token,
    })
    
}

const getCurrent = async (req, res) => {
    const {email, subscription } = req.user;
    res.json({
        email,
        subscription ,
    })
}

const logout = async(req, res)=> {
    const {_id} = req.user;
    await User.findByIdAndUpdate(_id, {token: ""})
    res.json({
        message: "Logout success"
    })
}

const avatarsDir = path.join(__dirname, "../", 'public', 'avatars'); 


const updateAvatar = async(req, res)=> {
    try {
        const {_id} = req.user;
        const {path: tempUpload, originalname} = req.file;
        const extention = originalname.split(".").pop();
        const filename = `${_id}.${extention}`;
        const resultUpload = path.join(avatarsDir, filename)
        await fs.rename(tempUpload, resultUpload);
        const file = await jimp.read(resultUpload);
        file.resize(250, 250).write(resultUpload);
        const avatarURL = path.join("avatars", filename);
        await User.findByIdAndUpdate(_id, {avatarURL});
        res.json({
            avatarURL
        })
    }
    catch(error) {
        await fs.unlink(req.file.path);
        throw error;
    }
}


module.exports = {
    register,
    login,
    getCurrent,
    logout,
    updateAvatar,
};

