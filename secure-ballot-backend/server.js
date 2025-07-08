const express = require('express');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const authRouter = require('./routes/authRoute.js');
const connectDB = require('./config/connectDB.js');




const app = express();
const port = process.env.PORT || 3000;

//Middlewares
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('trust proxy', 1);


//Database Connection
connectDB();


//Routes
app.use('/api/auth', authRouter);
app.use('/api/voter', require('./routes/voterRoute.js'));
app.use('/api/vote', require('./routes/voteRoute.js'));
app.use('/api/admin', require('./routes/adminRoute.js'));




app.listen(port, () =>{
    console.log(`Server is running on http://localhost:${port}`);
})