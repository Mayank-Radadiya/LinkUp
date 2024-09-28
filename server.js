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
import authRouter  from "./routers/auth.router.js";
import dbConnection from "./Database/dbConnection.js";

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
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

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
// Router for other Actions
app.use("/auth", authRouter);

// Database Connection
// const PORT = process.env.PORT || 6001;

// export const dbConnection = () => {
//   mongoose
//     .connect(process.env.MONGODB_URL)
//     .then(() => {
//       app.listen(PORT, () => console.log(`Server Port: ${PORT}`));
//     })
//     .catch((error) => console.log(`${error} did not connect`));
// };
 await dbConnection();
 
 const PORT = process.env.PORT || 6001;

 app.listen(PORT, () => console.log(`Server running on port: ${PORT}`));
