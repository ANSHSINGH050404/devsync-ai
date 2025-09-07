import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import { connectDB } from './db/db.js';

connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello node');
});

export default app;
