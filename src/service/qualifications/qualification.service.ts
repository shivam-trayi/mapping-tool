import axiosInstance from "../axios.helper";
import { QualificationsMappingData } from "@/types/qualicationTypes";

export interface SaveQualMappingsPayload {
  bodyData: QualificationsMappingData[];
}
export interface SaveQualMappingsResponse {
  success: boolean;
  data: QualificationsMappingData[]; // replaced `any` with actual type
  message?: string;
}

export const getQualifications = async ({
  page,
  limit,
  search = ""
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const response = await axiosInstance.get("/qualifications", {
    params: { page, limit, search }
  });
  return response.data;
};

// Fetch clients
export const getClients = async () => {
  const response = await axiosInstance.get("/clients");
  return response.data;
};

// Save qualification mappings
export const saveQualMappings = async (payload: SaveQualMappingsPayload): Promise<SaveQualMappingsResponse> => {
  const response = await axiosInstance.post<SaveQualMappingsResponse>("/qualifications/saveQualMapping", payload);
  return response.data;
};

/**
 * Fetch qualification mappings for a given member (customer/supplier)
 * @param queryData - Object containing memberId
 * @returns Promise resolving to an array of qualification mapping items
 */
export async function getQualMappings(queryData: SaveQualMappingsPayload): Promise<SaveQualMappingsResponse> {
  try {
    const response = await axiosInstance.get<SaveQualMappingsResponse>(
      "/qualifications/getQualificationDemographicsMappingReview",
      {
        params: queryData, // GET request params
      }
    );
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch qualification mappings");
  }
}

export const saveQualMappingReview = async (payload: SaveQualMappingsPayload): Promise<SaveQualMappingsResponse> => {
  const response = await axiosInstance.post<SaveQualMappingsResponse>("/qualifications/saveQualificationReviewData", payload);
  return response.data;
};


// ✅ Update Qualification Constant ID
export const updateQualificationConstantId = async (
  payload: SaveQualMappingsPayload
): Promise<SaveQualMappingsResponse> => {
  const response = await axiosInstance.put<SaveQualMappingsResponse>(
    "/qualifications/updateQualificationConstantId",
    payload
  );
  return response.data;
};