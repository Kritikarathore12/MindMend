import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Palette, X, RotateCcw, Save, Eraser } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface CalmColorsProps {
  isOpen: boolean;
  onClose: () => void;
}

type EmotionColor = {
  emotion: string;
  colors: string[];
  description: string;
};

const emotionColors: EmotionColor[] = [
  {
    emotion: "Calm & Peaceful",
    colors: ["#E8F5E9", "#A5D6A7", "#81C784", "#66BB6A", "#4CAF50", "#43A047", "#388E3C", "#2E7D32"],
    description: "Greens for tranquility and serenity",
  },
  {
    emotion: "Joyful & Happy",
    colors: ["#FFF9C4", "#FFF59D", "#FFF176", "#FFEE58", "#FFEB3B", "#FDD835", "#FBC02D", "#F9A825"],
    description: "Yellows for happiness and positivity",
  },
  {
    emotion: "Sad & Melancholic",
    colors: ["#E3F2FD", "#BBDEFB", "#90CAF9", "#64B5F6", "#42A5F5", "#2196F3", "#1E88E5", "#1976D2"],
    description: "Blues for reflection and calm",
  },
  {
    emotion: "Energetic & Excited",
    colors: ["#FFEBEE", "#FFCDD2", "#EF9A9A", "#E57373", "#EF5350", "#F44336", "#E53935", "#D32F2F"],
    description: "Reds and oranges for energy and passion",
  },
  {
    emotion: "Love & Warmth",
    colors: ["#FCE4EC", "#F8BBD0", "#F48FB1", "#F06292", "#EC407A", "#E91E63", "#D81B60", "#C2185B"],
    description: "Pinks for love, warmth, and compassion",
  },
  {
    emotion: "Creative & Imaginative",
    colors: ["#F3E5F5", "#E1BEE7", "#CE93D8", "#BA68C8", "#AB47BC", "#9C27B0", "#8E24AA", "#7B1FA2"],
    description: "Purples for creativity and imagination",
  },
  {
    emotion: "Anxious & Nervous",
    colors: ["#FFF3E0", "#FFE0B2", "#FFCC80", "#FFB74D", "#FFA726", "#FF9800", "#FB8C00", "#F57C00"],
    description: "Oranges for alertness and awareness",
  },
  {
    emotion: "Balanced & Neutral",
    colors: ["#F5F5F5", "#EEEEEE", "#E0E0E0", "#BDBDBD", "#9E9E9E", "#757575", "#616161", "#424242"],
    description: "Grays for balance and neutrality",
  },
];

const CalmColors = ({ isOpen, onClose }: CalmColorsProps) => {
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null);
  const [canvas, setCanvas] = useState<{ x: number; y: number; color: string; size: number }[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [brushSize, setBrushSize] = useState(15);
  const [selectedColor, setSelectedColor] = useState<string>("#4CAF50");
  const canvasRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (isOpen) {
      setSelectedColors([]);
      setCanvas([]);
      setCurrentEmotion(null);
      setSelectedColor("#4CAF50");
      setBrushSize(15);
    }
  }, [isOpen]);

  const handleColorSelect = (color: string) => {
    if (!selectedColors.includes(color)) {
      setSelectedColors([...selectedColors, color]);
      setSelectedColor(color);
    } else {
      setSelectedColor(color);
    }
  };

  const handleEmotionSelect = (emotion: EmotionColor) => {
    setCurrentEmotion(emotion.emotion);
    setSelectedColor(emotion.colors[4]); // Select a middle color from the palette
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCanvas([
      ...canvas,
      {
        x,
        y,
        color: selectedColor,
        size: brushSize,
      },
    ]);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCanvas((prev) => [
      ...prev,
      {
        x,
        y,
        color: selectedColor,
        size: brushSize,
      },
    ]);
  };

  const handleClearCanvas = () => {
    setCanvas([]);
    setSelectedColors([]);
    setCurrentEmotion(null);
    toast({
      title: "Canvas Cleared",
      description: "You can start fresh with new colors!",
    });
  };

  const handleSave = () => {
    try {
      const existingArt = JSON.parse(localStorage.getItem("calm_colors_art") || "[]");
      
      const newArt = {
        id: Date.now().toString(),
        colors: selectedColors,
        emotion: currentEmotion,
        canvas: canvas,
        date: new Date().toISOString(),
        userId: user?.id || "anonymous",
      };

      existingArt.push(newArt);
      localStorage.setItem("calm_colors_art", JSON.stringify(existingArt));

      toast({
        title: "✨ Art Saved!",
        description: "Your color expression has been saved. Great job expressing your feelings!",
      });

      setTimeout(() => {
        handleClearCanvas();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving art:", error);
      toast({
        title: "Error",
        description: "Failed to save your art. Please try again.",
        variant: "destructive",
      });
    }
  };

  const allColors = emotionColors.flatMap((ec) => ec.colors);
  const uniqueColors = Array.from(new Set(allColors));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl w-full p-0 bg-gradient-to-br from-green-50 via-teal-50 to-emerald-50 dark:from-green-950 dark:via-teal-950 dark:to-emerald-950 overflow-hidden">
        <div className="relative min-h-[700px] flex flex-col p-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <Palette className="h-10 w-10 text-green-500" />
              <h2 className="text-3xl font-bold text-foreground">Calm Colors</h2>
            </div>
            <p className="text-muted-foreground">
              Pick colors that match your current feelings
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1">
            {/* Left Panel - Color Palettes by Emotion */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold mb-3 text-foreground">Emotion Guides</h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {emotionColors.map((emotion) => (
                    <motion.button
                      key={emotion.emotion}
                      onClick={() => handleEmotionSelect(emotion)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        currentEmotion === emotion.emotion
                          ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                          : "border-gray-200 dark:border-gray-700 hover:border-green-300"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="font-medium text-sm mb-1">{emotion.emotion}</div>
                      <div className="flex gap-1 mb-2">
                        {emotion.colors.slice(0, 6).map((color, idx) => (
                          <div
                            key={idx}
                            className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-700 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div className="text-xs text-muted-foreground">{emotion.description}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Brush Size */}
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold mb-3 text-foreground">Brush Size</h3>
                <input
                  type="range"
                  min="5"
                  max="30"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center mt-2 text-sm text-muted-foreground">
                  {brushSize}px
                </div>
              </div>
            </div>

            {/* Center Panel - Canvas */}
            <div className="flex flex-col">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md flex-1 flex flex-col">
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="font-semibold text-foreground">Your Canvas</h3>
                  <Button
                    onClick={handleClearCanvas}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Eraser className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
                
                <div
                  ref={canvasRef}
                  className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700 relative cursor-crosshair overflow-hidden"
                  onMouseDown={() => setIsDrawing(true)}
                  onMouseUp={() => setIsDrawing(false)}
                  onMouseLeave={() => setIsDrawing(false)}
                  onClick={handleCanvasClick}
                  onMouseMove={handleCanvasMouseMove}
                >
                  {canvas.map((dot, index) => (
                    <motion.div
                      key={index}
                      className="absolute rounded-full pointer-events-none"
                      style={{
                        left: `${dot.x}px`,
                        top: `${dot.y}px`,
                        width: `${dot.size}px`,
                        height: `${dot.size}px`,
                        backgroundColor: dot.color,
                        transform: "translate(-50%, -50%)",
                      }}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  ))}
                </div>

                <div className="mt-3 text-xs text-center text-muted-foreground">
                  Click or drag to paint with colors
                </div>
              </div>
            </div>

            {/* Right Panel - Color Picker */}
            <div className="space-y-4">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
                <h3 className="font-semibold mb-3 text-foreground">Color Palette</h3>
                <div className="grid grid-cols-8 gap-2">
                  {uniqueColors.map((color, index) => (
                    <motion.button
                      key={index}
                      onClick={() => handleColorSelect(color)}
                      className={`aspect-square rounded-lg border-2 transition-all ${
                        selectedColor === color
                          ? "border-green-500 scale-110 shadow-lg ring-2 ring-green-300"
                          : "border-gray-300 dark:border-gray-600 hover:scale-105"
                      }`}
                      style={{ backgroundColor: color }}
                      whileHover={{ scale: selectedColor === color ? 1.1 : 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Selected Colors */}
              {selectedColors.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md"
                >
                  <h3 className="font-semibold mb-3 text-foreground">
                    Your Colors ({selectedColors.length})
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedColors.map((color, index) => (
                      <motion.div
                        key={index}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-700 shadow-md"
                        style={{ backgroundColor: color }}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button
                  onClick={handleSave}
                  size="lg"
                  className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  disabled={selectedColors.length === 0}
                >
                  <Save className="mr-2 h-5 w-5" />
                  Save Your Art
                </Button>
                <Button
                  onClick={handleClearCanvas}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Start Over
                </Button>
              </div>

              {/* Current Emotion */}
              {currentEmotion && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-gradient-to-r from-green-100 to-teal-100 dark:from-green-900/30 dark:to-teal-900/30 rounded-lg p-3 text-center"
                >
                  <div className="text-sm font-medium text-foreground">
                    Expressing: {currentEmotion}
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Footer tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-xs text-muted-foreground"
          >
            💡 Art therapy tip: Colors can help express feelings that words sometimes can't capture
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalmColors;

