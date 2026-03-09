import fs from "fs";
import Blog from "../models/Blog.js";
import imagekit from "../config/imagekit.js";
import Comment from "../models/comment.js";
import main from "../config/gemini.js";

export const addBlog = async (req, res) => {
  try {
    const { title, subTitle, description, category, isPublished } = JSON.parse(
      req.body.blog
    );
    const imageFile = req.file;

    if (!title || !subTitle || !description || !category || !imageFile) {
      return res.json({ success: false, message: "All fields are required" });
    }
    const fileBuffer = fs.readFileSync(imageFile.path);
    // uploading image to imagekit
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: imageFile.originalname,
      folder: "/blog_images",
    });
    // and after thst we have to optimize the image url transformation
    const optimizedImageUrl = imagekit.url({
      path: response.filePath,
      transformation: [
        {
          quality: "auto", // Set quality to auto
        },
        {
          format: "webp", // Convert to WebP format
        },
        {
          width: "1280", // Resize width to 1280px
        },
      ],
    });
    const image = optimizedImageUrl;
    const newBlog = await Blog.create({
      title,
      subTitle,
      description,
      category,
      image,
      isPublished,
    });

    res.json({
      success: true,
      message: "Blog added successfully",
      blog: newBlog,
    });
  } catch (error) {
    console.error("Add blog error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ isPublished: true });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Get all blogs error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, blog });
  } catch (error) {
    console.error("Get blog by ID error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const deleteBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    // also delete associated comments
    await Comment.deleteMany({ blog: id });

    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    res.json({ success: true, message: "Blog deleted successfully" });
  } catch (error) {
    console.error("Delete blog by ID error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) {
      return res.json({ success: false, message: "Blog not found" });
    }
    blog.isPublished = !blog.isPublished;
    await blog.save();
    res.json({
      success: true,
      message: "Blog publish status toggled successfully",
      blog,
    });
  } catch (error) {
    console.error("Toggle publish error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;

    // Validate inputs
    if (!name || !name.trim() || !content || !content.trim()) {
      return res.status(400).json({ success: false, message: "Name and comment are required" });
    }

    if (!id) {
      return res.status(400).json({ success: false, message: "Blog ID is required" });
    }

    // Create comment
    const newComment = new Comment({ blog: id, name: name.trim(), content: content.trim() });
    await newComment.save();
    
    res.json({ success: true, message: "Comment added for review" });
  } catch (error) {
    console.error("Add comment error:", error);
    res.status(500).json({ success: false, message: error.message || "Server error" });
  }
};

export const getBlogComments = async (req, res) => {
  try {
    const { id } = req.params; // blog id from route params
    const comments = await Comment.find({ blog: id, isApproved: true }).sort({
      createdAt: -1,
    }); // latest comments first
    res.json({ success: true, comments });
  } catch (error) {
    console.error("Get blog comments error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const generateContent = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) {
      return res.json({ success: false, message: "Prompt is required" });
    }
    // generate content using Gemini API
    const content = await main(
      `${prompt} - Generate an SEO-friendly blog article in simple Markdown with headings, lists, and short paragraphs.`
    );
    res.json({ success: true, content });
  } catch (error) {
    console.error("Generate content error:", error);
    const message = error?.message || "Server error";
    res.json({ success: false, message });
  }
};
