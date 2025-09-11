// C:\myrepo\mapping-tool\src\service\answers\answer.Service.ts
import axiosInstance from "@/service/axios.helper";

export interface InsertAnswerMappingReviewPayload {
  memberId: number | string;
  memberType: string;
  optionData: {
    questionId: number;
    qualificationId: number;
    memberQuestionId?: number | null;
    qualificationMappingId?: number | null;
  }[];
}

// API call
export const insertAnswerMappingReviewApi = async (payload: any) => {
  const { data } = await axiosInstance.post(
    "/questions/createOptionQueryMapping",
    payload
  );
  return data;
};


export interface UpdateAnswerPayload {
  memberId: number | string;       // Required
  memberType: string;              // Usually "customer"
  optionData: {
    questionId: number;
    qualificationId: number;
    member_answer_id: string;      // Updated value
    memberQuestionId?: number | null;
    qualificationMappingId?: number | null;
  }[];
}

// API call to update member_answer_id
export const updateAnswerMappingApi = async (payload: UpdateAnswerPayload) => {
  const { data } = await axiosInstance.put(
    "/questions/updateOptionQueryMapping", // New endpoint for update
    payload
  );
  return data;
};



export interface OptionReviewParams {
  memberType: string;
  memberId: number;
  marketId: number;
  langCode: number;
  questionId: number;
}

// ✅ API call function
export const getOptionQueryReviewMapping = async (params: OptionReviewParams) => {
  const { memberType, memberId, marketId, langCode, questionId } = params;
  const response = await axios.get(
    `/questions/getOptionQueryReviewMapping`,
    { params: { memberType, memberId, marketId, langCode, questionId } }
  );
  return response.data;
};