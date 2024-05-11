const router = require("express").Router();
const auth = require("../middlewares/auth");


const { createUser, login } = require("../controllers/user");
const userRoutes = require("./users");
const itemRoutes = require("./clothingItems");

router.post("/signin", login);
router.post("/signup", createUser);
router.use("/users", auth, userRoutes);
router.use("/items", itemRoutes);

module.exports = router;
