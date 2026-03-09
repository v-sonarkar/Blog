import jwt from "jsonwebtoken";
import Blog from "../models/Blog.js";
import Comment from "../models/comment.js";

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Generate a dummy token for simplicity
      const token = jwt.sign({ email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "1h",
      });
      return res.json({ success: true, token, message: "Login successful" });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.error("Admin login error:", error);
    return res.json({ success: false, message: "Server error" });
  }
};

export const getAllBlogsAdmin = async (req, res) => {
  try {
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    res.json({ success: true, blogs });
  } catch (error) {
    console.error("Get all blogs for admin error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const getAllCommentsAdmin = async (req, res) => {
  try {
    const comments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 });
    res.json({ success: true, comments });
  } catch (error) {
    console.error("Get all comments for admin error:", error);
    res.json({ success: false, message: "Server error" });
  }
};

export const getDashboard = async (req, res) => {
  try {
    const recentBlogs = await Blog.find({}).sort({ createdAt: -1 }).limit(5);
    const recentComments = await Comment.find({})
      .populate("blog")
      .sort({ createdAt: -1 })
      .limit(5);
    const blogs = await Blog.countDocuments();
    const comments = await Comment.countDocuments();
    const drafts = await Blog.countDocuments({ isPublished: false });

    const dashboardData = {
      recentBlogs,
      recentComments,
      blogs,
      comments,
      drafts,
    };
    res.json({ success: true, dashboardData });
  } catch (error) {
    console.error("Get dashboard data error:", error);
    res.json({ success: false, message: "Server error" });
  }
};


export const deleteCommentById=async(req,res)=>{    
    try{
        const {id}=req.body; // come from frontend
        const comment=await Comment.findByIdAndDelete(id);
        if(!comment){
            return res.json({success:false,message:"Comment not found"});
        }
        res.json({success:true,message:"Comment deleted successfully"});
    }catch(error){
        console.error("Delete comment error:",error);
        res.json({success:false,message:"Server error"});
    }
};

export const approveCommentById=async(req,res)=>{    
    try{
        const {id}=req.body; // come from frontend
        await Comment.findByIdAndUpdate(id,{isApproved:true});
        res.json({success:true,message:"Comment approved successfully"});
    }catch(error){
        console.error("Approve comment error:",error);
        res.json({success:false,message:"Server error"});
    }
};

