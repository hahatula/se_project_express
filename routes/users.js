const router = require("express").Router();
const {
  updateProfile,
  getCurrentUser,
} = require("../controllers/user");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
