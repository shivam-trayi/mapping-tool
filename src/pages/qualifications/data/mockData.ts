import type { Qualification, MappingEntry } from '../../../types/qualicationTypes';

export const mockQualifications: Qualification[] = [
  {
    id: '1',
    name: 'Ethnicity (US) v3',
    isTest: false,
    active: true,
    questions: [
      {
        id: 'q1',
        text: 'Which of the following best describes you?',
        language: 'English-US',
        type: 'Radio',
        active: true,
        options: ['Hispanic or Latino', 'White', 'Black or African American', 'Asian', 'Native American', 'Other']
      },
      {
        id: 'q2',
        text: '¿Cuál es su origen étnico?',
        language: 'Spanish',
        type: 'Radio',
        active: true,
        options: ['Hispano o Latino', 'Blanco', 'Negro o Afroamericano', 'Asiático', 'Nativo Americano', 'Otro']
      }
    ]
  },
  {
    id: '2',
    name: 'MSA (US)',
    isTest: true,
    active: true,
    questions: [
      {
        id: 'q3',
        text: 'What is your Metropolitan Statistical Area?',
        language: 'English-US',
        type: 'Text',
        active: true,
        options: []
      }
    ]
  },
  {
    id: '3',
    name: 'Grocery Shopper',
    isTest: false,
    active: false,
    questions: [
      {
        id: 'q4',
        text: 'How often do you shop for groceries?',
        language: 'English-US',
        type: 'Radio',
        active: true,
        options: ['Daily', 'Weekly', 'Bi-weekly', 'Monthly', 'Rarely']
      },
      {
        id: 'q5',
        text: 'Which grocery stores do you frequent?',
        language: 'English-US',
        type: 'Checkbox',
        active: true,
        options: ['Walmart', 'Target', 'Kroger', 'Safeway', 'Whole Foods', 'Local stores']
      }
    ]
  }
];

export const mockMappings: MappingEntry[] = [
  { qualificationId: '1', questionId: 'q1', mapped: true, externalId: 'ETH_001' },
  { qualificationId: '1', questionId: 'q2', mapped: true, externalId: 'ETH_002' },
  { qualificationId: '2', questionId: 'q3', mapped: false, externalId: '' },
  { qualificationId: '3', questionId: 'q4', mapped: true, externalId: 'GS_001' },
  { qualificationId: '3', questionId: 'q5', mapped: false, externalId: '' }
];