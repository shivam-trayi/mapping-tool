import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { ViewType } from '../../types/qualicationTypes';

interface NavigationProps {
  currentView: ViewType;
  resolvedTheme: 'light' | 'dark';
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, resolvedTheme }) => {
  let breadcrumbs: { label: string; href?: string; isActive?: boolean }[];
  
  switch(currentView) {
    case 'create':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Create Qualification', isActive: true }
      ];
      break;
    case 'edit':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Update Qualification', isActive: true }
      ];
      break;
    case 'addQuestion':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Update Qualification', href: '#', isActive: false },
        { label: 'Add Qualification Query', isActive: true }
      ];
      break;
    case 'updateQuestion':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Update Qualification', href: '#', isActive: false },
        { label: 'Update Question', isActive: true }
      ];
      break;
    case 'mapping':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Qualifications Mapping', isActive: true }
      ];
      break;
    case 'demoMapping':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Demo Priority Mapping', isActive: true }
      ];
      break;
    case 'questionMapping':
      breadcrumbs = [
        { label: 'Qualifications', href: '#', isActive: false },
        { label: 'Qualifications Mapping', href: '#', isActive: false },
        { label: 'Question Mapping', isActive: true }
      ];
      break;
    default:
      breadcrumbs = [{ label: 'Qualifications', isActive: true }];
  }

  return (
    <div className={cn(
      "border-b px-6 py-4 transition-colors",
      resolvedTheme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'
    )}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#" className="flex items-center gap-2">
              <Home className="h-4 w-4" />
              <span>Home</span>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator>
            <ChevronRight className="h-4 w-4" />
          </BreadcrumbSeparator>
          {breadcrumbs.map((crumb, index) => (
            <React.Fragment key={index}>
              <BreadcrumbItem>
                {crumb.isActive ? (
                  <BreadcrumbPage className={cn(
                    "font-medium",
                    resolvedTheme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                  )}>
                    {crumb.label}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink 
                    href={crumb.href || '#'}
                    className={cn(
                      "transition-colors hover:text-primary",
                      resolvedTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}
                  >
                    {crumb.label}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {index < breadcrumbs.length - 1 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
            </React.Fragment>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
};
      </div>
    </div>
  );
};