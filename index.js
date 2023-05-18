const express = require('express');
const cors = require('cors');
const app = express()
const PORT = process.env.PORT || 5000;
require("dotenv").config();



app.use(express())
app.use(cors())


app.get("/",(req,res) => {
    res.send("i am running")
})


app.listen(PORT , () => {
    console.log(`server is running on port ${PORT}`)
})