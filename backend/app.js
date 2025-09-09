import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import userRoutes from './routes/user.routes.js';
import { connectDB } from './db/db.js';
import cors from 'cors'
import projectRoutes from './routes/project.routes.js'
import aiRoutes from './routes/ai.routes.js';
connectDB();

const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true // needed if using cookies/sessions
}));

// Routes
app.use('/users', userRoutes);
app.use('/projects',projectRoutes)
app.use("/ai", aiRoutes)

app.get('/', (req, res) => {
  res.send('Hello node');
});

export default app;
