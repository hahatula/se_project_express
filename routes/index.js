const auth = require("./middleware/auth");

routes.use("/users", auth, require("./users"));
routes.use("/items", require("./clothingItems"));
