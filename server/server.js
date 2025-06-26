const exp = require("express");
const app = exp();

const dotEnv = require("dotenv");
dotEnv.config();

const mongoose = require("mongoose");
const expressAsyncHandler = require("express-async-handler");

// JSON parsing middleware with error handling
app.use(
  exp.json({
    verify: (req, res, buf) => {
      try {
        JSON.parse(buf);
      } catch (e) {
        res.status(400).json({ error: "Invalid JSON format" });
        throw new Error("Invalid JSON");
      }
    },
  })
);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use("/user-api", require("./API/userApi"));
app.use("/author-api", require("./API/authorApi"));
app.use("/admin-api", require("./API/adminApi"));

// JSON parsing error handler
app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({ error: "Invalid JSON format" });
  }
  next(error);
});

app.use(
  expressAsyncHandler(async (err, req, res, next) => {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err.message });
  })
);
