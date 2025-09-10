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
