
// Option type for questions
export interface Option {
  text: string;
  language: string;
  active: boolean;
}

// Question type
export interface Question {
  id: string;
  text: string;
  language: string;
  type: 'Radio' | 'Checkbox' | 'Text';
  active: boolean;
  options: Option[];
}

// Qualification type
export interface Qualification {
  id: string;
  name: string;
  isTest: boolean;
  active: boolean;
  questions: Question[];
}

// Mapping entry for frontend
export interface MappingEntry {
  qualificationId: string;
  questionId: string;
  mapped: boolean;
  externalId: string;
}

// Qualification Mapping Data (used for saving to API)
export interface QualificationsMappingData {
  qualification_id: string;
  member_id: string;
  member_type: 'customer' | 'supplier'; // REQUIRED
  member_qualification_id?: string;
  created_by?: string;
  updated_by?: string;
  old_member_qualification_id?: string;
  constantId: string;
}


interface QualificationMappingReviewItem {
  id: string;
  qualification_id: string;
  qualificationName: string;
  member_id: string;
  member_qualification_id?: string;
  constantId: string;
}


export interface SaveQualMappingsPayload {
  memberId: string;
}


// Theme type
export type Theme = 'light' | 'dark' | 'system';

// Views in frontend
export type ViewType =
  | 'list'
  | 'create'
  | 'edit'
  | 'mapping'
  | 'addQuestion'
  | 'qualificationsMapping'
  | 'questionMapping'
  | 'updateQuestion'
  | 'demoMapping'
  | 'questions'
  | 'addOption'
  | 'updateOption'
  | 'Option'


//   export interface QualificationsMappingData {
//   qualification_id: string;
//   member_id: string;
//   member_type: "customer" | "supplier";
//   member_qualification_id?: string;
//   created_by?: string;
//   updated_by?: string;
//   old_member_qualification_id?: string;
//   constantId: string;
// }

export interface SaveQualMappingsPayload {
  bodyData: QualificationsMappingData[];
}

export interface GetAllQualMappingsPayload {
  memberId: string;
}

export interface SaveQualMappingsResponse {
  success: boolean;
  data: QualificationsMappingData[];
  message?: string;
}



export interface MappingReviewPayload {
  memberId: number;
  memberType: string;
  createdBy?: number;
  optionData: {
    questionId: number;
    qualificationId: number;
    memberQuestionId?: number | null;
    qualificationMappingId?: number | null;
  }[];
}
