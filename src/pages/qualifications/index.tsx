import React, { useState, useMemo, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Navigation } from './Navigation';
import { ListView } from './ListView';
import { CreateEditView } from './CreateEditView';
import { EditView } from './EditView';
import { AddQuestionView } from './AddQuestionView';
import { UpdateQuestionView } from './UpdateQuestionView';
import { DemoPriorityMappingView } from './DemoPriorityMappingView';
import { QualificationsMappingView } from './QualificationsMappingView';
import { QuestionMappingView } from './QuestionMappingView';
import { useDispatch, useSelector } from "react-redux";
import type { Qualification, Question, MappingEntry, ViewType } from '../../types/qualicationTypes';
import { DashboardHeader } from '../dashboard/DashboardHeader';
import { MessageBox } from '@/components/ui/MessageBox';
import { useTheme } from '@/hooks/useTheme';
import MappingReviewModal from './MappingReviewModal';
import { AddOptionView } from './AddOptionView';
import { UpdateOptionView } from './UpdateOptionView';
import { fetchQualifications } from '@/redux/slices/testing/qualificationSlice';

// Helper for unique ids
const uid = (p = "q") => `${p}_${Math.random().toString(36).slice(2, 9)}`;

const QualificationsDashboard: React.FC = () => {
    const dispatch = useDispatch();
    const { items, loading, error, pagination } = useSelector((state: any) => state.qualifications);


    const [qualifications, setQualifications] = useState<Qualification[]>([]);
    const [currentView, setCurrentView] = useState<ViewType>('list');
    const [mappings, setMappings] = useState<MappingEntry[]>([]);
    const [selectedQualification, setSelectedQualification] = useState<Qualification | null>(null);
    const [editingQualification, setEditingQualification] = useState<Qualification | null>(null);
    const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1); // Pagination
    const [pageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(1);


    const [newQuestion, setNewQuestion] = useState<Partial<Question>>({
        text: '',
        language: 'English-US',
        type: 'Radio',
        active: true,
        options: []
    });
    const [currentOption, setCurrentOption] = useState({
        text: '',
        language: 'English-US',
        active: true,
    });
    const [isGenerating, setIsGenerating] = useState(false);
    const [message, setMessage] = useState("");
    const [showMappingReviewModal, setShowMappingReviewModal] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const { resolvedTheme, toggleTheme } = useTheme();

    // Form state
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

    // 🚀 Fetch qualifications from API
    useEffect(() => {
        dispatch(fetchQualifications({ page: currentPage, limit: pageSize }) as any);
    }, [dispatch, currentPage, pageSize]);


    // Update local state when Redux data changes
    // Update local state when Redux data changes
    useEffect(() => {
        if (items && items.length) setQualifications(items);
        if (pagination?.totalPages) setTotalPages(pagination.totalPages);
        setCurrentPage(pagination?.page || 1);
        setIsLoadingTable(loading);
    }, [items, pagination, loading]);


    // Reset forms
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

    // CRUD handlers
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

    const handleEditQuestion = (question: Question, qualification: Qualification) => {
        setEditingQuestion(question);
        setEditingQualification(qualification);
        setUpdateQuestionForm({
            text: question.text,
            language: question.language,
            type: question.type,
            options: question.options || [],
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
            resetForm();
            setMessage("Question added successfully!");
            setCurrentView('edit');
            setIsSaving(false);
        }, 1000);
    };

    const handleToggleActive = (id: string) => {
        setQualifications(qualifications.map(q =>
            q.id === id ? { ...q, active: !q.active } : q
        ));
    };

    const filteredQualifications = useMemo(() => {
        return qualifications.filter(q =>
            q.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [qualifications, searchTerm]);

    // Loading animation for table
    useEffect(() => {
        setIsLoadingTable(loading);
    }, [loading]);

    const commonProps = {
        currentView, setCurrentView,
        qualifications, setQualifications,
        mappings, setMappings,
        selectedQualification, setSelectedQualification,
        editingQualification, setEditingQualification,
        editingQuestion, setEditingQuestion,
        searchTerm, setSearchTerm,
        newQuestion, setNewQuestion,
        isGenerating, setIsGenerating,
        message, setMessage,
        showMappingReviewModal, setShowMappingReviewModal,
        isSaving, setIsSaving,
        isLoadingTable, setIsLoadingTable,
        resolvedTheme, toggleTheme,
        qualificationForm, setQualificationForm,
        updateQuestionForm, setUpdateQuestionForm,
        languages, questionTypes,
        resetForm,
        handleCreateQualification,
        handleEditQualification,
        handleEditQuestion,
        handleSaveQualification,
        handleUpdateQuestion,
        handleToggleActive,
        handleAddQuestion,
        filteredQualifications,
        uid,
        currentOption, setCurrentOption,
        currentPage,
        setCurrentPage,
        totalPages,
    };

    return (
        <div className={`min-h-screen antialiased transition-colors ${resolvedTheme === 'dark'
            ? 'bg-gray-900 text-gray-100'
            : 'bg-gray-100 text-gray-900'}`}>
            <DashboardHeader {...commonProps} />
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
                    {currentView === 'addOption' && <AddOptionView {...commonProps} />}
                    {currentView === 'updateOption' && <UpdateOptionView {...commonProps} />}
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
