// export interface Question {
//   id: string;
//   text: string;
//   language: string;
//   type: 'Radio' | 'Checkbox' | 'Text';
//   active: boolean;
//   options: Option[]; // <-- change from string[] to Option[]
// }

// export interface Qualification {
//   id: string;
//   name: string;
//   isTest: boolean;
//   active: boolean;
//   questions: Question[];
// }

// export interface MappingEntry {
//   qualificationId: string;
//   questionId: string;
//   mapped: boolean;
//   externalId: string;
// }

// export interface Option {
//   text: string;
//   language: string;
//   active: boolean;
// }


// export type Theme = 'light' | 'dark' | 'system';

// export type ViewType =
//   | 'list'
//   | 'create'
//   | 'edit'
//   | 'mapping'
//   | 'addQuestion'
//   | 'qualificationsMapping'
//   | 'questionMapping'
//   | 'updateQuestion'
//   | 'demoMapping'
//   | 'questions'
//   | 'addOption'
//   | 'updateOption';


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
  member_type: 'customer' | 'supplier';
  member_qualification_id?: string;
  created_by?: string;
  updated_by?: string;
  old_member_qualification_id?: string;
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
  | 'updateOption';
