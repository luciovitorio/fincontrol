const express = require("express");
const morgan = require("morgan");

const userRouter = require("./routes/users/usersRoutes");
const authRouter = require("./routes/auth/authRoute");
const categoryRouter = require("./routes/categories/categoriesRoutes");
const accountRouter = require("./routes/accounts/accountRoute");
const reportRouter = require("./routes/reports/reportsRoutes");
const creditCardRouter = require("./routes/creditCard/creditCardRoutes");

const {
  globalErrorHandler,
  notFoundError,
} = require("./middlewares/globalErrorHandler");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(express.json()); //pass incoming json data

// Routes
/** Auth routes */
app.use("/api/v1", authRouter);

/** User routes */
app.use("/api/v1/users", userRouter);

/** Category routes */
app.use("/api/v1/categories", categoryRouter);

/** Account routes */
app.use("/api/v1/accounts", accountRouter);

/** Credit Card routes */
app.use("/api/v1/credit-cards", creditCardRouter);

/** Reports routes */
app.use("/api/v1/reports", reportRouter);

//Error middlewares
app.use(notFoundError);
app.use(globalErrorHandler);

module.exports = app;
