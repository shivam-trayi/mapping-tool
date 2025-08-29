import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface Qualification {
  id: number;
  name: string;
}

export const DemoPriorityMappingViewMock: React.FC = () => {
  const [view, setView] = useState<'list' | 'demoPriority'>('demoPriority');
  const [searchTerm, setSearchTerm] = useState('');
  const [qualifications, setQualifications] = useState<Qualification[]>([
    { id: 1, name: 'Qualification A' },
    { id: 2, name: 'Qualification B' },
    { id: 3, name: 'Qualification C' },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  const filteredQualifications = qualifications.filter(q =>
    q.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <motion.div
      key="demo-priority-mapping-view"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Demo Priority Mapping</h2>
        <Button onClick={() => setView('list')} variant="default">
          Back to Qualification
        </Button>
      </div>

      <div className={cn(
        "flex items-center space-x-4 mb-6 transition-colors",
        theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
      )}>
        <input 
          type="text"
          placeholder="Search by name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600"
        />
        <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600">
          <option>Select Language</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded-lg dark:bg-gray-900 dark:text-gray-100 dark:border-gray-600">
          <option>Select Customer</option>
        </select>
      </div>

      <div className={cn(
        "rounded-lg shadow overflow-hidden transition-colors",
        theme === 'dark' ? 'bg-gray-800 border border-gray-700' : 'bg-white border border-gray-200'
      )}>
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className={cn(
            "transition-colors",
            theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'
          )}>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">S.No</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Qualifications</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Mapped</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-200">Enter Constant Id</th>
            </tr>
          </thead>
          <tbody className={cn(
            "divide-y transition-colors",
            theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'
          )}>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-6 text-center text-gray-500">Loading...</td>
              </tr>
            ) : (
              filteredQualifications.map((q, idx) => (
                <tr key={q.id} className={cn(
                  "transition-colors",
                  theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-50'
                )}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{idx + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{q.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">Not Mapped</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input type="text" className="px-2 py-1 w-full border rounded-lg dark:bg-gray-900 dark:border-gray-600" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className="p-4 text-right">
          <Button>Save Review</Button>
        </div>
      </div>
    </motion.div>
  );
};
