import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, MessageSquare, Heart, ExternalLink } from "lucide-react";

/**
 * Support Section Component
 * Emergency resources and support options
 */
const Support = () => {
  const resources = [
    {
      icon: Phone,
      title: "Crisis Hotline",
      description: "988 - National Suicide & Crisis Lifeline",
      link: "tel:988",
      linkText: "Call Now",
      color: "text-destructive",
    },
    {
      icon: MessageSquare,
      title: "Crisis Text Line",
      description: "Text 'HELLO' to 741741",
      link: "sms:741741?body=HELLO",
      linkText: "Text Now",
      color: "text-primary",
    },
    {
      icon: Heart,
      title: "Professional Help",
      description: "Find a therapist near you",
      link: "https://www.google.com/maps/search/psychologist+near+me",
      linkText: "Find Therapist",
      color: "text-accent",
    },
  ];

  return (
    <section id="support" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Need Immediate Support?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're not alone. Professional help is available 24/7. Your life matters.
          </p>
        </motion.div>

        {/* Emergency Message */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <Card className="bg-secondary/20 border-secondary shadow-soft">
            <CardContent className="pt-6 text-center">
              <p className="text-lg text-foreground font-medium">
                🆘 If you're in immediate danger or having thoughts of self-harm, please call 988 or go to your nearest emergency room.
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {resources.map((resource, index) => {
            const Icon = resource.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full shadow-soft hover:shadow-hover transition-all duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 ${resource.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{resource.title}</CardTitle>
                    <CardDescription className="text-base">
                      {resource.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full hover:bg-primary/10"
                    >
                      <a href={resource.link} target="_blank" rel="noopener noreferrer">
                        {resource.linkText}
                        <ExternalLink className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Anonymous Support Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="bg-gradient-card shadow-soft text-center">
            <CardContent className="pt-8 pb-8">
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-2xl font-semibold text-foreground mb-3">
                We're Here for You 24/7
              </h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                MindMend provides anonymous, stigma-free support. Whether you need someone to talk to at 3 AM or just want to track your mood, we're always here. Your mental health matters.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Support;
