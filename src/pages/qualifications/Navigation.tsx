import React, { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { ViewType } from '../../types/qualicationTypes';

interface NavigationProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  setSearchTerm?: (term: string) => void;
  resolvedTheme: 'light' | 'dark';
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  setSearchTerm,
  resolvedTheme,
}) => {
  const breadcrumbs = useMemo(() => {
    switch (currentView) {
      case 'create':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Create Qualification', view: 'create' },
        ];
      case 'edit':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Update Qualification', view: 'edit' },
        ];
      case 'addQuestion':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Update Qualification', view: 'edit' },
          { name: 'Add Question', view: 'addQuestion' },
        ];
      case 'updateQuestion':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Update Qualification', view: 'edit' },
          { name: 'Update Question', view: 'updateQuestion' },
        ];
      case 'addOption':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Update Qualification', view: 'edit' },
          { name: 'Update Question', view: 'updateQuestion' },
          { name: 'Add Option', view: 'addOption' },
        ];
      case 'updateOption':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Update Qualification', view: 'edit' },
          { name: 'Update Question', view: 'updateQuestion' },
          { name: 'Update Option', view: 'updateOption' },
        ];
      case 'mapping':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Qualifications Mapping', view: 'mapping' },
        ];
      case 'demoMapping':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Demo Priority Mapping', view: 'demoMapping' },
        ];
      case 'questionMapping':
        return [
          { name: 'Qualifications', view: 'list' },
          { name: 'Question Mapping', view: 'questionMapping' },
        ];
      default:
        return [{ name: 'Qualifications', view: 'list' }];
    }
  }, [currentView]);

  const handleBreadcrumbClick = (view: ViewType) => {
    if (view === 'list' && setSearchTerm) {
      setSearchTerm('');
    }
    setCurrentView(view);
  };

  return (
    <div
      className={cn(
        "border-b px-6 py-3 transition-colors",
        resolvedTheme === 'dark'
          ? 'bg-gray-800 border-gray-700'
          : 'bg-gray-50 border-gray-200'
      )}
    >
      <div className="flex items-center space-x-2">
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center">
            <button
              onClick={() => handleBreadcrumbClick(crumb.view as ViewType)}
              className={cn(
                "text-sm transition-colors",
                index === breadcrumbs.length - 1
                  ? resolvedTheme === 'dark'
                    ? 'text-gray-200'
                    : 'text-gray-800 font-medium'
                  : resolvedTheme === 'dark'
                  ? 'text-gray-400 hover:text-gray-200'
                  : 'text-gray-600 hover:text-gray-800'
              )}
            >
              {crumb.name}
            </button>
            {index < breadcrumbs.length - 1 && (
              <span
                className={cn(
                  "mx-2 transition-colors",
                  resolvedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'
                )}
              >
                &gt;
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
