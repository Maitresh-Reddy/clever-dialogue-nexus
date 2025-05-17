import express from 'express'
import {
    sendChat,
    newchat,
    chatemployee
} from '../controller/dataController.js';
import multer from 'multer';

const route=express.Router();
const upload = multer({ dest: 'uploads/' });

route.post('/sendChat',sendChat);
route.post('/newChat',newchat);
route.post('/chatemployee', upload.single('file'),chatemployee);

export default route;