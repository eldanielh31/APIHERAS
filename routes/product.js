const router = require("express").Router();
const Product = require("../modules/Product")
const { verifyTokenAndAuthorization, verifyTokenAndAdmi } = require("../routes/verifyToken");

//CREATE

router.post("/",verifyTokenAndAdmi, async(req, res)=>{
    const newProduct = new Product(req.body);
    try{
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }catch(err){
        res.status(500).json(err);
        console.log(err);
    }
});

router.put("/:id", verifyTokenAndAdmi, async (req, res) => {
    try {
        const updateProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).json(updateProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmi, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("Producto eliminado.")
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const findedProduct = await Product.findById(req.params.id);
        res.status(200).json(findedProduct);
        res.header("Access-Control-Allow-Origin", "*");
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});
//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    try {
        let products;
        if(qNew){
            products = await Product.find().sort({createdAt: -1}).limit(5);
        }else if(qCategory){
            products = await Product.find( {categories: {$in:[qCategory]} });

        }else{
            products = await Product.find();
        }
        res.header("Access-Control-Allow-Origin", "*");
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//GET PRODUCT STATS
router.get("/stats", verifyTokenAndAdmi, async (req, res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try{
        const data = await Product.aggregate([
            {$match: {createdAt: {$gte:lastYear}}},
            {
                $project:{
                    month: {$month: "$createdAt"}
                }
            },
            {
                $group: {
                    _id: "$month",
                    total:{$sum: 1}
                }
            }
        ]);
        res.status(200).json(data);
        res.header("Access-Control-Allow-Origin", "*");
    }catch(err){
        console.log(err);
        res.status(500).json(err);
    }
})

module.exports = router;