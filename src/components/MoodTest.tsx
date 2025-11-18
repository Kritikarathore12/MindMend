import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, ArrowRight, ArrowLeft, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

/**
 * Mood Test Component
 * Interactive mental health assessment with 10 MCQ questions
 * Now saves results to database for authenticated users
 */

type Question = {
  id: number;
  question: string;
  options: {
    label: string;
    value: number;
  }[];
};

type Result = {
  score: number;
  level: "low" | "mild" | "moderate" | "severe";
  message: string;
  color: string;
};

const MoodTest = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const questions: Question[] = [
    {
      id: 1,
      question: "Over the past two weeks, how often have you felt down, depressed, or hopeless?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 2,
      question: "How often have you had little interest or pleasure in doing things?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 3,
      question: "How often have you had trouble falling asleep, staying asleep, or sleeping too much?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 4,
      question: "How often have you felt tired or had little energy?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 5,
      question: "How often have you had poor appetite or been overeating?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 6,
      question: "How often have you felt bad about yourself or that you're a failure?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 7,
      question: "How often have you had trouble concentrating on things like reading or watching TV?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 8,
      question: "How often have you been moving or speaking so slowly that others noticed? Or the opposite - being fidgety or restless?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 9,
      question: "How often have you felt nervous, anxious, or on edge?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
    {
      id: 10,
      question: "How often have you been unable to stop or control worrying?",
      options: [
        { label: "Not at all", value: 0 },
        { label: "Several days", value: 1 },
        { label: "More than half the days", value: 2 },
        { label: "Nearly every day", value: 3 },
      ],
    },
  ];

  const handleAnswerChange = (value: string) => {
    const questionId = questions[currentQuestion].id;
    setAnswers({
      ...answers,
      [questionId]: parseInt(value),
    });
  };

  const handleNext = async () => {
    const currentQuestionId = questions[currentQuestion].id;
    if (answers[currentQuestionId] === undefined) {
      toast({
        title: "Please select an answer",
        description: "Choose the option that best describes your experience.",
        variant: "destructive",
      });
      return;
    }

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Check if user is logged in before showing results
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please login to save your test results and track your mood over time.",
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      await saveResults();
      setShowResults(true);
    }
  };

  const saveResults = async () => {
    if (!user) return;

    setIsSaving(true);
    const results = calculateResults();

    try {
      const { error } = await supabase.from("mood_test_results").insert({
        user_id: user.id,
        score: results.score,
        level: results.level,
        answers: answers,
      });

      if (error) throw error;

      toast({
        title: "Results Saved",
        description: "Your mood assessment has been recorded successfully.",
      });
    } catch (error) {
      console.error("Error saving mood test results:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your results. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResults(false);
  };

  const calculateResults = (): Result => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);

    if (totalScore <= 7) {
      return {
        score: totalScore,
        level: "low",
        message: "Your responses suggest minimal symptoms. You're doing well! Continue practicing self-care and maintaining healthy habits.",
        color: "text-sentiment-positive",
      };
    } else if (totalScore <= 14) {
      return {
        score: totalScore,
        level: "mild",
        message: "Your responses suggest mild symptoms. Consider incorporating stress-reduction techniques and self-care activities into your routine.",
        color: "text-primary",
      };
    } else if (totalScore <= 21) {
      return {
        score: totalScore,
        level: "moderate",
        message: "Your responses suggest moderate symptoms. We recommend speaking with a mental health professional who can provide personalized support.",
        color: "text-secondary",
      };
    } else {
      return {
        score: totalScore,
        level: "severe",
        message: "Your responses suggest significant symptoms. We strongly encourage you to reach out to a mental health professional. You don't have to face this alone.",
        color: "text-destructive",
      };
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const results = showResults ? calculateResults() : null;

  return (
    <section id="test" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Mental Wellbeing Assessment
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Answer these questions honestly to get insights into your current mental health. This is not a diagnosis, but a helpful tool for self-awareness.
            </p>
            {!user && (
              <p className="text-sm text-primary mt-4 font-medium">
                📝 Login after completing to save your results and track progress over time
              </p>
            )}
          </div>

          <Card className="shadow-soft border-border">
            <AnimatePresence mode="wait">
              {!showResults ? (
                <motion.div
                  key="questions"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between mb-4">
                      <CardTitle className="text-sm font-medium text-muted-foreground">
                        Question {currentQuestion + 1} of {questions.length}
                      </CardTitle>
                      <span className="text-sm font-medium text-primary">
                        {Math.round(progress)}%
                      </span>
                    </div>
                    <Progress value={progress} className="h-2" />
                    <CardDescription className="text-xl font-semibold text-foreground mt-6">
                      {questions[currentQuestion].question}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={answers[questions[currentQuestion].id]?.toString() || ""}
                      onValueChange={handleAnswerChange}
                      className="space-y-4"
                    >
                      {questions[currentQuestion].options.map((option) => (
                        <div
                          key={`q${currentQuestion}-opt${option.value}`}
                          className="flex items-center space-x-3 p-4 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer"
                        >
                          <RadioGroupItem
                            value={option.value.toString()}
                            id={`q${currentQuestion}-option-${option.value}`}
                          />
                          <Label
                            htmlFor={`q${currentQuestion}-option-${option.value}`}
                            className="flex-1 cursor-pointer text-base"
                          >
                            {option.label}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>

                    <div className="flex gap-3 mt-8">
                      <Button
                        onClick={handlePrevious}
                        disabled={currentQuestion === 0}
                        variant="outline"
                        className="flex-1"
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        onClick={handleNext}
                        disabled={isSaving || answers[questions[currentQuestion].id] === undefined}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        {currentQuestion === questions.length - 1 ? (
                          <>
                            {isSaving ? "Saving..." : "View Results"}
                            <CheckCircle2 className="ml-2 h-4 w-4" />
                          </>
                        ) : (
                          <>
                            Next
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              ) : (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="h-10 w-10 text-primary" />
                    </div>
                    <CardTitle className="text-3xl font-bold text-foreground">
                      Assessment Complete
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="text-center">
                      <div className={`text-6xl font-bold mb-2 ${results?.color}`}>
                        {results?.score}/{questions.length * 3}
                      </div>
                      <div className="text-xl font-semibold text-muted-foreground capitalize mb-4">
                        {results?.level} Level
                      </div>
                    </div>

                    <div className="bg-muted/30 rounded-lg p-6">
                      <p className="text-base text-foreground leading-relaxed">
                        {results?.message}
                      </p>
                    </div>

                    <div className="bg-secondary/20 rounded-lg p-6 border border-secondary">
                      <p className="text-sm text-foreground">
                        <strong>Important:</strong> This assessment is for informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. If you're experiencing severe symptoms, please contact a mental health professional or call 988.
                      </p>
                    </div>

                    <div className="flex gap-3">
                      <Button
                        onClick={handleReset}
                        variant="outline"
                        className="flex-1"
                      >
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Take Again
                      </Button>
                      <Button
                        onClick={() => {
                          const element = document.querySelector("#insights");
                          if (element) element.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        View Insights
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Disclaimer */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-center"
          >
            <p className="text-xs text-muted-foreground">
              {user 
                ? "Your responses are securely saved and private to your account."
                : "Your responses are private and anonymous. Login to save and track your mood over time."
              }
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default MoodTest;
