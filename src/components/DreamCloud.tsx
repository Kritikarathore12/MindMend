import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Cloud } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DreamCloudProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCAL_KEY = "dream_cloud_entry";

const cloudPrompts = [
  "Imagine you’re on a cloud. What do you see, hear, or feel?",
  "Describe your dream calm place: where is it?",
  "What smells, sounds, and colors make you peaceful?"
];

const DreamCloud = ({ isOpen, onClose }: DreamCloudProps) => {
  const [dreamText, setDreamText] = useState("");
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // On open, load saved entry
  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem(LOCAL_KEY);
      setLastSaved(stored || null);
      setDreamText(stored || "");
    }
  }, [isOpen]);

  const handleSave = () => {
    if (!dreamText.trim()) {
      toast({
        title: "Try visualizing!",
        description: "Describe your dream cloud retreat and save it.",
        variant: "destructive"
      });
      return;
    }
    setSaving(true);
    localStorage.setItem(LOCAL_KEY, dreamText);
    setTimeout(() => {
      toast({ title: "🌥️ Dream Cloud Saved!", description: "Visit your safe place anytime for calm." });
      setLastSaved(dreamText);
      setSaving(false);
      onClose();
    }, 900);
  };

  const handlePreset = (preset: string) => {
    setDreamText(preset);
  };

  // Cloud animation (framer-motion SVG)
  const AnimatedCloud = () => (
    <motion.svg
      width="130"
      height="75"
      viewBox="0 0 130 75"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="mb-4 select-none"
    >
      <motion.ellipse
        cx="60"
        cy="42"
        rx="50"
        ry="27"
        fill="#E0EDFA"
        animate={{
          x: [0, 8, 0, -8, 0],
          y: [0, -3, -6, -3, 0]
        }}
        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="100"
        cy="48"
        rx="20"
        ry="12"
        fill="#F1F8FC"
        animate={{
          x: [0, -6, 0, 6, 0],
          y: [0, 2, 5, 2, 0]
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
      <motion.ellipse
        cx="25"
        cy="52"
        rx="17"
        ry="10"
        fill="#DAECF8"
        animate={{
          x: [0, 5, -5, 0],
          y: [0, 1, 3, 0]
        }}
        transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
      />
    </motion.svg>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full bg-gradient-to-br from-sky-100 via-blue-50 to-indigo-100 dark:from-blue-950 dark:via-indigo-950 dark:to-sky-900 p-0 overflow-hidden">
        <div className="relative flex flex-col gap-5 p-8 min-h-[390px] items-center">
          {/* Animated Cloud and Header */}
          <div className="flex flex-col items-center -mt-5">
            <AnimatedCloud />
            <h2 className="text-3xl font-bold mt-2 bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Dream Cloud</h2>
            <p className="text-md text-muted-foreground mt-2 text-center max-w-md">Visualize your safe, relaxing place. Settle into your cloud and let thoughts drift peacefully.</p>
          </div>

          {/* Preset prompts */}
          <div className="w-full flex flex-wrap gap-2 justify-center mt-4 mb-1">
            {cloudPrompts.map((p, i) => (
              <Button key={i} size="sm" variant="outline" className="rounded-full px-3 border-sky-300 text-sky-800 dark:text-sky-200" type="button" onClick={() => handlePreset(p)}>
                {p}
              </Button>
            ))}
          </div>

          {/* Textarea input */}
          <textarea
            value={dreamText}
            onChange={e => setDreamText(e.target.value)}
            placeholder="Describe your dream sky, peaceful landscape, or comforting retreat..."
            className="w-full mt-1 p-4 rounded-xl border-2 border-blue-200 bg-background/80 focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-200/50 resize-none text-lg min-h-[96px]"
            maxLength={500}
            spellCheck
          />

          {/* Last saved entry (if any and not in textarea) */}
          {lastSaved && lastSaved !== dreamText && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-2 text-center text-sm text-blue-700 dark:text-sky-200/80">
              <span className="font-semibold">Last Dream Cloud:</span> <q>{lastSaved}</q>
            </motion.div>
          )}

          {/* Actions */}
          <div className="w-full flex justify-center gap-3 mt-6">
            <Button onClick={handleSave} disabled={saving} size="lg" className="bg-gradient-to-r from-sky-400 to-blue-500 text-white shadow-md">Save</Button>
            <Button onClick={onClose} size="lg" variant="ghost">Cancel</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DreamCloud;



