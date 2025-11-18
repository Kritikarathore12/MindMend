import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, Shield, Phone, MessageSquare, ExternalLink } from "lucide-react";

/**
 * Emergency Detection Component
 * Educates users about automatic crisis keyword detection and provides immediate access to support
 */
const EmergencyDetection = () => {
  const crisisKeywords = [
    "suicide", "kill myself", "end my life", "want to die", "better off dead",
    "harm myself", "hurt myself", "no reason to live", "can't go on",
    "overdose", "end it all", "suicide plan"
  ];

  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 crisis support",
      icon: Phone,
      color: "text-destructive",
    },
    {
      name: "Crisis Text Line",
      text: "HOME to 741741",
      description: "Text-based support",
      icon: MessageSquare,
      color: "text-accent",
    },
  ];

  const safetyFeatures = [
    {
      title: "Automatic Detection",
      description: "Our AI monitors for crisis-related keywords and phrases in your journal entries and chat conversations.",
      icon: AlertCircle,
    },
    {
      title: "Immediate Response",
      description: "When crisis keywords are detected, you'll immediately see emergency resources and support options.",
      icon: Shield,
    },
    {
      title: "Privacy Protected",
      description: "All detection happens privately within your account. Your data remains confidential and secure.",
      icon: Shield,
    },
  ];

  return (
    <section id="emergency-detection" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4">
            Emergency Detection System
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Automatic keyword detection for crisis situations with immediate access to support resources
          </p>
        </motion.div>

        {/* Crisis Alert */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <Alert className="border-destructive bg-destructive/10">
            <AlertCircle className="h-5 w-5 text-destructive" />
            <AlertTitle className="text-destructive font-semibold text-lg">
              If you're in crisis, help is available now
            </AlertTitle>
            <AlertDescription className="text-foreground mt-2">
              Call 988 (Suicide & Crisis Lifeline) or text HOME to 741741 (Crisis Text Line) for immediate support.
              These services are free, confidential, and available 24/7.
            </AlertDescription>
          </Alert>
        </motion.div>

        {/* How It Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {safetyFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="bg-card border-border shadow-soft">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-semibold text-foreground mb-6 text-center">Emergency Contacts</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {emergencyContacts.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <Card key={index} className="bg-gradient-card border-border shadow-soft">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-3 ${contact.color}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-lg">{contact.name}</CardTitle>
                    <CardDescription className="text-base">
                      <strong className="text-foreground text-xl">
                        {contact.phone || contact.text}
                      </strong>
                    </CardDescription>
                    <CardDescription>{contact.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full" asChild>
                      <a href={contact.phone ? `tel:${contact.phone}` : "#"}>
                        {contact.phone ? "Call Now" : "Text Now"}
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </motion.div>

        {/* Monitored Keywords */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <Card className="bg-card border-border shadow-soft max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle>Crisis Keywords Monitored</CardTitle>
              <CardDescription>
                Our system monitors for these and similar phrases to ensure you get help when you need it
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {crisisKeywords.map((keyword, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-destructive/10 text-destructive rounded-full text-sm font-medium"
                  >
                    {keyword}
                  </span>
                ))}
              </div>
              <p className="text-muted-foreground text-sm mt-4">
                Detection is designed to be sensitive and supportive, not intrusive. Your privacy is always protected.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default EmergencyDetection;
