
import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import dbconnect from './dbConnect.js'
import UserRoutes from './src/Routers/UserRouter.js'
// import FoodCategoryRoutes from './src/Routers/FoodCategoryRouter.js'
// import FoodSubCategoryRoutes from './src/Routers/FoodSubCategoryRouter.js'
dotenv.config()

const app = express()

// CORS Configuration
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-requested-with']
}))

app.use(express.json())

// Connect to MongoDB
dbconnect()

app.get('/', (req, res) => res.send('Food Delivery Backend running 🍕🚀'))

// API Routes
app.use('/api/users', UserRoutes);
// app.use('/api/food-categories', FoodCategoryRoutes);
// app.use('/api/food-subcategories', FoodSubCategoryRoutes);

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
