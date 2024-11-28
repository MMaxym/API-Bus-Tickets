import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';  
import cors from 'cors';  

const PORT = 3000; 
const app = express();
const DB_URL = 'mongodb+srv://user:user@cluster1.tyjnv.mongodb.net/Transport?retryWrites=true&w=majority&appName=Cluster1';

app.use(cors({
    origin: 'http://localhost:3001', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(express.json());

app.use('/', routes);

app.get('/', (req, res) => {
    res.status(200).json('Сервер успішно працює');
});

async function startApp(){
    try{
        await mongoose.connect(DB_URL);
        app.listen(PORT, () => console.log('Сервер працює на порті ' + PORT));
    }
    catch(e){
        console.log('Помилка підключення: ' + e);
    }
}

startApp();
