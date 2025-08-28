// src/service/qualifications/qualification.service.ts
import axiosInstance from "../axios.helper";

export async function fetchAllQualifications() {
  const response = await axiosInstance.get("/qualifications");
  return response.data;
}

export async function fetchQualificationById(id: string) {
  const response = await axiosInstance.get(`/qualifications/${id}`);
  return response.data;
}

export async function createQualification(payload: { name: string; description: string; type: string }) {
  const response = await axiosInstance.post("/qualifications", payload);
  return response.data;
}

export async function updateQualification(id: string, payload: void) {
  const response = await axiosInstance.put(`/qualifications/${id}`, payload);
  return response.data;
}

export async function deleteQualification(id: string) {
  const response = await axiosInstance.delete(`/qualifications/${id}`);
  return response.data;
}
