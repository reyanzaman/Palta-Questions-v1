import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json({limit: '2mb'}));
app.use(express.urlencoded({limit: '2mb', extended: true}));

app.use(express.json());
app.use(cors({ origin: ['http://localhost:3000', 'https://question-based-learning.onrender.com', 'https://question-based-learning-api.onrender.com'], credentials: true }))
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = process.env.PORT || 8080;

/** HTTP GET Request */
// app.get('/', (req, res) => {
//     res.status(201).json("Home GET Request");
// })

// Serving the frontend
app.use(express.static(path.join(__dirname, "./frontend/build")))

app.get("*",(req,res)=>{
    res.sendFile(
        path.join(__dirname, "./frontend/build/index.html"),
        function(err){
        }
    )
})

/** api routes */
app.use('/api', router)

/** Start Server only when we have valid connection*/
connect().then(() => {
    try{
        app.listen(port, () => {
            console.log(`Sever connected to http://localhost:${port}`);
        })
    }catch(error){
        console.log("Failed to connect to the server")
    }
}).catch(error => {
    console.log("Invalid database connection")
})
