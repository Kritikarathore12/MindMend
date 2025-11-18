import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import React from "react";

interface JoyBurstProps {
  isOpen: boolean;
  onClose: () => void;
}

const JOY_BURSTS = [
  "Smile at yourself in the mirror!",
  "Do 5 jumping jacks!",
  "Stretch your arms to the sky!",
  "Name 3 good things about today!",
  "Make the silliest face you can!",
  "Wave both hands above your head!",
  "Do a silly dance for 5 seconds!",
  "Send a quick compliment to yourself!",
  "Close your eyes and think of a happy place!",
  "Breathe in deeply, then exhale with a big sigh!",
  "Give yourself a big hug!",
  "Hop in place 3 times!",
  "Write or say something you’re grateful for!",
  "Draw a quick doodle of a smile!",
  "Sing a line from your favorite song!"
];

const getRandomPrompt = (excludeIdx?: number[]) => {
  let idx = Math.floor(Math.random() * JOY_BURSTS.length);
  let attempts = 0;
  while (excludeIdx && excludeIdx.includes(idx) && attempts < 5) {
    idx = Math.floor(Math.random() * JOY_BURSTS.length);
    attempts++;
  }
  return idx;
};

const JoyBurst = ({ isOpen, onClose }: JoyBurstProps) => {
  const [displayed, setDisplayed] = useState<number[]>([]);
  const [currentIdx, setCurrentIdx] = useState(() => getRandomPrompt());
  const [completedCount, setCompletedCount] = useState(0);
  const [justCompleted, setJustCompleted] = useState(false);
  const { toast } = useToast();

  // Reset on open
  React.useEffect(() => {
    if (isOpen) {
      setCompletedCount(0);
      setDisplayed([]);
      setCurrentIdx(getRandomPrompt());
      setJustCompleted(false);
    }
  }, [isOpen]);

  const handleDone = () => {
    setJustCompleted(true);
    setCompletedCount(prev => prev + 1);
    toast({ title: "Joy burst!", description: "You did it! ✨" });
    setTimeout(() => {
      // Pick a new, not just-completed prompt
      const seen = [...displayed, currentIdx];
      let nextIdx = getRandomPrompt(seen);
      setDisplayed(seen.length >= JOY_BURSTS.length ? [] : seen);
      setCurrentIdx(nextIdx);
      setJustCompleted(false);
    }, 900);
  };

  const handleNew = () => {
    setJustCompleted(false);
    let nextIdx = getRandomPrompt([currentIdx]);
    setCurrentIdx(nextIdx);
  };

  const sessionBonus = completedCount >= 3;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl w-full bg-gradient-to-br from-yellow-100 via-orange-100 to-pink-100 dark:from-yellow-900 dark:via-orange-900 dark:to-pink-900 p-0 overflow-hidden">
        <div className="relative flex flex-col gap-5 p-8 min-h-[340px] items-center justify-center">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div initial={{ scale: 0.6 }} animate={{ scale: 1 }} transition={{ type: "spring" }} className="w-14 h-14 rounded-2xl bg-gradient-to-br from-yellow-400 to-orange-400 flex items-center justify-center shadow-lg">
                <Zap className="h-8 w-8 text-white drop-shadow-lg animate-pulse" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-pink-500 bg-clip-text text-transparent">Joy Burst!</h2>
            </div>
            <p className="text-md text-muted-foreground">Quick mood boosters – do one or try a bunch!</p>
          </motion.div>
          <div className="w-full max-w-[480px]">
            <AnimatePresence mode="wait">
              {justCompleted ? (
                <motion.div
                  key="celebrate"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="flex flex-col gap-2 items-center justify-center"
                >
                  <Zap className="h-10 w-10 text-yellow-400 animate-ping mb-2" />
                  <span className="font-bold text-lg bg-gradient-to-r from-yellow-600 to-pink-500 bg-clip-text text-transparent">That’s a burst of joy! ✨</span>
                </motion.div>
              ) : (
                <motion.div
                  key="prompt"
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.85 }}
                  transition={{ duration: 0.36, type: "spring" }}
                  className="flex flex-col gap-4 items-center"
                >
                  <span className="text-xl font-medium text-center text-foreground px-4 py-3 rounded-2xl bg-white bg-opacity-50 dark:bg-background/70 shadow shadow-orange-300 max-w-full">
                    {JOY_BURSTS[currentIdx]}
                  </span>
                  <div className="flex flex-row gap-3 mt-4 items-center">
                    <Button size="lg" className="bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg" onClick={handleDone}>I did it!</Button>
                    <Button size="lg" variant="outline" onClick={handleNew}>New Burst</Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <p className="text-sm text-muted-foreground mt-6">Bursts completed: <b>{completedCount}</b></p>
          <AnimatePresence>
            {sessionBonus && !justCompleted && (
              <motion.div
                key="bonus"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.54, type: "spring" }}
                className="flex flex-col gap-2 items-center mt-2"
              >
                <span className="font-bold text-lg bg-gradient-to-r from-orange-600 to-pink-500 bg-clip-text text-transparent">🔥 Joy streak! You’re on a roll!</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JoyBurst;



