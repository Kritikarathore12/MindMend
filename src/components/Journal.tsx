import { useState } from "react";
import { motion } from "framer-motion";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Smile, Meh, Frown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Journal Section Component
 * Sentiment-aware journaling with real-time color feedback
 */
const Journal = () => {
  const [journalEntry, setJournalEntry] = useState("");
  const [sentiment, setSentiment] = useState<"positive" | "neutral" | "negative" | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  // Mock sentiment analysis based on word count and simple keyword detection
  const analyzeSentiment = (text: string) => {
    if (!text.trim()) {
      setSentiment(null);
      return;
    }

    const lowerText = text.toLowerCase();
    const positiveWords = ["happy", "joy", "grateful", "love", "great", "wonderful", "amazing", "good", "better", "peaceful"];
    const negativeWords = ["sad", "angry", "anxious", "worried", "terrible", "bad", "depressed", "stressed", "hurt", "pain"];

    const positiveCount = positiveWords.filter(word => lowerText.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lowerText.includes(word)).length;

    if (positiveCount > negativeCount) {
      setSentiment("positive");
    } else if (negativeCount > positiveCount) {
      setSentiment("negative");
    } else {
      setSentiment("neutral");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setJournalEntry(text);
    analyzeSentiment(text);
  };

  const handleSave = async () => {
    if (!journalEntry.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    // If user is not logged in, show message and don't save
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to save your journal entries and track your progress over time.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase
        .from("journal_entries")
        .insert({
          user_id: user.id,
          content: journalEntry,
          sentiment: sentiment || null,
        });

      if (error) throw error;

      toast({
        title: "Journal Saved ✨",
        description: "Your thoughts have been safely recorded.",
      });

      setJournalEntry("");
      setSentiment(null);
    } catch (error) {
      console.error("Error saving journal entry:", error);
      toast({
        title: "Save Failed",
        description: "Could not save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getSentimentColor = () => {
    if (!sentiment) return "border-border";
    if (sentiment === "positive") return "border-sentiment-positive";
    if (sentiment === "negative") return "border-sentiment-negative";
    return "border-sentiment-neutral";
  };

  const getSentimentIcon = () => {
    if (!sentiment) return null;
    if (sentiment === "positive") return <Smile className="h-6 w-6 text-sentiment-positive" />;
    if (sentiment === "negative") return <Frown className="h-6 w-6 text-sentiment-negative" />;
    return <Meh className="h-6 w-6 text-sentiment-neutral" />;
  };

  return (
    <section id="journal" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground">Your Journal</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Express your thoughts and feelings. Our AI will analyze the sentiment to help you understand your emotions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Textarea
                    value={journalEntry}
                    onChange={handleInputChange}
                    placeholder="How are you feeling today? Write freely..."
                    className={`min-h-[200px] text-base transition-colors duration-300 ${getSentimentColor()} border-2`}
                  />
                  {sentiment && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute top-3 right-3"
                    >
                      {getSentimentIcon()}
                    </motion.div>
                  )}
                </div>

                {sentiment && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-sm text-muted-foreground flex items-center gap-2"
                  >
                    {getSentimentIcon()}
                    <span>
                      {sentiment === "positive" && "Your entry seems positive 💙"}
                      {sentiment === "negative" && "We're here for you. It's okay to feel this way."}
                      {sentiment === "neutral" && "Thank you for sharing your thoughts."}
                    </span>
                  </motion.div>
                )}

                <Button
                  onClick={handleSave}
                  disabled={isSaving || !journalEntry.trim()}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  size="lg"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {isSaving ? "Saving..." : user ? "Save Entry" : "Login to Save"}
                </Button>
                {!user && (
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    💡 Login to save your journal entries and track your emotional journey over time
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Journal;
