import mysql from 'mysql'
import dotenv from 'dotenv'

dotenv.config({path: "./.env"})

export const db = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '123456',
    database: 'redesocial'
});

