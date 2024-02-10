import express from 'express'
const app = express()
import userRouter from './routes/user.js'
import authRouter from './routes/auth.js'
import bodyParser from 'body-parser'

app.use(express.json())

app.use('/api/users/', userRouter)
app.use('/api/auth/', authRouter)

app.listen(7000, ()=> {
    console.log("servidor rodando")
})