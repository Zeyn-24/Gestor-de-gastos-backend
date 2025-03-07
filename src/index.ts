import express from 'express'
import cors from 'cors'
import expenseRoutes from './Routes/expenseRoutes'

const app = express()

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}))

app.get('/', (req, res) => {
    res.send('SAAS')
})

app.use('/api/expenses', expenseRoutes)

app.listen(3000, () => {
    console.log(`Server running in Port: ${3000}`)
})