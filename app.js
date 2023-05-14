const express = require("express");
const morgan = require("morgan");

// const userRouter = require("../routes/users/userRouter");
const authRouter = require("./src/routes/auth/authRoute");
// const brancheRouter = require("../routes/branches/brancheRouter");
// const {
//   globalErrorHandler,
//   notFoundError,
// } = require("../middlewares/globalErrorHandler");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json()); //pass incoming json data

// Routes
/** Auth routes */
app.use("/api/v1", authRouter);

/** User routes */
// app.use("/api/v1/users", userRouter);

/** Branche routes */
// app.use("/api/v1/branches", brancheRouter);

//Error middlewares
// app.use(notFoundError);
// app.use(globalErrorHandler);

module.exports = app;
