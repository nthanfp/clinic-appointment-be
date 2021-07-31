import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';

dotenv.config();
import router from './routes/index.js';
import dbUtil from './utils/db.js';
import JsonException from './utils/JsonException.js';

const app = express();
const PORT = process.env.PORT || 80;

// cors options
const whitelist = [
    'http://localhost:8000',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://clinic-appointment-fe.vercel.app',
];
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(null, false);
        }
    },
    methods: ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
        'x-access-token',
    ],
};

// middleware configurations
app.set('secret', process.env.SECRET);
app.use(cors(corsOptions));
app.use(express.json());

// routes
app.use('/api', router);

// error handler
app.all('*', (req, res, next) => {
    const error = new JsonException(res, 404, 'Endpoint not found');
    next(error);
});

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
});
