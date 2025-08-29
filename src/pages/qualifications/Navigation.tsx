import React from 'react';
import { motion } from 'framer-motion';
import { 
  Home, 
  List, 
  Plus, 
  Map, 
  FileText, 
  Target,
  ChevronRight 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbHome
} from '@/components/ui/breadcrumb';
import { cn } from '@/lib/utils';
import type { ViewType } from '../../types/qualicationTypes';

interface NavigationProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  resolvedTheme: 'light' | 'dark';
}

export const Navigation: React.FC<NavigationProps> = ({
  currentView,
  setCurrentView,
  resolvedTheme
}) => {
  const getViewTitle = (view: ViewType): string => {
    switch (view) {
      case 'list': return 'Qualifications List';
      case 'create': return 'Create Qualification';
      case 'edit': return 'Edit Qualification';
      case 'addQuestion': return 'Add Question';
      case 'updateQuestion': return 'Update Question';
      case 'mapping': return 'Qualifications Mapping';
      case 'questionMapping': return 'Question Mapping';
      case 'demoMapping': return 'Demo Priority Mapping';
      default: return 'Dashboard';
    }
  };

  const getBreadcrumbPath = (view: ViewType) => {
    const basePath = [
      { label: 'Dashboard', view: 'list' as ViewType, icon: Home }
    ];

    switch (view) {
      case 'list':
        return [...basePath, { label: 'Qualifications', view: 'list' as ViewType }];
      case 'create':
        return [...basePath, 
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Create', view: 'create' as ViewType }
        ];
      case 'edit':
        return [...basePath,
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Edit', view: 'edit' as ViewType }
        ];
      case 'addQuestion':
        return [...basePath,
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Edit', view: 'edit' as ViewType },
          { label: 'Add Question', view: 'addQuestion' as ViewType }
        ];
      case 'updateQuestion':
        return [...basePath,
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Edit', view: 'edit' as ViewType },
          { label: 'Update Question', view: 'updateQuestion' as ViewType }
        ];
      case 'mapping':
        return [...basePath,
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Mapping', view: 'mapping' as ViewType }
        ];
      case 'questionMapping':
        return [...basePath,
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Question Mapping', view: 'questionMapping' as ViewType }
        ];
      case 'demoMapping':
        return [...basePath,
          { label: 'Qualifications', view: 'list' as ViewType },
          { label: 'Demo Priority Mapping', view: 'demoMapping' as ViewType }
        ];
      default:
        return basePath;
    }
  };

  const breadcrumbPath = getBreadcrumbPath(currentView);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "border-b px-6 py-4 transition-colors",
        resolvedTheme === 'dark' 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      )}
    >
      <div className="flex items-center justify-between">
        {/* Breadcrumb Navigation */}
        <div className="flex-1">
          <Breadcrumb>
            <BreadcrumbList>
              {breadcrumbPath.map((item, index) => (
                <React.Fragment key={item.view}>
                  <BreadcrumbItem>
                    {index === breadcrumbPath.length - 1 ? (
                      <BreadcrumbPage className="flex items-center gap-2">
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink 
                        onClick={() => setCurrentView(item.view)}
                        className="flex items-center gap-2 cursor-pointer hover:text-primary transition-colors"
                      >
                        {item.icon && <item.icon className="w-4 h-4" />}
                        {item.label}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbPath.length - 1 && (
                    <BreadcrumbSeparator>
                      <ChevronRight className="w-4 h-4" />
                    </BreadcrumbSeparator>
                  )}
                </React.Fragment>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2">
          {currentView === 'list' && (
            <>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setCurrentView('create')} 
                  size="sm"
                  className="gradient-primary text-white hover:shadow-glow transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setCurrentView('mapping')} 
                  variant="outline"
                  size="sm"
                >
                  <Map className="w-4 h-4 mr-2" />
                  Mapping
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  onClick={() => setCurrentView('demoMapping')} 
                  variant="outline"
                  size="sm"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Demo Priority
                </Button>
              </motion.div>
            </>
          )}
          
          {(currentView === 'mapping' || currentView === 'questionMapping') && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => setCurrentView('questionMapping')} 
                variant="outline"
                size="sm"
              >
                <FileText className="w-4 h-4 mr-2" />
                Question Mapping
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};