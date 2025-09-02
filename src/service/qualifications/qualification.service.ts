import axiosInstance from "../axios.helper";

export const getQualifications = async ({ page, limit, search }: { page: number; limit: number; search?: string }) => {
  const response = await axiosInstance.get("/qualifications", {
    params: { page, limit, search,  }
  });
  console.log("API called with params:", { page, limit, search });
  return response.data;
};



// API se clients fetch karna
export const getClients = async () => {
  const response = await axiosInstance.get("/clients");
  return response.data;
};