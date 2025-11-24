const express = require('express');
const { userRegister, userLogin, userLogout, userProfile, userProfileUpload, dynamicUserProfile } = require('../controllers/auth.controller');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { uploadFile } = require('../utils/utils');


const authRouter = express.Router();

authRouter.get('/profile', authMiddleware, userProfile);
authRouter.post('/register', userRegister);
authRouter.post('/login', userLogin);
authRouter.post('/logout', authMiddleware,userLogout);
authRouter.patch('/profile-upload', uploadFile.single('profile'), authMiddleware,userProfileUpload);
authRouter.get('/profile/:id', authMiddleware, dynamicUserProfile);

module.exports = authRouter;