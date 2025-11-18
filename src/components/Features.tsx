import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, BookOpen, MessageCircle, Wind, TrendingUp, UserPlus, ClipboardCheck, AlertCircle, Flower2 } from "lucide-react";

/**
 * Features Section Component
 * Displays core features with icons and descriptions in card format
 */
const Features = () => {
  const features = [
    {
      icon: UserPlus,
      title: "Flexible Access",
      description: "Get started with user registration or explore anonymously. Your privacy, your choice.",
      color: "text-primary",
    },
    {
      icon: ClipboardCheck,
      title: "Mental Health Assessments",
      description: "Complete comprehensive assessments to understand your mental well-being and track progress.",
      color: "text-accent",
    },
    {
      icon: Heart,
      title: "Mood Tracking",
      description: "Monitor your emotional journey with intuitive inputs and visualize patterns over time with history.",
      color: "text-sentiment-positive",
    },
    {
      icon: BookOpen,
      title: "Sentiment-Aware Journaling",
      description: "Express yourself freely with AI-powered sentiment analysis and real-time emotional feedback.",
      color: "text-primary",
    },
    {
      icon: MessageCircle,
      title: "GPT-Powered Therapist",
      description: "Chat with our advanced AI therapist for insights, support, and compassionate guidance 24/7.",
      color: "text-accent",
    },
    {
      icon: TrendingUp,
      title: "Weekly Summary Reports",
      description: "Receive comprehensive weekly reports analyzing your emotional patterns and mental health growth.",
      color: "text-primary",
    },
    {
      icon: Flower2,
      title: "Mindful Meditations",
      description: "Curated guided meditation sessions designed to nurture your mental well-being and inner peace.",
      color: "text-secondary",
    },
    {
      icon: Wind,
      title: "Self-Help Library",
      description: "Access breathing exercises, gratitude prompts, and wellness resources for daily mindfulness.",
      color: "text-accent",
    },
    {
      icon: AlertCircle,
      title: "Emergency Detection",
      description: "Automatic keyword detection for crisis situations with immediate access to support resources.",
      color: "text-destructive",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Features for Your Wellness
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need to support your mental health journey in one safe, private space
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full bg-gradient-card border-border shadow-soft hover:shadow-hover transition-all duration-300 hover:scale-105">
                  <CardHeader>
                    <div className={`w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4 ${feature.color}`}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <CardTitle className="text-xl font-semibold text-foreground">
                      {feature.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-muted-foreground text-base">
                      {feature.description}
                    </CardDescription>
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

export default Features;
