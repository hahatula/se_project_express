const router = require("express").Router();
const auth = require("../middlewares/auth");
const {
  validateUserBody,
  validateUserLogin,
} = require("../middlewares/validation");
const { createUser, login } = require("../controllers/user");
const userRoutes = require("./users");
const itemRoutes = require("./clothingItems");

router.post("/signin", validateUserLogin, login);
router.post("/signup", validateUserBody, createUser);
router.use("/users", auth, userRoutes);
router.use("/items", itemRoutes);

module.exports = router;
