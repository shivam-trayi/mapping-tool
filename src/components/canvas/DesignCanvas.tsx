import { useEffect, useRef, useState } from "react";
import { Canvas as FabricCanvas, Circle, Rect, IText } from "fabric";
import { Toolbar } from "./Toolbar";
import { ColorPicker } from "./ColorPicker";
import { Card } from "@/components/ui/card";
import { useToast } from "../ui/use-toast";

export function DesignCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fabricCanvas, setFabricCanvas] = useState<FabricCanvas | null>(null);
  const [activeColor, setActiveColor] = useState("#1A73E8");
  const [strokeWidth, setStrokeWidth] = useState(2);
  const [activeTool, setActiveTool] = useState<"select" | "draw" | "rectangle" | "circle" | "text">("select");
  const { toast } = useToast();

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new FabricCanvas(canvasRef.current, {
      width: 800,
      height: 600,
      backgroundColor: "#ffffff",
    });

    // Initialize the freeDrawingBrush
    canvas.freeDrawingBrush.color = activeColor;
    canvas.freeDrawingBrush.width = strokeWidth;

    setFabricCanvas(canvas);
    
    toast({
      title: "Canvas Ready!",
      description: "Start creating your design with the tools above.",
    });

    return () => {
      canvas.dispose();
    };
  }, []);

  useEffect(() => {
    if (!fabricCanvas) return;

    fabricCanvas.isDrawingMode = activeTool === "draw";
    
    if (activeTool === "draw" && fabricCanvas.freeDrawingBrush) {
      fabricCanvas.freeDrawingBrush.color = activeColor;
      fabricCanvas.freeDrawingBrush.width = strokeWidth;
    }
  }, [activeTool, activeColor, strokeWidth, fabricCanvas]);

  const handleToolClick = (tool: typeof activeTool) => {
    setActiveTool(tool);

    if (!fabricCanvas) return;

    if (tool === "rectangle") {
      const rect = new Rect({
        left: 100,
        top: 100,
        fill: activeColor,
        width: 100,
        height: 60,
        stroke: activeColor,
        strokeWidth: 1,
        rx: 8,
        ry: 8,
      });
      fabricCanvas.add(rect);
      fabricCanvas.setActiveObject(rect);
    } else if (tool === "circle") {
      const circle = new Circle({
        left: 100,
        top: 100,
        fill: "transparent",
        stroke: activeColor,
        strokeWidth: strokeWidth,
        radius: 50,
      });
      fabricCanvas.add(circle);
      fabricCanvas.setActiveObject(circle);
    } else if (tool === "text") {
      const text = new IText("Click to edit", {
        left: 100,
        top: 100,
        fill: activeColor,
        fontSize: 20,
        fontFamily: "Inter, system-ui, sans-serif",
      });
      fabricCanvas.add(text);
      fabricCanvas.setActiveObject(text);
      text.enterEditing();
    }
    
    // Switch back to select tool after adding object
    if (tool !== "draw" && tool !== "select") {
      setTimeout(() => setActiveTool("select"), 100);
    }
  };

  const handleClear = () => {
    if (!fabricCanvas) return;
    fabricCanvas.clear();
    fabricCanvas.backgroundColor = "#ffffff";
    fabricCanvas.renderAll();
    
    toast({
      title: "Canvas Cleared",
      description: "Your canvas has been cleared successfully.",
    });
  };

  const handleSave = () => {
    if (!fabricCanvas) return;
    
    try {
      // Save as JSON for editing
      const json = fabricCanvas.toJSON();
      const dataStr = JSON.stringify(json, null, 2);
      const blob = new Blob([dataStr], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement("a");
      link.href = url;
      link.download = `vendor-design-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Design Saved",
        description: "Your design has been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save your design. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !fabricCanvas) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string);
        fabricCanvas.loadFromJSON(json, () => {
          fabricCanvas.renderAll();
          toast({
            title: "Design Loaded",
            description: "Your design has been loaded successfully.",
          });
        });
      } catch (error) {
        toast({
          title: "Load Failed",
          description: "Failed to load the design file. Please check the file format.",
          variant: "destructive",
        });
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = "";
  };

  const handleExportImage = () => {
    if (!fabricCanvas) return;
    
    try {
      const dataURL = fabricCanvas.toDataURL({
        format: 'png',
        quality: 1,
        multiplier: 2 // Higher resolution
      });
      
      const link = document.createElement("a");
      link.href = dataURL;
      link.download = `vendor-design-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "Image Exported",
        description: "Your design has been exported as PNG.",
      });
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export your design. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="flex-1">
          <Toolbar 
            activeTool={activeTool} 
            onToolClick={handleToolClick} 
            onClear={handleClear}
            onSave={handleSave}
            onLoad={handleLoad}
          />
        </div>
        <div className="lg:w-64">
          <ColorPicker 
            color={activeColor} 
            onChange={setActiveColor}
            strokeWidth={strokeWidth}
            onStrokeWidthChange={setStrokeWidth}
          />
        </div>
      </div>

      {/* Canvas */}
      <Card className="p-4 gradient-subtle border-border/50">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <canvas 
              ref={canvasRef} 
              className="border border-border rounded-xl shadow-medium bg-white max-w-full"
            />
          </div>
          
          {/* Export Options */}
          <div className="flex gap-2">
            <button
              onClick={handleExportImage}
              className="px-4 py-2 text-sm bg-accent hover:bg-accent/80 text-accent-foreground rounded-lg transition-colors"
            >
              Export as PNG
            </button>
          </div>
        </div>
      </Card>

      {/* Instructions */}
      <Card className="p-4 bg-surface border-border/30">
        <div className="text-center space-y-2">
          <h3 className="font-semibold text-foreground">Design Canvas Instructions</h3>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Use the toolbar to select different drawing tools and shapes</p>
            <p>• Customize colors and stroke width with the color picker</p>
            <p>• Double-click text objects to edit them directly</p>
            <p>• Save your work as JSON to continue editing later</p>
            <p>• Export as PNG to share your designs with clients</p>
          </div>
        </div>
      </Card>
    </div>
  );
}