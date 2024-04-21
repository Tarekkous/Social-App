import express from "express";
const app = express()

import cors from "cors"
import cookieParser from "cookie-parser";
import userRoutes from "./routes/users.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import postRoutes from "./routes/posts.js";
import relationshipsRoutes from "./routes/relationships.js"
import multer from "multer";



const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(cookieParser())

// function to upload file and store it in the server !!*  we use (multer)  and diskstorage to specify the extension of the file in the destination
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '../client/public/upload')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname)
    },
  })
  
  const upload = multer({ storage: storage })

  app.post("/api/upload", upload.single("file"), (req,res) => {
    const file = req.file
    res.status(200).json(file.filename)
  })



app.use(express.json())
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/relationships", relationshipsRoutes)


app.get("/", (req, res) => {
    res.send("hello Backend")
})



const PORT = process.env.PORT || 8800

app.listen(PORT, () => {
    console.log("connected to backend")
});