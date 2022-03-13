const router = require("express").Router();
const { response } = require("express");
const Cart = require("../modules/Cart");
const { verifyTokenAndAuthorization, verifyTokenAndAdmi, verifyToken } = require("../routes/verifyToken");

router.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//CREATE

router.post("/",verifyToken, async(req, res)=>{
    const newCart = new Cart(req.body);
    try{
        const savedCart = await newCart.save();
        res.status(200).json(savedCart);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

router.put("/:id",verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateCart = await Cart.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).json(updateCart);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", async (req, res) => {
    try {
        await Cart.findByIdAndDelete(req.params.id);
        res.status(200).json("Carrito eliminado.")
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:userId",verifyTokenAndAuthorization, async (req, res) => {
    try {
        const findedCart = await Cart.findOne({userId: req.params.userId});
        res.status(200).json(findedCart);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//GET ALL
router.get("/", verifyTokenAndAdmi, async(req, res)=> {
    try{
        const carts = await Cart.find();
        res.status(200).json(carts);
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;