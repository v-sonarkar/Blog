import { createContext, useContext, useEffect, useState } from "react";
import { blog_data } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";
const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const navigate = useNavigate();

  const [token, setToken] = useState(null); // authentication token and store in browser localStorage
  const [blogs, setBlogs] = useState(blog_data);
  const [loadingBlogs, setLoadingBlogs] = useState(false);
  const [input, setInput] = useState("");

  const fetchBlogs = async () => {
    try {
      const { data } = await axios.get("/api/blog/all");
      data.success ? setBlogs(data.blogs) : toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
      console.error("Error fetching blogs:", error);
    }
  }; //we havevto execute this function somewhere to fetch blogs from backend

  useEffect(() => {
    fetchBlogs();
    const token = localStorage.getItem("token");
    if (token) {
      setToken(token);
      axios.defaults.headers.common["Authorization"] = token; // add raw token expected by backend auth
    }
  }, []);

  const value = {
    navigate,
    token,
    setToken,
    blogs,
    setBlogs,
    input,
    setInput,
    loadingBlogs,
    setLoadingBlogs,
    axios,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  return useContext(AppContext);
};
