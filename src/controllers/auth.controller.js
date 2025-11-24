const User = require("../models/user.model");
const { errorResponse } = require("../utils/utils");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cloudinary = require('cloudinary').v2;

const userRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            return errorResponse(res, 404, 'Name, Email, Password all fields required!');
        }

        const user = await User.findOne({ email });
        if (user) {
            return errorResponse(res, 404, 'Already user exists please login!')
        }

        const hashPassword = await bcrypt.hash(password, 10);
        await User.create({
            name,
            email,
            password: hashPassword
        });

        return res.status(202).json({
            success: true,
            message: 'User register success'
        });


    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
};

const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return errorResponse(res, 404, 'Email, Password required!')
        }

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, 'User not found')
        }

        const matchPassword = await bcrypt.compare(password, user.password);
        if (!matchPassword) {
            return errorResponse(res, 403, 'Invalid password!')
        }

        const token = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN, {
            expiresIn: '7d' // 7days
        });
        

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite:'none',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7days
        })

        return res.status(200).json({
            success: true,
            message: 'Logged successfully'
        });

    } catch (error) {
        console.log(error.message);
        return errorResponse(res, 500, error.message)
    }
}


const userLogout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            sameSite:'none',
            secure: process.env.NODE_ENV === "production",
        });
        res.status(200).json({
            success: true,
            message: 'Logout successfully'
        })
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const userProfile = async (req, res) => {
    try {

        const { userId } = req.user;
        const user = await User.findById(userId).select('-password');
        if (!user) {
            return errorResponse(res, 404, 'User not found')
        }

        return res.status(200).json({
            success: true,
            message: 'User profile fetched',
            user,
        })

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const dynamicUserProfile = async (req, res) => {
    try {
        const {id} = req.params;
        if(!id) {
            return errorResponse(res, 404, 'Please User id required!')
        }

        const user = await User.findById(id).select('-password');
        if(!user) {
            return errorResponse(res, 404, 'User not found')
        }

        return res.status(200).json({
            success: true,
            message: 'Fetched User profile',
            user
        })
        
    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


const userProfileUpload = async (req, res) => {
    try {

        const { userId } = req.user;
        const{bio} = req.body;
        if (!req.file) {
            return errorResponse(res, 404, 'Profile image & bio required!')
        }



        const user = await User.findById(userId);
        if (user.profile.public_id) {
            await cloudinary.uploader.destroy(user.profile?.public_id, {
                resource_type: 'image',
                folder: "images"
            });
        };

        const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;

        const result = await cloudinary.uploader.upload(fileBase64, {
            folder: "images",
            resource_type: "image"
        });

        user.profile.url = result.secure_url;
        user.profile.public_id = result.public_id;
        user.profile.bio = bio || user.profile.bio;
        await user.save();

        return res.status(200).json(
            {
                success: true,
                message: 'Profile upload successfully',
                // just check it 
                user
            }
        );

    } catch (error) {
        return errorResponse(res, 500, error.message)
    }
}


module.exports = {
    userRegister,
    userLogin,
    userLogout,
    userProfile,
    userProfileUpload,
    dynamicUserProfile,
}