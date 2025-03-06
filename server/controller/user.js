const User = require('../models/User')
const bcrypt = require('bcrypt');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
dotenv.config();


exports.signUp = async (req, res) => {
    const {username, email, password} = req.body;
    // check if the user already exists
    if(!username || !email || !password){
        return res.status(400).json({
            message: "Please fill in all fields"
        });
    }

    try{
        const user = await User.findOne({email});
        // check if the user already exists 
        if(user){
            return res.status(401).json({ message: "User already exists" });
        }

        // hash the password
        const hashedPassowrd = await bcrypt.hash(password, 10);

        // create a new user 
        const newUser = new User({
            username,
            email, 
            password: hashedPassowrd,
            role: "user"
        })

        const result = await newUser.save();
        console.log(result);
        res.status(201).json({
            message: "Account created successfully",
            result
        });

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Account creation failed"
        });
    }
}

exports.logOutUser = (req, res) => {
    res.clearCookie("token", { httpOnly: true, secure: true, sameSite: "None" });
    res.status(200).json({ message: 'Logged out successfully' });
}

exports.logIn = async (req, res) => {
 const {email, password} = req.body;

 try{
    const user = await User.findOne({email});


    if (!user) {
        return res.status(400).json({ 
            message: "Email Credential is wrong",
            users: user 
        });
    }

    console.log(`This is the ${user.role} role`);

     // Compare the password entered by the user with the password in DB
        const doMatch = await bcrypt.compare(password, user.password);

        if (!doMatch) { // If the password does not match
            return res.status(401).json({
                message: "Invalid Credentials",
                match: doMatch
            });
        }

        // create a token 

        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        )

        //send the token to the user
        res.cookie('token', token, {
            httpOnly: true, // Prevents JavaScript access
            secure: false, 
            sameSite: "Strict", // Prevents CSRF
            maxAge: 3600000 // 1 hour expiry
        });

        res.status(200).json({
            message: "Login successful",
            token,
            match: doMatch,
            user
        });

 }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Login failed"
        });
 }

}