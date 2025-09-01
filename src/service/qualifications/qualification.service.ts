import axiosInstance from "../axios.helper";

export const getQualifications = async () => {
  const res = await axiosInstance.get("/qualifications");
  console.log("✅ Qualifications received:", res);
  return res.data;
};
