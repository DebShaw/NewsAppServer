import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import cors from "cors";
import Auth from "./routes/Auth.js";
import News from "./routes/News.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => app.listen(PORT, () => console.log(`Listening at Port ${PORT}`)))
  .catch((error) => console.log(`${error} did not connect`));

app.get("/", (req, res) => {
  res.send("App is running smoothly");
});
app.use("/api/auth", Auth);
app.use("/api/user", News);
