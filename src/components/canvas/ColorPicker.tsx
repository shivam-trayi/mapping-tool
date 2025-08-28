import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface ColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  strokeWidth: number;
  onStrokeWidthChange: (width: number) => void;
}

const predefinedColors = [
  '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
  '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
  '#FFC0CB', '#A52A2A', '#808080', '#008000', '#000080',
  '#1A73E8', '#34A853', '#6B7280', '#F59E0B', '#EF4444'
];

export function ColorPicker({ color, onChange, strokeWidth, onStrokeWidthChange }: ColorPickerProps) {
  const [customColor, setCustomColor] = useState(color);

  return (
    <Card className="p-4 gradient-subtle border-border/50">
      <div className="space-y-4">
        {/* Color Selection */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">Color</Label>
          <div className="flex flex-wrap gap-2">
            {predefinedColors.map((presetColor) => (
              <button
                key={presetColor}
                className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 ${
                  color === presetColor 
                    ? 'border-primary scale-110 shadow-glow' 
                    : 'border-border hover:border-primary/50 hover:scale-105'
                }`}
                style={{ backgroundColor: presetColor }}
                onClick={() => onChange(presetColor)}
                title={presetColor}
              />
            ))}
          </div>
          
          {/* Custom Color Picker */}
          <div className="flex items-center gap-2 mt-2">
            <input
              type="color"
              value={customColor}
              onChange={(e) => {
                setCustomColor(e.target.value);
                onChange(e.target.value);
              }}
              className="w-12 h-8 rounded-lg border border-border cursor-pointer"
            />
            <span className="text-sm text-muted-foreground font-mono">
              {color.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Stroke Width */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Stroke Width: {strokeWidth}px
          </Label>
          <Slider
            value={[strokeWidth]}
            onValueChange={(value) => onStrokeWidthChange(value[0])}
            max={20}
            min={1}
            step={1}
            className="w-full"
          />
          
          {/* Visual Preview */}
          <div className="flex items-center justify-center py-2">
            <div
              className="rounded-full"
              style={{
                width: `${Math.max(strokeWidth, 4)}px`,
                height: `${Math.max(strokeWidth, 4)}px`,
                backgroundColor: color,
                border: color === '#FFFFFF' ? '1px solid #e5e5e5' : 'none'
              }}
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-2 pt-2 border-t border-border/50">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1 text-xs">
                Presets
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2">
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange('#1A73E8');
                    onStrokeWidthChange(2);
                  }}
                >
                  Primary Pen
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange('#000000');
                    onStrokeWidthChange(8);
                  }}
                >
                  Marker
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    onChange('#EF4444');
                    onStrokeWidthChange(3);
                  }}
                >
                  Highlighter
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
}