import express from "express";
import fileUpload from "express-fileupload";
import cors from "cors";
import ProductRoute from "./routes/ProductRoute.js";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(fileUpload());

/* set static agar folder public bisa diakses di browser */
app.use(express.static("public"));
app.use(ProductRoute);

const port = process.env.PORT || 3200;

app.listen(port, ()=> console.log(`SERVER UP and RUNNING Host: ${process.env.APP_HOST} in port: ${port}`));