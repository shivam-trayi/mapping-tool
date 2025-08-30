export interface Question {
  id: string;
  text: string;
  language: string;
  type: 'Radio' | 'Checkbox' | 'Text';
  active: boolean;
  options: Option[]; // <-- change from string[] to Option[]
}

export interface Qualification {
  id: string;
  name: string;
  isTest: boolean;
  active: boolean;
  questions: Question[];
}

export interface MappingEntry {
  qualificationId: string;
  questionId: string;
  mapped: boolean;
  externalId: string;
}

export interface Option {
  text: string;
  language: string;
  active: boolean;
}


export type Theme = 'light' | 'dark' | 'system';

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