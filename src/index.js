const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const connectDatabase = require("./config/database");
const authRouter = require('./routes/user.route');
const postRouter = require('./routes/post.route');


// MIDDLEWARES 
const app = express();
app.use(express.json());
app.use(cors({
    origin: ["http://localhost:5173", "https://prhouse-app-frontend.vercel.app", "https://prhouse-app-frontend.onrender.com"],
    credentials: true,
}));
app.use(cookieParser());


// ROOT ROUTE 
app.get('/', (req, res) =>{
    res.json({
        message: 'Server is running'
    })
});


// APPLICATION ROUTES 
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/post', postRouter);


const PORT = process.env.PORT || 3000;
// APP LISTENING
app.listen(PORT, async() => {
    await connectDatabase();
    console.log(`Server is running on port:${PORT}; http://localhost:${PORT}`);

})
