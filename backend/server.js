// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const authRoutes = require('./routes/auth_route');
// const { initializeDB } = require('./utils/db');
// const path=require('path')
// const app = express();
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import router from './route/auth_route.js';
import route from './route/data_route.js'
import  {initializeDB}  from './utils/db.js';

const app=express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

async function startServer() {
    try{
        await initializeDB();
        console.log("MongoDB connection established");

        app.use('/api/auth', router);
        app.use('/api/data',route);
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    } catch (error) {
        console.error("Error starting server:", error);
        process.exit(1); 
    }
}

startServer();