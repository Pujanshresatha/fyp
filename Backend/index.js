import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { route } from './Routes/route.js';
import 'dotenv/config';
import connectDB from './Db/index.js'; // Fixed: Changed 'drept' to 'connectDB'

const server = express();
const PORT = process.env.PORT || 8000;

server.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

server.use((req, res, next) => {
  console.log(`${req.method} ${req.url} from origin ${req.headers.origin}`);
  next();
});

server.use(cookieParser());
server.use(express.json({ limit: '16kb' }));
server.use(express.urlencoded({ extended: true }));

connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
  });

server.use('/api', route);

server.get('/', (req, res) => {
  res.send('Hello to backend');
});

server.get('*', (req, res) => {
  res.send('404 NOT FOUND <a href="./"> Go To Home</a>');
});