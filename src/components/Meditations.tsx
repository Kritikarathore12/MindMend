import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Clock, Brain, Heart, Moon, Sunrise, Flower2, Wind } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

/**
 * Mindful Meditations Component
 * Curated meditation sessions for mental wellness
 */

const meditations = [
  {
    id: 1,
    title: "Morning Mindfulness",
    duration: "10 min",
    description: "Start your day with clarity and positive energy",
    icon: Sunrise,
    color: "hsl(45, 93%, 70%)", // Warm yellow
  },
  {
    id: 2,
    title: "Stress Relief",
    duration: "15 min",
    description: "Release tension and find your calm center",
    icon: Wind,
    color: "hsl(210, 60%, 75%)", // Soft blue
  },
  {
    id: 3,
    title: "Deep Sleep",
    duration: "20 min",
    description: "Gentle guidance into restful, healing sleep",
    icon: Moon,
    color: "hsl(240, 50%, 75%)", // Lavender
  },
  {
    id: 4,
    title: "Loving Kindness",
    duration: "12 min",
    description: "Cultivate compassion for yourself and others",
    icon: Heart,
    color: "hsl(340, 70%, 75%)", // Pink
  },
  {
    id: 5,
    title: "Focus & Clarity",
    duration: "8 min",
    description: "Sharpen your mind and enhance concentration",
    icon: Brain,
    color: "hsl(280, 60%, 75%)", // Purple
  },
  {
    id: 6,
    title: "Nature Connection",
    duration: "15 min",
    description: "Ground yourself in the beauty of nature",
    icon: Flower2,
    color: "hsl(150, 50%, 70%)", // Green
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Meditations = () => {
  const [activeMeditation, setActiveMeditation] = useState<number | null>(null);
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [totalSeconds, setTotalSeconds] = useState<number>(0);
  const timerRef = useRef<number | null>(null);
  const { toast } = useToast();

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearTimer();
  }, []);

  const getDurationSeconds = (label: string) => {
    const mins = parseInt(label);
    return isNaN(mins) ? 600 : mins * 60;
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60).toString().padStart(2, "0");
    const sec = Math.floor(s % 60).toString().padStart(2, "0");
    return `${m}:${sec}`;
  };

  const handleStartSession = (id: number, title: string, durationLabel: string) => {
    clearTimer();
    const secs = getDurationSeconds(durationLabel);
    setActiveMeditation(id);
    setTotalSeconds(secs);
    setRemainingSeconds(secs);
    toast({
      title: "Session Started",
      description: `Now playing: ${title}. Find a comfortable position and relax.`,
    });

    timerRef.current = window.setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearTimer();
          setActiveMeditation(null);
          toast({
            title: "Session Complete",
            description: "Great job! How do you feel?",
          });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleStopSession = () => {
    clearTimer();
    setActiveMeditation(null);
    setRemainingSeconds(null);
    setTotalSeconds(0);
    toast({
      title: "Session Stopped",
      description: "You can resume anytime.",
    });
  };

  return (
    <section id="meditations" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Mindful Meditations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Guided meditation sessions designed to nurture your mental well-being
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {meditations.map((meditation) => {
            const Icon = meditation.icon;
            return (
              <motion.div key={meditation.id} variants={itemVariants}>
                <Card className="group hover:shadow-hover transition-all duration-300 hover:-translate-y-1 border-2 bg-card/50 backdrop-blur-sm">
                  <CardHeader>
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ backgroundColor: meditation.color }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-card-foreground">
                      {meditation.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 mb-3 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-medium">{meditation.duration}</span>
                    </div>
                    <p className="text-muted-foreground mb-4">
                      {meditation.description}
                    </p>
                    {activeMeditation === meditation.id ? (
                      <Button 
                        onClick={handleStopSession}
                        variant="destructive"
                        className="w-full"
                        size="lg"
                      >
                        Stop Session
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => handleStartSession(meditation.id, meditation.title, meditation.duration)}
                        className="w-full group-hover:scale-105 transition-transform duration-300"
                        size="lg"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Session
                      </Button>
                    )}
                    {activeMeditation === meditation.id && remainingSeconds !== null && totalSeconds > 0 && (
                      <div className="mt-4">
                        <Progress value={((totalSeconds - remainingSeconds) / totalSeconds) * 100} />
                        <div className="mt-2 text-sm text-muted-foreground">
                          Time remaining: {formatTime(remainingSeconds)}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Meditations;
