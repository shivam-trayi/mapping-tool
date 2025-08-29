import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MappingReviewModal } from './MappingReviewModal';
import { Navigation } from './Navigation';
import { ListView } from './ListView';
import { CreateEditView } from './CreateEditView';
import { EditView } from './EditView';
import { AddQuestionView } from './AddQuestionView';
import { UpdateQuestionView } from './UpdateQuestionView';
import { DemoPriorityMappingView } from './DemoPriorityMappingView';
import { QualificationsMappingView } from './QualificationsMappingView';
import { QuestionMappingView } from './QuestionMappingView';
import { mockQualifications, mockMappings } from './data/mockData';
import type { Qualification, Question, MappingEntry, ViewType } from '../../types/qualicationTypes';
import { Dashboard } from '../dashboard/Dashboard';
import { MessageBox } from '@/components/ui/MessageBox';
import { useTheme } from '@/hooks/useTheme';

// Add missing function
const getPriorityColor = (priority: number) => {
  if (priority <= 2) return 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100';
  if (priority <= 4) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100';
  return 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100';
};

// Helper to generate unique ids
const uid = (p = "q") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

const QualificationsDashboard: React.FC = () => {
    const [currentView, setCurrentView] = useState<ViewType>('list');
    const [qualifications, setQualifications] = useState<Qualification[]>(mockQualifications);
    const [mappings, setMappings] = useState<MappingEntry[]>(mockMappings);
    const [selectedQualification, setSelectedQualification] = useState<Qualification | null>(null);
    const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
        text: '',
        language: 'English-US',
        type: 'Radio',
        active: true,
        options: []
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState("");
    const [showMappingReviewModal, setShowMappingReviewModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const { resolvedTheme, toggleTheme } = useTheme();

    // Form state for create/edit qualification
    const [qualificationForm, setQualificationForm] = useState({
        name: '',
        isTest: false,
        active: true
    });

    const [updateQuestionForm, setUpdateQuestionForm] = useState<Partial<Question>>({
        text: '',
        language: 'English-US',
        type: 'Radio',
        options: []
    });

    const languages = ['English-US', 'Spanish', 'French', 'German', 'Italian'];
    const questionTypes: Question['type'][] = ['Radio', 'Checkbox', 'Text'];

    const resetForm = () => {
        setQualificationForm({ name: '', isTest: false, active: true });
        setNewQuestion({
            text: '',
            language: 'English-US',
            type: 'Radio',
            active: true,
            options: []
        });
    };

    const handleCreateQualification = () => {
        setCurrentView('create');
        resetForm();
    };

    const handleEditQualification = (qualification: Qualification) => {
        setEditingQualification(qualification);
        setQualificationForm({
            name: qualification.name,
            isTest: qualification.isTest,
            active: qualification.active
        });
        setCurrentView('edit');
    };

    const handleEditQuestion = (question: Question) => {
        setEditingQuestion(question);
        setUpdateQuestionForm({
            text: question.text,
            language: question.language,
            type: question.type,
            options: question.options,
        });
        setCurrentView('updateQuestion');
    };

    const handleSaveQualification = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (currentView === 'create') {
                const newQualification: Qualification = {
                    id: uid('qual'),
                    name: qualificationForm.name,
                    isTest: qualificationForm.isTest,
                    active: qualificationForm.active,
                    questions: []
                };
                setQualifications([...qualifications, newQualification]);
            } else if (currentView === 'edit' && editingQualification) {
                setQualifications(qualifications.map(q =>
                    q.id === editingQualification.id
                        ? { ...q, ...qualificationForm, questions: editingQualification.questions }
                        : q
                ));
            }
            setCurrentView('list');
            resetForm();
            setIsSaving(false);
            setMessage("Qualification saved successfully!");
        }, 1000);
    };

    const handleUpdateQuestion = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (!editingQualification || !editingQuestion) return;

            const updatedQuestions = editingQualification.questions.map(q =>
                q.id === editingQuestion.id ? { ...q, ...updateQuestionForm, active: q.active } : q
            );
            const updatedQualification = { ...editingQualification, questions: updatedQuestions };

            setQualifications(qualifications.map(q =>
                q.id === editingQualification.id ? updatedQualification : q
            ));
            setEditingQualification(updatedQualification);
            setMessage("Question updated successfully!");
            setCurrentView('edit');
            setIsSaving(false);
        }, 1000);
    };

    const handleToggleActive = (id: string) => {
        setQualifications(qualifications.map(q =>
            q.id === id ? { ...q, active: !q.active } : q
        ));
    };

    const handleViewQuestions = (qualification: Qualification) => {
        setSelectedQualification(qualification);
        setCurrentView('questions');
    };

    const handleAddQuestion = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (!editingQualification || !newQuestion.text) return;

            const question: Question = {
                id: uid('ques'),
                text: newQuestion.text!,
                language: newQuestion.language!,
                type: newQuestion.type!,
                active: newQuestion.active!,
                options: newQuestion.type === 'Text' ? [] : (newQuestion.options || [])
            };

            const updatedQualification = {
                ...editingQualification,
                questions: [...editingQualification.questions, question]
            };

            setQualifications(qualifications.map(q =>
                q.id === editingQualification.id ? updatedQualification : q
            ));
            setEditingQualification(updatedQualification);

            setNewQuestion({
                text: '',
                language: 'English-US',
                type: 'Radio',
                active: true,
                options: []
            });
            setMessage("Question added successfully!");
            setCurrentView('edit');
            setIsSaving(false);
        }, 1000);
    };

    const handleToggleQuestionActive = (questionId: string) => {
        if (!editingQualification) return;
        const updatedQualification = {
            ...editingQualification,
            questions: editingQualification.questions.map(q =>
                q.id === questionId ? { ...q, active: !q.active } : q
            )
        };
        setQualifications(qualifications.map(q =>
            q.id === editingQualification.id ? updatedQualification : q
        ));
        setEditingQualification(updatedQualification);
    };

    const handleGenerateQuestions = async () => {
        if (!editingQualification?.name) {
            setMessage("Please select a qualification to generate questions for.");
            return;
        }
        setIsGenerating(true);

        // Simulate API call for question generation
        setTimeout(() => {
            const generatedQuestions = [
                {
                    text: `What is your experience with ${editingQualification.name}?`,
                    language: 'English-US',
                    type: 'Radio' as const,
                    options: ['Beginner', 'Intermediate', 'Advanced', 'Expert']
                },
                {
                    text: `How often do you use ${editingQualification.name}?`,
                    language: 'English-US',
                    type: 'Radio' as const,
                    options: ['Daily', 'Weekly', 'Monthly', 'Rarely']
                }
            ];

            const newQuestions = generatedQuestions.map(q => ({
                id: uid("ques"),
                ...q,
                active: true,
                options: q.options || []
            }));

            const updatedQualification = {
                ...editingQualification,
                questions: [...(editingQualification.questions || []), ...newQuestions]
            };

            setQualifications(s =>
                s.map(q =>
                    q.id === editingQualification.id
                        ? updatedQualification
                        : q
                )
            );
            setEditingQualification(updatedQualification);
            setMessage("Questions generated and added successfully.");
            setIsGenerating(false);
        }, 2000);
    };

    const handleUpdateExternalId = (qualificationId: string, questionId: string, externalId: string) => {
        setMappings(mappings.map(m =>
            m.qualificationId === qualificationId && m.questionId === questionId
                ? { ...m, externalId }
                : m
        ));
    };

    const handleToggleMapping = (qualificationId: string, questionId: string) => {
        setMappings(mappings.map(m =>
            m.qualificationId === qualificationId && m.questionId === questionId
                ? { ...m, mapped: !m.mapped }
                : m
        ));
    };

    const filteredQualifications = useMemo(() => {
        return qualifications.filter(q =>
            q.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [qualifications, searchTerm]);

    // Handle loading state for table on view change
    useEffect(() => {
        setIsLoadingTable(true);
        const timer = setTimeout(() => {
            setIsLoadingTable(false);
        }, 500);
        return () => clearTimeout(timer);
    }, [currentView]);

    const commonProps = {
        currentView,
        setCurrentView,
        qualifications,
        setQualifications,
        mappings,
        setMappings,
        selectedQualification,
        setSelectedQualification,
        editingQualification,
        setEditingQualification,
        editingQuestion,
        setEditingQuestion,
        searchTerm,
        setSearchTerm,
        newQuestion,
        setNewQuestion,
        isGenerating,
        setIsGenerating,
        message,
        setMessage,
        showMappingReviewModal,
        setShowMappingReviewModal,
        isSaving,
        setIsSaving,
        isLoadingTable,
        setIsLoadingTable,
        resolvedTheme,
        toggleTheme,
        qualificationForm,
        setQualificationForm,
        updateQuestionForm,
        setUpdateQuestionForm,
        languages,
        questionTypes,
        resetForm,
        handleCreateQualification,
        handleEditQualification,
        handleEditQuestion,
        handleSaveQualification,
        handleUpdateQuestion,
        handleToggleActive,
        handleViewQuestions,
        handleAddQuestion,
        handleToggleQuestionActive,
        handleGenerateQuestions,
        handleUpdateExternalId,
        handleToggleMapping,
        filteredQualifications,
        uid,
        getPriorityColor
    };

    return (
        <div className={`min-h-screen antialiased transition-colors ${resolvedTheme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-gray-100 text-gray-900'
            }`}>
            <Dashboard {...commonProps} />
            <Navigation {...commonProps} />

            <main className="max-w-7xl mx-auto">
                <AnimatePresence mode="wait">
                    {currentView === 'list' && <ListView {...commonProps} />}
                    {currentView === 'create' && <CreateEditView {...commonProps} />}
                    {currentView === 'edit' && <EditView {...commonProps} />}
                    {currentView === 'addQuestion' && <AddQuestionView {...commonProps} />}
                    {currentView === 'updateQuestion' && <UpdateQuestionView {...commonProps} />}
                    {currentView === 'mapping' && <QualificationsMappingView {...commonProps} />}
                    {currentView === 'demoMapping' && <DemoPriorityMappingView {...commonProps} />}
                    {currentView === 'questionMapping' && <QuestionMappingView {...commonProps} />}
                </AnimatePresence>
            </main>

            <MessageBox
                message={message}
                onClose={() => setMessage("")}
                resolvedTheme={resolvedTheme}
            />

            <MappingReviewModal
                isOpen={showMappingReviewModal}
                onClose={() => setShowMappingReviewModal(false)}
                mappings={mappings}
                qualifications={qualifications}
                resolvedTheme={resolvedTheme}
            />
        </div>
    );
};

export default QualificationsDashboard;