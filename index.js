//configurando express
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();


//configurando dotenv

dotenv.config();

//conectando la db mongo

mongoose.connect(process.env.MONGO_URL)
    .then(() => {console.log("Database conectada");})
    .catch((error) => {console.log(error);});

//usando rutas
app.get("/hola", () => {
    console.log("entrada correcta");
});

app.use(express.json())
const userRoute = require("./routes/user.js")
app.use("/api/user", userRoute);

//Escuchar al puerto
app.listen(5000, ()=> {
    console.log("Server corriendo")
});