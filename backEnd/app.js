const express = require("express");
const mongoose = require("mongoose");
const app = express();
const userRoutes = require("./routes/userRoutes");
const cors = require("cors");
const port = process.env.PORT || 4000;
mongoose
  .connect(
    "mongodb+srv://hammoqtask:FBhsIu3RafLV3uJH@cluster0.nzd6d.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((error) => {
    console.log("DB connection fail.", error);
  });

app.use(express.json());
app.use(cors());

app.use("/user", userRoutes);

app.all("*", (req, res) => {
  res.status(400).json({
    status: "fail",
    message: `Can't find ${req.originalUrl} on this server!`,
  });
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
