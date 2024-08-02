const express = require("express");
const cors = require('cors');
const app = express();
const {cloudinaryConnect} = require("./config/cloudinary");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

// middleware
const cookieParser = require("cookie-parser");


app.use(cors({
  origin: "*",
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());

const auth = require("./router/auth");
app.use("/api/v1/auth", auth);

const dashboard = require("./router/dashboard");
app.use("/api/v1/auth" , dashboard);

const  project = require("./router/project");
app.use("/api/v1/auth" ,project);


app.use(
  fileUpload({
    useTempFiles:true,
    tempFileDir:"/tmp"
  })
)

// connect to cloudinary 
cloudinaryConnect();


const dbConnect = require("./config/database");
dbConnect();


app.listen(PORT, () => {
  console.log("app start at port 4000");
});

app.get("/", (req, res) => {
  res.send("this is an get app");
});


