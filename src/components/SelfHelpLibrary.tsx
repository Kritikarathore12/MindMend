import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wind, Heart, Sparkles, BookOpen } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

/**
 * Self-Help Library Component
 * Provides breathing exercises, gratitude prompts, and wellness resources
 */
const SelfHelpLibrary = () => {
  const [activeExercise, setActiveExercise] = useState<string | null>(null);
  const { toast } = useToast();

  const breathingExercises = [
    {
      id: "box-breathing",
      title: "Box Breathing",
      description: "Inhale for 4, hold for 4, exhale for 4, hold for 4",
      icon: Wind,
      color: "text-primary",
    },
    {
      id: "4-7-8",
      title: "4-7-8 Breathing",
      description: "Inhale for 4, hold for 7, exhale for 8",
      icon: Wind,
      color: "text-accent",
    },
  ];

  const gratitudePrompts = [
    "What made you smile today?",
    "Name three things you're grateful for right now",
    "Who positively impacted your life recently?",
    "What's a simple pleasure you enjoyed today?",
    "What challenge helped you grow?",
  ];

  const wellnessResources = [
    {
      title: "Mindfulness Tips",
      description: "Daily practices to stay present and centered",
      icon: Sparkles,
      color: "text-primary",
      url: "https://www.mindful.org/meditation/mindfulness-getting-started/",
    },
    {
      title: "Positive Affirmations",
      description: "Build self-compassion with powerful affirmations",
      icon: Heart,
      color: "text-sentiment-positive",
      url: "https://www.verywellmind.com/daily-affirmations-what-are-they-and-how-to-use-them-4762310",
    },
    {
      title: "Wellness Articles",
      description: "Evidence-based mental health resources",
      icon: BookOpen,
      color: "text-accent",
      url: "https://www.nimh.nih.gov/health/topics",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="self-help" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Self-Help Library
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access breathing exercises, gratitude prompts, and wellness resources for daily mindfulness
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-12"
        >
          {/* Breathing Exercises */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Breathing Exercises</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {breathingExercises.map((exercise) => {
                const Icon = exercise.icon;
                return (
                  <Card key={exercise.id} className="bg-card border-border shadow-soft hover:shadow-hover transition-all duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ${exercise.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-xl">{exercise.title}</CardTitle>
                      <CardDescription>{exercise.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button
                        onClick={() => setActiveExercise(activeExercise === exercise.id ? null : exercise.id)}
                        className="w-full"
                        variant={activeExercise === exercise.id ? "default" : "outline"}
                      >
                        {activeExercise === exercise.id ? "Stop Exercise" : "Start Exercise"}
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>

          {/* Gratitude Prompts */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Gratitude Prompts</h3>
            <Card className="bg-gradient-card border-border shadow-soft">
              <CardHeader>
                <CardTitle>Daily Reflection Questions</CardTitle>
                <CardDescription>Take a moment to reflect on these prompts</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {gratitudePrompts.map((prompt, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Heart className="h-5 w-5 text-sentiment-positive mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{prompt}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </motion.div>

          {/* Wellness Resources */}
          <motion.div variants={itemVariants}>
            <h3 className="text-2xl font-semibold text-foreground mb-6">Wellness Resources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {wellnessResources.map((resource, index) => {
                const Icon = resource.icon;
                return (
                  <Card key={index} className="bg-card border-border shadow-soft hover:shadow-hover transition-all duration-300">
                    <CardHeader>
                      <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ${resource.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          if ((resource as any).url) {
                            window.open((resource as any).url, '_blank', 'noopener');
                          }
                          toast({
                            title: `Opening ${resource.title}`,
                            description: (resource as any).url ? 'Trusted resource opened in a new tab.' : 'This feature will be available soon with curated content.',
                          });
                        }}
                      >
                        Explore
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SelfHelpLibrary;
