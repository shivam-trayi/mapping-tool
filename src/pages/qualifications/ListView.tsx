import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Search, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Qualification {
  id: string;
  name: string;
  isTest: boolean;
  active: boolean;
  questions: { id: string; text: string }[];
}

type ViewType = 
  | 'list'
  | 'create'
  | 'edit'
  | 'addQuestion'
  | 'updateQuestion'
  | 'mapping'
  | 'demoMapping'
  | 'questionMapping';

const ListView: React.FC = () => {
  const [qualifications, setQualifications] = useState<Qualification[]>([
    {
      id: '1',
      name: 'Qualification 1',
      isTest: true,
      active: true,
      questions: [{ id: 'q1', text: 'Question 1' }],
    },
    {
      id: '2',
      name: 'Qualification 2',
      isTest: false,
      active: false,
      questions: [{ id: 'q2', text: 'Question 2' }, { id: 'q3', text: 'Question 3' }],
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [currentView, setCurrentView] = useState<ViewType>('list');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [isLoadingTable, setIsLoadingTable] = useState(false);

  const filteredQualifications = qualifications.filter((q) =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateQualification = () => {
    alert('Create qualification clicked');
  };

  const handleEditQualification = (qualification: Qualification) => {
    alert(`Edit qualification ${qualification.name}`);
  };

  const handleToggleActive = (id: string) => {
    setQualifications((prev) =>
      prev.map((q) => (q.id === id ? { ...q, active: !q.active } : q))
    );
  };

  return (
    <motion.div
      key="list-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search
              className={cn(
                'w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors',
                resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
              )}
            />
            <input
              type="text"
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors',
                'dark:bg-gray-900 dark:border-gray-600 dark:text-gray-100'
              )}
            />
          </div>
          <Filter
            className={cn(
              'w-5 h-5 transition-colors',
              resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-400'
            )}
          />
        </div>
        <div className="flex space-x-3">
          <Button onClick={() => setCurrentView('demoMapping')} variant="outline">
            Demo Priority Mapping
          </Button>
          <Button onClick={() => setCurrentView('mapping')} variant="outline">
            Qualifications Mapping
          </Button>
          <Button onClick={handleCreateQualification}>
            <Plus className="w-4 h-4 mr-2" />
            <span>Create Qualifications</span>
          </Button>
        </div>
      </div>

      <div
        className={cn(
          'rounded-2xl shadow-lg overflow-hidden',
          resolvedTheme === 'dark'
            ? 'bg-gray-800 text-gray-200 border border-gray-700'
            : 'bg-white text-gray-900 border border-gray-200'
        )}
      >
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead
            className={cn(
              'transition-colors',
              resolvedTheme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-50 text-gray-500'
            )}
          >
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Questions
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody
            className={cn(
              'divide-y transition-colors',
              resolvedTheme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
            )}
          >
            {isLoadingTable ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredQualifications.length > 0 ? (
              filteredQualifications.map((qualification) => (
                <tr
                  key={qualification.id}
                  className={cn(
                    'transition-colors',
                    resolvedTheme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                  )}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium">{qualification.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        qualification.isTest
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                          : 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      }`}
                    >
                      {qualification.isTest ? 'Test' : 'Production'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {qualification.questions.length} questions
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => handleToggleActive(qualification.id)} className="flex items-center">
                      {qualification.active ? (
                        <ToggleRight className="w-6 h-6 text-green-500" />
                      ) : (
                        <ToggleLeft className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditQualification(qualification)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="p-6 text-center text-gray-500">
                  No qualifications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default ListView;
