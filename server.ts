import { createRequire } from "module";
const require = createRequire(import.meta.url); //cjs & esm same file
const { Client } = require('pg'); 

import morgan from 'morgan'
import express from 'express';
import bodyParser from "body-parser";


const app = express();

const port = process.env.PORT || 8080;

app.get('/', (_req, res) => {
    res.json({ info: 'Node.js, Express, and dkqwoqwd' })
})

app.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

app.use(morgan('tiny'));

const connectDB = async () => {
 try {
const client = new Client({
  user: "root",
  password: "root",
  database: "root",
  host: "localhost",
  port: 5432
});
    await client.connect();
    const res = await client
    .query("SELECT * FROM employees");
    console.log(res);
    await client.end()
}   catch(error) {
    console.log(error)
 }
}

connectDB()

app.use(bodyParser.json())
app.use(
bodyParser.urlencoded({
    extended:true,
})
)
