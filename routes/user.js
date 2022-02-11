const router = require("express").Router();
const User = require("../modules/User");
const { verifyTokenAndAuthorization, verifyTokenAndAdmi } = require("../routes/verifyToken");

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        const updateUser = await User.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).json(updateUser);
    } catch (err) {
        res.status(500).json(err);
    }
});

//DELETE
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Usuario eliminado.")
    } catch (err) {
        res.status(500).json(err);
    }
});

//GET USER
router.get("/find/:id", verifyTokenAndAdmi, async (req, res) => {
    try {
        const findedUser = await User.findById(req.params.id);
        const { password, ...others } = findedUser._doc;
        res.status(200).json(others);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});
//GET ALL USER
router.get("/", verifyTokenAndAdmi, async (req, res) => {
    const query = req.query.new;
    try {
        const users = query ?
            await User.find().sort({ _id: -1 }).limit(5)
            : await User.find();

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json(err);
        console.log(err);
    }
});

//GET USER STATS
router.get("/stats", verifyTokenAndAdmi, async (req, res) =>{
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() -1));

    try{
        const data = await User.aggregate([
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

    }catch(err){

    }
})

module.exports = router;