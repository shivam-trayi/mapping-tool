import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Search, ToggleLeft, ToggleRight, Save, X, List, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';


type Qualification = {
    id: string;
    name: string;
    isTest: boolean;
    active: boolean;
};

type Question = {
    id: string;
    text: string;
    language: string;
    active: boolean;
};

const dummyQualifications: Qualification[] = [
    { id: '1', name: 'Qualification A', isTest: false, active: true },
    { id: '2', name: 'Qualification B', isTest: true, active: false },
];

const dummyQuestions: Question[] = [
    { id: 'q1', text: 'Question 1', language: 'English', active: true },
    { id: 'q2', text: 'Question 2', language: 'Hindi', active: false },
];

const EditView: React.FC = () => {
    const [qualificationForm, setQualificationForm] = useState({ name: 'Qualification A', isTest: false, active: true });
    const [searchTerm, setSearchTerm] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [resolvedTheme] = useState<'light' | 'dark'>('light');
    const navigate = useNavigate();


    const handleSaveQualification = () => {
        setIsSaving(true);
        setTimeout(() => setIsSaving(false), 1000); // dummy save
    };

    const handleToggleActive = (id: string) => {
        console.log('Toggle active for', id);
    };

    const filteredQuestions = dummyQuestions.filter(q => q.text.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <motion.div
            key="edit-view"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="p-6"
        >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h2 className={cn("text-2xl font-bold transition-colors", resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900')}>
                    Update Qualifications
                </h2>
                <Button variant="default">
                    <List className="w-4 h-4 mr-2" />
                    Qualification list
                </Button>
            </div>

            {/* Qualification Form */}
            <div className={cn("rounded-2xl shadow-lg p-8 mb-6 transition-colors", resolvedTheme === 'dark' ? 'bg-gray-800 text-gray-100 border border-gray-700' : 'bg-white text-gray-900 border border-gray-200')}>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                            Qualification name*
                        </label>
                        <input
                            type="text"
                            value={qualificationForm.name}
                            onChange={(e) => setQualificationForm({ ...qualificationForm, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100"
                            placeholder="Enter qualification name"
                        />
                    </div>
                    <div className="flex justify-end">
                        <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={qualificationForm.isTest}
                                onChange={(e) => setQualificationForm({ ...qualificationForm, isTest: e.target.checked })}
                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-800"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-200">IsTest</span>
                        </label>
                    </div>
                </div>
                <div className="flex space-x-3 mt-8">
                    <Button onClick={handleSaveQualification} disabled={isSaving}>
                        <Save className="w-4 h-4 mr-2" />
                        {isSaving ? 'Updating...' : 'Update'}
                    </Button>
                    <Button variant="outline" disabled={isSaving}>
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                    </Button>
                </div>
            </div>

            {/* Questions Table */}
            <div className={cn("rounded-2xl shadow-lg overflow-hidden transition-colors", resolvedTheme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200')}>
                <div className="px-8 py-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        <h3 className={cn("text-xl font-bold transition-colors", resolvedTheme === 'dark' ? 'text-gray-100' : 'text-gray-900')}>Question list</h3>
                        <div className="relative">
                            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100 transition-colors"
                            />
                        </div>
                    </div>
                    <div className="flex space-x-3">
                        <Button onClick={() => navigate("/dashboard/add-question")} className="gradient-primary text-white hover:shadow-glow transition-all duration-300">
                            <Plus className="w-4 h-4 mr-2" /> Add Question
                        </Button>
                        <Button variant="outline">
                            <HelpCircle className="w-4 h-4 mr-2" /> Question List
                        </Button>
                    </div>
                </div>

                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className={cn("transition-colors", resolvedTheme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">S.No</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Question</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Language</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Update/Edit</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Active/Inactive</th>
                        </tr>
                    </thead>
                    <tbody className={cn(resolvedTheme === "dark" ? "divide-gray-700" : "divide-gray-200")}>
                        {isLoadingTable ? (
                            [...Array(4)].map((_, i) => (
                                <tr key={i} className="animate-pulse">
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-10 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-6 w-6 bg-gray-300 dark:bg-gray-700 rounded-full"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="h-4 w-12 bg-gray-300 dark:bg-gray-700 rounded"></div>
                                    </td>
                                </tr>
                            ))
                        ) : filteredQuestions.length > 0 ? (
                            filteredQuestions.map((q, index) => (
                                <tr key={q.id} className={cn(resolvedTheme === "dark" ? "hover:bg-gray-700" : "hover:bg-gray-50")}>
                                    <td className="px-6 py-4 text-sm">{index + 1}</td>
                                    <td className="px-6 py-4 font-medium">{q.text}</td>
                                    <td className="px-6 py-4">{q.language}</td>
                                    <td className="px-6 py-4 text-sm font-medium">
                                        <Button
                                            variant="ghost"
                                            onClick={() => navigate("/dashboard/update-question")}
                                        >
                                            <Edit className="w-4 h-4" />
                                        </Button>
                                    </td>


                                    <td className="px-6 py-4">
                                        <button onClick={() => handleToggleActive(q.id)}>
                                            {q.active ? (
                                                <ToggleRight className="w-6 h-6 text-green-500" />
                                            ) : (
                                                <ToggleLeft className="w-6 h-6 text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="p-6 text-center text-gray-500">
                                    No questions found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
};

export default EditView;
