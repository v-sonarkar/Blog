import express from "express";
import {
  addBlog,
  getAllBlogs,
  getBlogById,
  deleteBlogById,
  togglePublish,
  addComment,
  getBlogComments,
  generateContent,
} from "../controllers/Blogcontroller.js";
import upload from "../middleware/multer.js";
import auth from "../middleware/auth.js";

const blogRouter = express.Router();

blogRouter.post("/add", upload.single("image"), auth, addBlog);
blogRouter.get("/all", getAllBlogs);
blogRouter.get("/:id", getBlogById);
blogRouter.post("/delete/:id", auth, deleteBlogById);
blogRouter.post("/togglePublish/:id", auth, togglePublish);
blogRouter.post("/add-comment/:id", addComment);
blogRouter.get("/comments/:id", getBlogComments);
blogRouter.post("/generate", auth, generateContent);

export default blogRouter;
