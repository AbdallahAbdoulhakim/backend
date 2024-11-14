const express = require("express");
const dbConnect = require("./config/dbConnect");
const { notFound, errorHandler } = require("./middlewares/errorHandler");
const bearerToekn = require("express-bearer-token");

const app = express();
const dotenv = require("dotenv").config();
const morgan = require("morgan");

const { createWriteStream } = require("fs");
const path = require("path");
const authRouter = require("./routes/authRoutes");
const { loginMiddleware } = require("./middlewares/authMiddlewares");

const { createUser, loginUser } = require("./controller/userControl");

const PORT = process.env.PORT || 5500;

const logFs = createWriteStream(path.join(__dirname, "/access.log"), {
  flags: "a",
});

dbConnect();

app.use(morgan("combined", { stream: logFs }));

app.use(bearerToekn());
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ success: true, message: "Welcome to the API" });
});

app.post("/register", createUser);
app.post("/login", loginUser);

app.use("/api/user", loginMiddleware);
app.use("/api/user", authRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is up and listening to PORT ${PORT}...`);
});
