// import axiosInstance from "../axios.helper";

import axiosInstance from "../axios.helper";

export const getQualifications = async ({ page, limit }: { page: number; limit: number }) => {
  const response = await axiosInstance.get("/qualifications", {
    params: { page, limit }
  });

  console.log("API called with params:", { page, limit });
  return response.data;
};
