const router = require("express").Router();

router.get("/userTest", (req, res) => {
    res.send("usuario test correcto");
});

router.post("/userposttest", (req,res)=>{
    const username = req.body.username;
    res.send("Hola " + username);
})

module.exports = router