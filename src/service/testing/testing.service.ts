import axios from "../axios.helper";

// Yeh sirf testing ke liye API call hai
export const testApi = async () => {
  try {
    // JSONPlaceholder ek free dummy API hai
    const response = await axios.get("https://jsonplaceholder.typicode.com/posts/1");
    return response.data;
  } catch (error: any) {
    throw new Error(error.message || "API call failed");
  }
};
