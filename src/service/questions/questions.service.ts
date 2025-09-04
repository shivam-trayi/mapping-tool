// questions.service.ts
import axiosInstance from "../axios.helper";

export interface QuestionMappingItem {
  questionId: number;
  questionText: string;
  qualificationName: string;
  memberType: string;
  memberId: number;
  memberQuestionId: number | null;
  oldMemberQuestionId: number | null;
  langCode: number;
  qualificationId: number;
}

export interface GetQuestionMappingResponse {
  status: number;
  success: boolean;
  message: string;
  errors: boolean;
  timestamp: string;
  data: {
    status: number;
    success: boolean;
    data: QuestionMappingItem[];
  };
}

// Fetch mapping
export const getQuestionMappings = async ({
  memberType,
  memberId,
  langCode,
}: {
  memberType: string;
  memberId: number;
  langCode: number;
}) => {
  const response = await axiosInstance.get<GetQuestionMappingResponse>(
    "/questions/getQuestionsMapping",
    { params: { memberType, memberId, langCode } }
  );
  return response.data;
};

// Fetch review mapping
export const getQuestionReviewMappings = async ({
  memberType,
  memberId,
  langCode,
}: {
  memberType: string;
  memberId: number;
  langCode: number;
}) => {
  const response = await axiosInstance.get<GetQuestionMappingResponse>(
    "/questions/getQuestionsReviewMapping",
    { params: { memberType, memberId, langCode } }
  );
  return response.data;
};

// ✅ Save for Review
export const updateQuestionReviewMapping = async ({
  memberType,
  memberId,
  langCode,
  optionData,
}: {
  memberType: number;
  memberId: string;
  optionData: {
    memberQuestionId: string;
    masterDemoId: number;
    masterQueryId: number;
  }[];
}) => {
  const cleanOptionData = optionData.map((item) => ({
    MemberQueryId: item.memberQuestionId,
    MasterDemoId: item.qualificationId,
    MasterQueryId: item.masterQueryId,
  }));

  const bodyData = {
    memberType,
    memberId,
    optionData: cleanOptionData,
    langCode,
  };

  const response = await axiosInstance.put(
    "/questions/updateQuestionReviewMapping",
    bodyData // ✅ direct भेजा
  );

  return response.data;
};

