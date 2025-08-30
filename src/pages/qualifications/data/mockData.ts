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
        options: [
          { text: 'Hispanic or Latino', language: 'English-US', active: true },
          { text: 'White', language: 'English-US', active: true },
          { text: 'Black or African American', language: 'English-US', active: false },
          { text: 'Asian', language: 'English-US', active: true },
          { text: 'Native American', language: 'English-US', active: true },
          { text: 'Other', language: 'English-US', active: true }
        ]
      },
      {
        id: 'q2',
        text: '¿Cuál es su origen étnico?',
        language: 'Spanish',
        type: 'Radio',
        active: true,
        options: [
          { text: 'Hispano o Latino', language: 'Spanish', active: true },
          { text: 'Blanco', language: 'Spanish', active: true },
          { text: 'Negro o Afroamericano', language: 'Spanish', active: true },
          { text: 'Asiático', language: 'Spanish', active: false },
          { text: 'Nativo Americano', language: 'Spanish', active: true },
          { text: 'Otro', language: 'Spanish', active: true }
        ]
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
        options: [] // ✅ still fine
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
        options: [
          { text: 'Daily', language: 'English-US', active: true },
          { text: 'Weekly', language: 'English-US', active: true },
          { text: 'Bi-weekly', language: 'English-US', active: false },
          { text: 'Monthly', language: 'English-US', active: true },
          { text: 'Rarely', language: 'English-US', active: true }
        ]
      },
      {
        id: 'q5',
        text: 'Which grocery stores do you frequent?',
        language: 'English-US',
        type: 'Checkbox',
        active: true,
        options: [
          { text: 'Walmart', language: 'English-US', active: true },
          { text: 'Target', language: 'English-US', active: true },
          { text: 'Kroger', language: 'English-US', active: true },
          { text: 'Safeway', language: 'English-US', active: false },
          { text: 'Whole Foods', language: 'English-US', active: true },
          { text: 'Local stores', language: 'English-US', active: true }
        ]
      }
    ]
  }
];


export const mockMappings = [
  { qualificationId: '1', questionId: 'q1', mapped: true, externalId: 'ETH_001' },
  { qualificationId: '1', questionId: 'q2', mapped: true, externalId: 'ETH_002' },
  { qualificationId: '2', questionId: 'q3', mapped: false, externalId: '' },
  { qualificationId: '3', questionId: 'q4', mapped: true, externalId: 'GS_001' },
  { qualificationId: '3', questionId: 'q5', mapped: false, externalId: '' }
];