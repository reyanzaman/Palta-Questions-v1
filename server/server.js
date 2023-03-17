import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connect from './database/connection.js';
import router from './router/route.js';

const app = express();

app.use(express.json({limit: '10mb'}));
app.use(express.urlencoded({limit: '10mb', extended: true}));

app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));
app.disable('x-powered-by');

const port = 8080;

/** HTTP GET Request */
app.get('/', (req, res) => {
    res.status(201).json("Home GET Request");
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