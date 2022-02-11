//configurando express
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth")

const app = express();


//configurando dotenv

dotenv.config();

//conectando la db mongo

mongoose.connect(process.env.MONGO_URL)
    .then(() => {console.log("Database conectada");})
    .catch((error) => {console.log(error);});

//usando rutas
app.use(express.json())
app.use("/api/auth", authRoute);

//Escuchar al puerto
app.listen(process.env.PORT, ()=> {
    console.log("Server corriendo")
});