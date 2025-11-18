import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Sparkles, CheckCircle2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface GratitudeSparkProps {
  isOpen: boolean;
  onClose: () => void;
}

const GratitudeSpark = ({ isOpen, onClose }: GratitudeSparkProps) => {
  const [gratitudes, setGratitudes] = useState(["", "", ""]);
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleGratitudeChange = (index: number, value: string) => {
    const newGratitudes = [...gratitudes];
    newGratitudes[index] = value;
    setGratitudes(newGratitudes);

    // Mark as completed when user starts typing
    if (value.trim().length > 0 && !completedItems.includes(index)) {
      setCompletedItems([...completedItems, index]);
    }
    
    // Remove from completed if cleared
    if (value.trim().length === 0 && completedItems.includes(index)) {
      setCompletedItems(completedItems.filter((i) => i !== index));
    }
  };

  const getFilledCount = () => {
    return gratitudes.filter((g) => g.trim().length > 0).length;
  };

  const allFilled = getFilledCount() === 3;

  const handleSubmit = async () => {
    const filledGratitudes = gratitudes.filter((g) => g.trim().length > 0);
    
    if (filledGratitudes.length === 0) {
      toast({
        title: "Add something!",
        description: "Write down at least one thing you're grateful for.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    // Save to localStorage (works for both authenticated and anonymous users)
    try {
      const existingGratitudes = JSON.parse(
        localStorage.getItem("gratitude_entries") || "[]"
      );
      
      const newEntry = {
        id: Date.now().toString(),
        items: filledGratitudes,
        date: new Date().toISOString(),
        userId: user?.id || "anonymous",
      };

      existingGratitudes.push(newEntry);
      localStorage.setItem("gratitude_entries", JSON.stringify(existingGratitudes));

      // Show success message
      toast({
        title: "✨ Gratitude Saved!",
        description: "Your gratitude list has been saved. Keep the positive energy flowing!",
      });

      // Reset form after a short delay
      setTimeout(() => {
        setGratitudes(["", "", ""]);
        setCompletedItems([]);
        setIsSubmitting(false);
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving gratitude:", error);
      toast({
        title: "Error",
        description: "Failed to save your gratitude list. Please try again.",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setGratitudes(["", "", ""]);
    setCompletedItems([]);
  };

  const gratitudePrompts = [
    "What are you grateful for today?",
    "Who or what brought you joy recently?",
    "What's a moment that made you smile?",
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full p-0 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-amber-950 dark:via-orange-950 dark:to-yellow-950 overflow-hidden">
        <div className="relative min-h-[600px] flex flex-col p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatDelay: 3,
                }}
              >
                <Sparkles className="h-12 w-12 text-amber-500" />
              </motion.div>
              <h2 className="text-3xl font-bold text-foreground">Gratitude Spark</h2>
            </div>
            <p className="text-muted-foreground text-lg">
              List 3 things you're grateful for today
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Reflecting on gratitude can boost your mood and mental well-being
            </p>
          </motion.div>

          {/* Progress indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Progress
              </span>
              <span className="text-sm font-bold text-amber-600">
                {getFilledCount()} / 3
              </span>
            </div>
            <div className="w-full h-2 bg-amber-100 dark:bg-amber-900 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(getFilledCount() / 3) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </motion.div>

          {/* Gratitude inputs */}
          <div className="flex-1 space-y-4 mb-6">
            {gratitudes.map((gratitude, index) => {
              const isCompleted = completedItems.includes(index);
              const hasContent = gratitude.trim().length > 0;

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="relative">
                    {/* Sparkle decoration */}
                    {isCompleted && (
                      <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="absolute -left-8 top-1/2 -translate-y-1/2 z-10"
                      >
                        <CheckCircle2 className="h-6 w-6 text-amber-500" />
                      </motion.div>
                    )}

                    {/* Floating sparkles effect */}
                    <AnimatePresence>
                      {isCompleted && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="absolute -right-2 -top-2 pointer-events-none"
                        >
                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              initial={{
                                x: 0,
                                y: 0,
                                scale: 0,
                                opacity: 1,
                              }}
                              animate={{
                                x: Math.cos((i * 2 * Math.PI) / 3) * 20,
                                y: Math.sin((i * 2 * Math.PI) / 3) * 20,
                                scale: [0, 1, 0],
                                opacity: [1, 1, 0],
                              }}
                              transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2,
                              }}
                              className="absolute"
                            >
                              <Sparkles className="h-4 w-4 text-amber-400" />
                            </motion.div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <Input
                      type="text"
                      placeholder={gratitudePrompts[index]}
                      value={gratitude}
                      onChange={(e) => handleGratitudeChange(index, e.target.value)}
                      className={`w-full text-lg py-6 px-4 border-2 transition-all duration-300 ${
                        isCompleted
                          ? "border-amber-400 bg-amber-50 dark:bg-amber-900/20 shadow-md"
                          : "border-amber-200 dark:border-amber-800"
                      } focus:border-amber-500 focus:ring-amber-500`}
                    />
                  </div>

                  {/* Character count */}
                  {hasContent && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-xs text-muted-foreground mt-1 ml-4"
                    >
                      {gratitude.length} characters
                    </motion.p>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Completion celebration */}
          <AnimatePresence>
            {allFilled && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="text-center mb-6 p-4 bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 rounded-lg border-2 border-amber-300 dark:border-amber-700"
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                  }}
                  className="inline-block mb-2"
                >
                  <Sparkles className="h-8 w-8 text-amber-500" />
                </motion.div>
                <p className="text-amber-700 dark:text-amber-300 font-semibold text-lg">
                  ✨ Amazing! You've listed all three! ✨
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action buttons */}
          <div className="flex items-center justify-between gap-4">
            <Button
              onClick={handleReset}
              variant="outline"
              size="lg"
              className="px-6"
              disabled={isSubmitting || getFilledCount() === 0}
            >
              Clear All
            </Button>

            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={isSubmitting || getFilledCount() === 0}
              className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white px-8 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  Saving...
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  {allFilled ? "Save & Complete ✨" : "Save Gratitude"}
                </>
              )}
            </Button>
          </div>

          {/* Footer tip */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-6 text-center text-xs text-muted-foreground"
          >
            💡 Tip: Practice gratitude daily for better mental wellness
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GratitudeSpark;

