const router = require("express").Router();
const { response } = require("express");
const res = require("express/lib/response");
const Order = require("../modules/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmi, verifyToken } = require("../routes/verifyToken");

//CREATE

router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json(savedOrder);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

router.put("/:id", verifyTokenAndAdmi, async (req, res) => {
    try {
        const updateOrder = await Order.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).json(updateOrder);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAdmi, async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.status(200).json("Orden eliminado.")
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET PRODUCT
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const findedOrder = await Order.findOne({ userId: req.params.userId });
        res.status(200).json(findedOrder);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//GET ALL
router.get("/", verifyTokenAndAdmi, async (req, res) => {
    try {
        const Order = await Order.find();
        res.status(200).json(Order);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmi, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.getMonth() - 1);
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: {$month: "$createdAt"},
                    sales: "$amount"
                },
                $group:{
                    _id:"$month",
                    total:{$sum: "$sales"}
                }
            }
        ]);
        res.status(200).json(income);
    }catch (err) {
    res.status(500).json(err);
    console.log(err);
}
})

module.exports = router;