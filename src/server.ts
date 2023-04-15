import express from "express";
import * as dotenv from "dotenv";
import apicache from "apicache";
import routes from "./routes/routes.js";

dotenv.config();

const port = process.env.PORT || 1313;
const app = express();
const cache = apicache.middleware;

//app.use(cache("1 day"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.get("/", (req, res) => {
  res.send("Welcome to vlr.gg api!");
});

app.listen(port, () => console.log(`Server started on port ${port}`));
