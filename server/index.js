import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { register } from "./controllers/auth.js";
import dbConnection from "./Database/dbConnection.js";
import { verifyToken } from "./middleware/auth.middleware.js";
import authRouter from "./routers/auth.router.js";
import userRouter from "./routers/user.access.js";
import postRouter from "./routers/post.route.js";
import { createPost } from "./controllers/post.controller.js";



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's URL
    credentials: true, // Allow credentials (cookies)
  })
);

//-----------------------------------------------------------------------------
// File Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Routes with Files
app.post("/auth/register", upload.single("picturePath"), (req, res, next) => {
  if (!req.file) {
    // If no file was uploaded, continue to the register function
    return res.status(401).json({ message: "No file uploaded" });
  }
  // If a file was uploaded, add the file path to the request body
  req.body.picturePath = req.file.path;
  register(req, res, next);
});
app.post("/posts", verifyToken, upload.single("picturePath"), createPost);

// Router for other Actions
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/posts", postRouter);

//-----------------------------------------------------------------------------
//test
app.get("/test", verifyToken, (req, res) => {
  const user = req.user;
  res.json({ user });
});
//
// Database Connection
await dbConnection();

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
