const router = require("express").Router();
const auth = require("../middlewares/auth.js");

const userRoutes = require("./users");
const itemRoutes = require("./clothingItems");

router.use("/users", auth, userRoutes);
router.use("/items", itemRoutes);

module.exports = router;