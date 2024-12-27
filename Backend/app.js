const express = require("express");
const app = express();
const dotenv=require("dotenv");
const cors=require("cors");
app.use(cors());
app.use(express.json());
dotenv.config();
module.exports=app;