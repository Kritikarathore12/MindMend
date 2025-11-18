import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Brain, RotateCcw, CheckCircle2, Star, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MindQuestProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Challenge {
  id: number;
  question: string;
  type: "reflection" | "action" | "gratitude";
  options?: string[];
  correctAnswer?: number; // For future validation
}

const dailyChallenges: Challenge[] = [
  {
    id: 1,
    question: "What's one small step you can take today to support your mental wellness?",
    type: "action",
    options: [
      "Take a 5-minute walk",
      "Practice deep breathing",
      "Write down your feelings",
      "Call someone you care about"
    ]
  },
  {
    id: 2,
    question: "Think about a recent moment that made you smile. What made it special?",
    type: "reflection"
  },
  {
    id: 3,
    question: "Choose a self-care activity you'll commit to this week:",
    type: "action",
    options: [
      "Get 7-8 hours of sleep",
      "Limit screen time before bed",
      "Eat one nutritious meal daily",
      "Spend time in nature"
    ]
  },
  {
    id: 4,
    question: "What's something you're grateful for about your mental health journey?",
    type: "gratitude"
  },
  {
    id: 5,
    question: "When you feel stressed, which technique works best for you?",
    type: "action",
    options: [
      "Breathing exercises",
      "Physical activity",
      "Talking to someone",
      "Creative expression"
    ]
  }
];

const MindQuest = ({ isOpen, onClose }: MindQuestProps) => {
  const [currentChallengeIndex, setCurrentChallengeIndex] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [reflectionAnswer, setReflectionAnswer] = useState("");
  const { toast } = useToast();

  const currentChallenge = dailyChallenges[currentChallengeIndex];
  const progress = completed 
    ? 100 
    : ((currentChallengeIndex + 1) / dailyChallenges.length) * 100;

  useEffect(() => {
    if (isOpen) {
      resetChallenge();
    }
  }, [isOpen]);

  const resetChallenge = () => {
    setCurrentChallengeIndex(0);
    setAnswers([]);
    setCompleted(false);
    setSelectedOption(null);
    setReflectionAnswer("");
  };

  const handleOptionSelect = (index: number) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    if (currentChallenge.type === "action" && currentChallenge.options) {
      if (selectedOption === null) {
        toast({
          title: "Select an option",
          description: "Please choose one of the options before continuing.",
          variant: "destructive",
        });
        return;
      }
      const answer = currentChallenge.options[selectedOption];
      setAnswers([...answers, answer]);
    } else {
      // For reflection/gratitude questions
      if (!reflectionAnswer.trim()) {
        toast({
          title: "Share your thoughts",
          description: "Please write down your thoughts before continuing.",
          variant: "destructive",
        });
        return;
      }
      setAnswers([...answers, reflectionAnswer]);
    }

    // Move to next challenge
    if (currentChallengeIndex < dailyChallenges.length - 1) {
      setCurrentChallengeIndex(currentChallengeIndex + 1);
      setSelectedOption(null);
      setReflectionAnswer("");
    } else {
      // All challenges completed
      setCompleted(true);
      toast({
        title: "🏆 Quest Complete!",
        description: "You've successfully completed today's Mind Quest!",
      });
    }
  };

  const handleRestart = () => {
    resetChallenge();
    toast({
      title: "Challenge Reset",
      description: "Starting a fresh Mind Quest!",
    });
  };

  const getQuestionIcon = () => {
    switch (currentChallenge.type) {
      case "action":
        return <Target className="h-6 w-6 text-blue-500" />;
      case "reflection":
        return <Brain className="h-6 w-6 text-purple-500" />;
      case "gratitude":
        return <Star className="h-6 w-6 text-amber-500" />;
    }
  };

  const getQuestionColor = () => {
    switch (currentChallenge.type) {
      case "action":
        return "from-blue-400 to-indigo-500";
      case "reflection":
        return "from-purple-400 to-pink-500";
      case "gratitude":
        return "from-amber-400 to-orange-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto sm:rounded-3xl p-8 bg-gradient-to-br from-background via-primary/5 to-secondary/10 border-2 border-border shadow-2xl">
        <div className="relative">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-lg">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Mind Quest
              </h2>
            </div>
            <p className="text-muted-foreground">
              Daily mental wellness challenges to build habits
            </p>
          </motion.div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-muted-foreground">
                Challenge {currentChallengeIndex + 1} of {dailyChallenges.length}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="w-full h-3 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!completed ? (
              <motion.div
                key={currentChallengeIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                {/* Question */}
                <div
                  className={`mb-8 p-6 rounded-2xl bg-gradient-to-br ${getQuestionColor()} bg-opacity-10 border-2 border-border`}
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-xl bg-white/80 backdrop-blur-sm shadow-md flex-shrink-0">
                      {getQuestionIcon()}
                    </div>
                    <div className="flex-1">
                      <div className="mb-3">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${getQuestionColor()} text-white`}
                        >
                          {currentChallenge.type.charAt(0).toUpperCase() +
                            currentChallenge.type.slice(1)}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-foreground mb-2">
                        {currentChallenge.question}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Answer Options for Action type */}
                {currentChallenge.type === "action" && currentChallenge.options && (
                  <div className="space-y-3 mb-6">
                    {currentChallenge.options.map((option, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleOptionSelect(index)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                          selectedOption === index
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-950 shadow-md"
                            : "border-border hover:border-blue-300 bg-card hover:bg-accent"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                              selectedOption === index
                                ? "border-blue-500 bg-blue-500"
                                : "border-muted-foreground"
                            }`}
                          >
                            {selectedOption === index && (
                              <CheckCircle2 className="h-4 w-4 text-white" />
                            )}
                          </div>
                          <span className="text-sm font-medium">{option}</span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                )}

                {/* Text Input for Reflection/Gratitude */}
                {(currentChallenge.type === "reflection" ||
                  currentChallenge.type === "gratitude") && (
                  <div className="mb-6">
                    <textarea
                      value={reflectionAnswer}
                      onChange={(e) => setReflectionAnswer(e.target.value)}
                      placeholder="Share your thoughts here..."
                      className="w-full min-h-[120px] p-4 rounded-xl border-2 border-border bg-background focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none transition-all"
                    />
                  </div>
                )}

                {/* Navigation */}
                <div className="flex justify-between gap-4">
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Restart
                  </Button>
                  <Button
                    onClick={handleNext}
                    size="lg"
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white shadow-lg"
                  >
                    {currentChallengeIndex < dailyChallenges.length - 1
                      ? "Next Challenge"
                      : "Complete Quest"}
                  </Button>
                </div>
              </motion.div>
            ) : (
              // Completion Screen
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mb-6"
                >
                  <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center shadow-2xl">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                </motion.div>

                <h3 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Quest Complete! 🎉
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  You've successfully completed all challenges. Keep up the great work on
                  your mental wellness journey!
                </p>

                {/* Answers Summary */}
                <div className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold mb-4 flex items-center justify-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    Your Journey
                  </h4>
                  <div className="space-y-3 text-left">
                    {answers.map((answer, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg bg-white dark:bg-background/50"
                      >
                        <span className="font-semibold text-blue-600 dark:text-blue-400 flex-shrink-0">
                          {index + 1}.
                        </span>
                        <span className="text-sm text-foreground">{answer}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center gap-4">
                  <Button
                    onClick={onClose}
                    size="lg"
                    className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:opacity-90 text-white shadow-lg"
                  >
                    Close
                  </Button>
                  <Button
                    onClick={handleRestart}
                    variant="outline"
                    size="lg"
                    className="flex items-center gap-2"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Try Again
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MindQuest;

