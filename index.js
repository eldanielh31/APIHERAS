//configurando express
const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart")
const orderRoute = require("./routes/order")

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
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/cart", cartRoute);
app.use("/api/order", orderRoute);

//Escuchar al puerto
app.listen(process.env.PORT, ()=> {
    console.log("Server corriendo");
});