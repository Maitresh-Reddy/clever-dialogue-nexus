import { promises as fs } from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.chat = [];
global.response = [];

export const sendChat = async (req, res) => {
    console.log('Received POST /sendChat');
    console.log(req.body);
    const message = req.body.message;
    if (!message) return res.status(400).json({ error: 'Message is required' });

    global.chat.push(message);
    console.log(message);
    
    const pythonScript = path.join(__dirname, '../py/model.py');
    const pythonPath = '/Users/savir/Projects/clever-dialogue-nexus/env/bin/python';

    try {
        await fs.access(pythonScript);
    } catch (error) {
        console.error('Script path not found:', pythonScript);
        return res.status(500).send({ error: 'Python script not found' });
    }

    const process = spawn(pythonPath, [pythonScript, message]);

    let result = '';
    process.stdout.on('data', (data) => {
        result += data.toString();
    });

    process.stderr.on('data', (data) => {
        console.error('Python error:', data.toString());
    });

    process.on('close', (code) => {
        if (code !== 0) {
            return res.status(500).send({ error: 'Python script failed' });
        }
        global.response.push(result.trim());
        console.log(global.chat);
        console.log(global.response);
        res.status(200).send({ answer: result.trim() });
    });
};

export const newchat=async (req,res)=>{
    console.log("New chat request");

    const history_chat = [];

    const chats = global.chat || [];
    const responses = global.response || [];

    const maxLen = Math.max(chats.length, responses.length);

    for (let i = 0; i < maxLen; i++) {
        if (i < chats.length) {
            history_chat.push({ role: "customer", content: chats[i] });
            history_chat.push({ role: "bot", content: responses[i] });
        }
    }
    global.chat=[]
    global.response=[]
    console.log(history_chat);
    
    res.json({ history: history_chat });
    
}

export const chatemployee = async (req, res) => {
  try {
    const question = req.body.question;
    const pdfPath = req.body.pdf;

    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }

    let pythonProcess;
    let output = '';
    const pythonPath="/Users/savir/Projects/clever-dialogue-nexus/env/bin/python"
    const pythonScript1 = path.join(__dirname, '../py/model.py');
    const pythonScript2 = path.join(__dirname, '../py/pdf_qa.py');
    if (pdfPath) {
      pythonProcess = spawn(pythonPath, [pythonScript2, pdfPath, question]);
    } else {
      pythonProcess = spawn(pythonPath, [pythonScript1, question]);
    }

    pythonProcess.stdout.on('data', (data) => {
      output += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python error: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Python script failed' });
      }
      res.json({ answer: output.trim() });
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};