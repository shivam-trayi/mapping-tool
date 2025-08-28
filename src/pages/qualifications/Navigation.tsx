import React from 'react';
import { cn } from '@/lib/utils';
import type { ViewType } from '../../types/qualicationTypes';

interface NavigationProps {
  currentView: ViewType;
  resolvedTheme: 'light' | 'dark';
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, resolvedTheme }) => {
  let breadcrumbs: string[];
  
  switch(currentView) {
    case 'create':
      breadcrumbs = ['Qualifications', 'Create Qualification'];
      break;
    case 'edit':
      breadcrumbs = ['Qualifications', 'Update Qualification'];
      break;
    case 'addQuestion':
      breadcrumbs = ['Qualifications', 'Update Qualification', 'Add Qualification Query'];
      break;
    case 'updateQuestion':
      breadcrumbs = ['Qualifications', 'Update Qualification', 'Update Question'];
      break;
    case 'mapping':
      breadcrumbs = ['Qualifications', 'Qualifications Mapping'];
      break;
    case 'demoMapping':
      breadcrumbs = ['Qualifications', 'Demo Priority Mapping'];
      break;
    default:
      breadcrumbs = ['Qualifications'];
  }

  return (
    <div className={cn(
      "border-b px-6 py-3 transition-colors",
      resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    )}>
      <div className="flex items-center space-x-6">
        <div className="flex text-sm text-gray-500 space-x-1">
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              {index > 0 && (
                <span className={resolvedTheme === 'dark' ? 'text-gray-600' : 'text-gray-400'}>
                  &gt;
                </span>
              )}
              <span className={cn(
                "transition-colors",
                index === breadcrumbs.length - 1 
                  ? (resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-800')
                  : (resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600')
              )}>
                {crumb}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};