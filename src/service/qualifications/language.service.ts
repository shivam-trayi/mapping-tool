// src/service/languages/language.service.ts
import axiosInstance from "../axios.helper";

export const getLanguages = async () => {
  const response = await axiosInstance.get("/languages");
  return response.data;
};
