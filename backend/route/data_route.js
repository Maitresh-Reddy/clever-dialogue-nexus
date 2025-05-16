import express from 'express'
import {
    sendChat,
    newchat
} from '../controller/dataController.js';

const route=express.Router();
route.post('/sendChat',sendChat);
route.post('/newChat',newchat);

export default route;