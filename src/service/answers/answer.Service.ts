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

export const insertAnswerMappingReviewApi = async (payload: any) => {
  const { data } = await axiosInstance.post(
    "/questions/createOptionQueryMapping",
    payload
  );
  return data;
};


export interface UpdateAnswerPayload {
  memberId: number | string;
  memberType: string;
  optionData: {
    questionId: number;
    qualificationId: number;
    member_answer_id: string;
    memberQuestionId?: number | null;
    qualificationMappingId?: number | null;
  }[];
}

export const updateAnswerMappingApi = async (payload: UpdateAnswerPayload) => {
  const { data } = await axiosInstance.put(
    "/questions/updateOptionQueryMapping",
    payload
  );
  return data;
};

export interface OptionReviewParams {
  memberId: number;
  questionId: number;
}

export const getOptionQueryReviewMapping = async (params: OptionReviewParams) => {
  const { memberId, questionId } = params;
  const response = await axiosInstance.get(
    "/questions/getOptionQueryReviewMapping",
    { params: { memberId, questionId } }
  );

  return response.data.data;
};
