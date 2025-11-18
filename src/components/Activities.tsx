import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Brain, Sparkles, Cloud, 
  Waves, Palette, Puzzle, Zap, Star 
} from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import BreathingWave from "@/components/BreathingWave";
import GratitudeSpark from "@/components/GratitudeSpark";
import MoodPuzzle from "@/components/MoodPuzzle";
import CalmColors from "@/components/CalmColors";
import MindQuest from "@/components/MindQuest";
import StarWishes from "@/components/StarWishes";
import JoyBurst from "@/components/JoyBurst";
import DreamCloud from "@/components/DreamCloud";

/**
 * Interactive Activities & Games Component
 * Engaging mental wellness activities with gamification
 */

const activities = [
  {
    id: 1,
    title: "Breathing Wave",
    type: "Interactive",
    description: "Follow the wave to calm your breath",
    icon: Waves,
    color: "from-cyan-400 to-blue-500",
    interactive: true,
    duration: "2 min",
  },
  {
    id: 2,
    title: "Gratitude Spark",
    type: "Quick Write",
    description: "List 3 things you're grateful for today",
    icon: Sparkles,
    color: "from-amber-400 to-orange-500",
    interactive: false,
    duration: "3 min",
  },
  {
    id: 3,
    title: "Mood Puzzle",
    type: "Game",
    description: "Match emotions to build emotional awareness",
    icon: Puzzle,
    color: "from-purple-400 to-pink-500",
    interactive: true,
    duration: "5 min",
  },
  {
    id: 4,
    title: "Calm Colors",
    type: "Art Therapy",
    description: "Pick colors that match your current feelings",
    icon: Palette,
    color: "from-green-400 to-teal-500",
    interactive: true,
    duration: "4 min",
  },
  {
    id: 5,
    title: "Mind Quest",
    type: "Challenge",
    description: "Daily mental wellness challenge to build habits",
    icon: Brain,
    color: "from-blue-400 to-indigo-500",
    interactive: true,
    duration: "7 min",
  },
  {
    id: 6,
    title: "Star Wishes",
    type: "Goal Setting",
    description: "Set intentions for your wellness journey",
    icon: Star,
    color: "from-amber-400 to-yellow-500",
    interactive: false,
    duration: "6 min",
  },
  {
    id: 7,
    title: "Joy Burst",
    type: "Energy Boost",
    description: "Quick activities to lift your mood instantly",
    icon: Zap,
    color: "from-yellow-400 to-orange-500",
    interactive: true,
    duration: "3 min",
  },
  {
    id: 8,
    title: "Dream Cloud",
    type: "Visualization",
    description: "Imagine your safe, peaceful place",
    icon: Cloud,
    color: "from-sky-400 to-cyan-500",
    interactive: false,
    duration: "6 min",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Activities = () => {
  const [activeActivity, setActiveActivity] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showBreathingWave, setShowBreathingWave] = useState(false);
  const [showGratitudeSpark, setShowGratitudeSpark] = useState(false);
  const [showMoodPuzzle, setShowMoodPuzzle] = useState(false);
  const [showCalmColors, setShowCalmColors] = useState(false);
  const [showMindQuest, setShowMindQuest] = useState(false);
  const [showStarWishes, setShowStarWishes] = useState(false);
  const [showJoyBurst, setShowJoyBurst] = useState(false);
  const [showDreamCloud, setShowDreamCloud] = useState(false);
  const { toast } = useToast();

  const handleStartActivity = (id: number, title: string, isInteractive: boolean) => {
    // Special handling for Breathing Wave (id: 1)
    if (id === 1) {
      setShowBreathingWave(true);
      return;
    }

    // Special handling for Gratitude Spark (id: 2)
    if (id === 2) {
      setShowGratitudeSpark(true);
      return;
    }

    // Special handling for Mood Puzzle (id: 3)
    if (id === 3) {
      setShowMoodPuzzle(true);
      return;
    }

    // Special handling for Calm Colors (id: 4)
    if (id === 4) {
      setShowCalmColors(true);
      return;
    }

    // Special handling for Mind Quest (id: 5)
    if (id === 5) {
      setShowMindQuest(true);
      return;
    }

    // Special handling for Star Wishes (id: 6)
    if (id === 6) {
      setShowStarWishes(true);
      return;
    }

    // Special handling for Joy Burst (id: 7)
    if (id === 7) {
      setShowJoyBurst(true);
      return;
    }

    // Special handling for Dream Cloud (id: 8)
    if (id === 8) {
      setShowDreamCloud(true);
      return;
    }

    setActiveActivity(id);
    setProgress(0);
    
    toast({
      title: isInteractive ? "🎮 Activity Started!" : "🧘 Session Started!",
      description: `${title} - ${isInteractive ? "Follow the prompts on screen" : "Find a comfortable position"}`,
    });

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setActiveActivity(null);
          toast({
            title: "✨ Activity Complete!",
            description: "Great job! You're building stronger mental wellness habits.",
          });
          return 100;
        }
        return prev + 2;
      });
    }, 200);
  };

  const handleStopActivity = () => {
    setActiveActivity(null);
    setProgress(0);
    toast({
      title: "Activity Paused",
      description: "You can resume anytime you're ready.",
    });
  };

  return (
    <section id="activities" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-background via-primary/5 to-secondary/10">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Interactive Wellness Activities
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Engaging activities and games designed to boost your mood and mental wellness
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {activities.map((activity) => {
            const Icon = activity.icon;
            const isActive = activeActivity === activity.id;
            
            return (
              <motion.div key={activity.id} variants={itemVariants}>
                <Card className={`group relative overflow-hidden transition-all duration-300 hover:-translate-y-2 border-2 ${
                  isActive ? "shadow-glow border-primary" : "hover:shadow-teal border-border"
                }`}>
                  <div className={`absolute inset-0 bg-gradient-to-br ${activity.color} opacity-10 group-hover:opacity-20 transition-opacity duration-300`} />
                  
                  <CardHeader className="relative">
                    <div 
                      className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${activity.color} flex items-center justify-center mb-3 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 shadow-lg`}
                    >
                      <Icon className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold text-card-foreground">
                      {activity.title}
                    </CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-gradient-to-r ${activity.color} text-white`}>
                        {activity.type}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        ⏱️ {activity.duration}
                      </span>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="relative">
                    <p className="text-sm text-muted-foreground mb-4 min-h-[2.5rem]">
                      {activity.description}
                    </p>
                    
                    {isActive ? (
                      <div className="space-y-3">
                        <Progress value={progress} className="h-2" />
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>In Progress...</span>
                          <span>{progress}%</span>
                        </div>
                        <Button 
                          onClick={handleStopActivity}
                          variant="outline"
                          className="w-full"
                          size="sm"
                        >
                          Pause
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        onClick={() => handleStartActivity(activity.id, activity.title, activity.interactive)}
                        className={`w-full bg-gradient-to-r ${activity.color} hover:opacity-90 text-white border-0 shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                        size="sm"
                      >
                        {activity.interactive ? "🎮 Play" : "▶️ Start"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Breathing Wave Modal */}
      <BreathingWave 
        isOpen={showBreathingWave} 
        onClose={() => setShowBreathingWave(false)} 
      />

      {/* Gratitude Spark Modal */}
      <GratitudeSpark 
        isOpen={showGratitudeSpark} 
        onClose={() => setShowGratitudeSpark(false)} 
      />

      {/* Mood Puzzle Modal */}
      <MoodPuzzle 
        isOpen={showMoodPuzzle} 
        onClose={() => setShowMoodPuzzle(false)} 
      />

      {/* Calm Colors Modal */}
      <CalmColors 
        isOpen={showCalmColors} 
        onClose={() => setShowCalmColors(false)} 
      />

      {/* Mind Quest Modal */}
      <MindQuest 
        isOpen={showMindQuest} 
        onClose={() => setShowMindQuest(false)} 
      />

      {/* Star Wishes Modal */}
      <StarWishes isOpen={showStarWishes} onClose={() => setShowStarWishes(false)} />

      {/* Joy Burst Modal */}
      <JoyBurst isOpen={showJoyBurst} onClose={() => setShowJoyBurst(false)} />

      {/* Dream Cloud Modal */}
      <DreamCloud isOpen={showDreamCloud} onClose={() => setShowDreamCloud(false)} />
    </section>
  );
};

export default Activities;
