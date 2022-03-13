const router = require("express").Router();
const Order = require("../modules/Order");
const { verifyTokenAndAuthorization, verifyTokenAndAdmi, verifyToken } = require("../routes/verifyToken");

router.use(async function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

//CREATE\
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
        const orders = await Order.find();
        res.status(200).json(orders);
        
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
})

//GET MONTHLY INCOME
router.get("/income", verifyTokenAndAdmi, async (req, res) => {
    const productId = req.query.pid;
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([{
                $match: {
                    createdAt: {
                        $gte: previousMonth
                    }, ...(productId && {
                        products:{$elemMatch:{productId}}
                    })
                }
            },
            {
                $project: {
                    month: {
                        $month: "$createdAt"
                    },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: {
                        $sum: "$sales"
                    },
                },
            },
        ]).sort({_id: 1});
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;