// // types/questionTypes.ts

// export interface Option {
//   text: string;
//   language: string;
//   active: boolean;
// }

// export interface Question {
//   id: number;
//   text: string;
//   language: string;
//   type: "Radio" | "Checkbox" | "Text";
//   active: boolean;
//   options: Option[];
// }

// export interface Qualification {
//   id: number;
//   name: string;
//   isTest: boolean;
//   active: boolean;
//   questions: Question[];
// }

// // Frontend mapping entry
// export interface MappingEntry {
//   qualificationId: string;
//   questionId: string;
//   mapped: boolean;
//   externalId: string;
// }

// // Payload for saving
// export interface QualificationsMappingData {
//   qualification_id: string;
//   member_id: string;
//   member_type: "customer" | "supplier";
//   constantId: string;
//   member_qualification_id?: string;
//   old_member_qualification_id?: string;
//   qualificationName?: string;
// }

// export interface SaveQualMappingsPayload {
//   bodyData: QualificationsMappingData[];
// }

// export interface SaveQualMappingsResponse {
//   success: boolean;
//   data: QualificationsMappingData[];
//   message?: string;
// }

// export interface MappingReviewPayload {
//   memberId: number;
//   memberType: string;
//   createdBy?: number;
//   optionData: {
//     questionId: number;
//     qualificationId: number;
//     memberQuestionId?: number | null;
//     qualificationMappingId?: number | null;
//   }[];
// }

// export type Theme = "light" | "dark" | "system";

// export type ViewType =
//   | "list"
//   | "create"
//   | "edit"
//   | "mapping"
//   | "addQuestion"
//   | "qualificationsMapping"
//   | "questionMapping"
//   | "updateQuestion"
//   | "demoMapping"
//   | "questions"
//   | "addOption"
//   | "updateOption"
//   | "Option";
