import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ToolbarProps {
  activeTool: 'select' | 'draw' | 'rectangle' | 'circle' | 'text';
  onToolClick: (tool: 'select' | 'draw' | 'rectangle' | 'circle' | 'text') => void;
  onClear: () => void;
  onSave: () => void;
  onLoad: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CursorIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/>
  </svg>
);

const PenIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 19l7-7 3 3-7 7-3-3z"/>
    <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
    <path d="M2 2l7.586 7.586"/>
    <circle cx="11" cy="11" r="2"/>
  </svg>
);

const RectangleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
  </svg>
);

const CircleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

const TextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="4,7 4,4 20,4 20,7"/>
    <line x1="9" y1="20" x2="15" y2="20"/>
    <line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);

const SaveIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

const UploadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
    <polyline points="14,2 14,8 20,8"/>
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6"/>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
  </svg>
);

export function Toolbar({ activeTool, onToolClick, onClear, onSave, onLoad }: ToolbarProps) {
  const tools = [
    { id: 'select' as const, icon: CursorIcon, label: 'Select' },
    { id: 'draw' as const, icon: PenIcon, label: 'Draw' },
    { id: 'rectangle' as const, icon: RectangleIcon, label: 'Rectangle' },
    { id: 'circle' as const, icon: CircleIcon, label: 'Circle' },
    { id: 'text' as const, icon: TextIcon, label: 'Text' },
  ];

  return (
    <Card className="p-4 gradient-subtle border-border/50">
      <div className="flex flex-wrap items-center gap-2">
        {/* Drawing Tools */}
        <div className="flex items-center gap-1 pr-4 border-r border-border/50">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Button
                key={tool.id}
                variant={activeTool === tool.id ? "default" : "ghost"}
                size="sm"
                onClick={() => onToolClick(tool.id)}
                className={`w-9 h-9 p-0 ${
                  activeTool === tool.id 
                    ? 'gradient-primary text-white shadow-glow' 
                    : 'hover:bg-accent'
                }`}
                title={tool.label}
              >
                <Icon />
              </Button>
            );
          })}
        </div>

        {/* File Operations */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={onSave}
            className="w-9 h-9 p-0 hover:bg-accent"
            title="Save Design"
          >
            <SaveIcon />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-9 h-9 p-0 hover:bg-accent relative overflow-hidden"
            title="Load Design"
          >
            <UploadIcon />
            <input
              type="file"
              accept=".json"
              onChange={onLoad}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="w-9 h-9 p-0 hover:bg-destructive hover:text-destructive-foreground"
            title="Clear Canvas"
          >
            <TrashIcon />
          </Button>
        </div>
      </div>
    </Card>
  );
}