import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Pause, Play, RotateCcw, X } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface BreathingWaveProps {
  isOpen: boolean;
  onClose: () => void;
}

type BreathingPhase = "inhale" | "hold-in" | "exhale" | "hold-out";

const BreathingWave = ({ isOpen, onClose }: BreathingWaveProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>("inhale");
  const [cycle, setCycle] = useState(0);
  const [countdown, setCountdown] = useState(4);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const phaseRef = useRef<BreathingPhase>("inhale");

  // Breathing pattern: 4-4-4-4 (inhale-hold-exhale-hold)
  const breathingPattern = {
    inhale: 4,
    "hold-in": 4,
    exhale: 4,
    "hold-out": 4,
  };

  const phaseMessages = {
    inhale: "Breathe In",
    "hold-in": "Hold",
    exhale: "Breathe Out",
    "hold-out": "Hold",
  };

  const phaseInstructions = {
    inhale: "Slowly breathe in through your nose",
    "hold-in": "Hold your breath gently",
    exhale: "Slowly breathe out through your mouth",
    "hold-out": "Take a moment to rest",
  };

  const resetBreathing = () => {
    setPhase("inhale");
    phaseRef.current = "inhale";
    setCycle(0);
    setCountdown(breathingPattern.inhale);
    setIsPlaying(false);
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
  };

  useEffect(() => {
    if (!isOpen) {
      resetBreathing();
    }
    return () => {
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
      }
    };
  }, [isOpen]);

  // Update countdown when phase changes
  useEffect(() => {
    phaseRef.current = phase;
    if (isPlaying) {
      setCountdown(breathingPattern[phase]);
    }
  }, [phase, isPlaying]);

  const startBreathing = () => {
    if (isPlaying) {
      // Pause
      setIsPlaying(false);
      if (countdownRef.current) {
        clearInterval(countdownRef.current);
        countdownRef.current = null;
      }
    } else {
      // Play
      setIsPlaying(true);
      runBreathingCycle();
    }
  };

  const runBreathingCycle = () => {
    // Clear any existing interval
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
    }

    const phases: BreathingPhase[] = ["inhale", "hold-in", "exhale", "hold-out"];
    
    // Countdown timer that updates phase when countdown reaches 0
    const countdownInterval = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          // Move to next phase
          const currentIndex = phases.indexOf(phaseRef.current);
          let nextIndex = currentIndex + 1;
          
          if (nextIndex >= phases.length) {
            nextIndex = 0;
            setCycle((prevCycle) => prevCycle + 1);
          }
          
          const newPhase = phases[nextIndex];
          setPhase(newPhase);
          
          return breathingPattern[newPhase];
        }
        return prevCountdown - 1;
      });
    }, 1000);

    countdownRef.current = countdownInterval;
  };

  // Calculate wave scale based on phase
  const getWaveScale = () => {
    if (!isPlaying) return 1;
    
    const phaseProgress = (breathingPattern[phase] - countdown) / breathingPattern[phase];
    
    switch (phase) {
      case "inhale":
        // Expand from 0.8 to 1.5
        return 0.8 + phaseProgress * 0.7;
      case "hold-in":
        // Stay at 1.5
        return 1.5;
      case "exhale":
        // Contract from 1.5 to 0.8
        return 1.5 - phaseProgress * 0.7;
      case "hold-out":
        // Stay at 0.8
        return 0.8;
      default:
        return 1;
    }
  };

  const waveScale = getWaveScale();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-cyan-950 dark:via-blue-950 dark:to-teal-950 overflow-hidden">
        <div className="relative min-h-[600px] flex flex-col items-center justify-center p-8">
          {/* Main breathing animation */}
          <div className="flex flex-col items-center justify-center space-y-8 flex-1">
            {/* Wave visualization */}
            <div className="relative w-80 h-80 flex items-center justify-center">
              {/* Outer wave ring */}
              <motion.div
                className="absolute rounded-full border-4 border-cyan-400/30"
                style={{
                  width: 320,
                  height: 320,
                }}
                animate={{
                  scale: waveScale * 1.2,
                  opacity: [0.3, 0.5, 0.3],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Middle wave ring */}
              <motion.div
                className="absolute rounded-full border-4 border-blue-400/40"
                style={{
                  width: 280,
                  height: 280,
                }}
                animate={{
                  scale: waveScale * 1.1,
                  opacity: [0.4, 0.6, 0.4],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              {/* Main breathing circle */}
              <motion.div
                className="rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-teal-500 shadow-2xl flex items-center justify-center"
                style={{
                  width: 240,
                  height: 240,
                }}
                animate={{
                  scale: waveScale,
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: isPlaying ? Infinity : 0,
                }}
              >
                <div className="text-white text-center">
                  <motion.div
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-3xl font-bold mb-2"
                  >
                    {phaseMessages[phase]}
                  </motion.div>
                  <div className="text-6xl font-bold">
                    {countdown}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Instructions */}
            <motion.div
              key={phase}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-2"
            >
              <p className="text-lg text-muted-foreground font-medium">
                {phaseInstructions[phase]}
              </p>
              <p className="text-sm text-muted-foreground">
                Cycle {cycle + 1}
              </p>
            </motion.div>

            {/* Controls */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                onClick={startBreathing}
                size="lg"
                className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 text-white px-8"
              >
                {isPlaying ? (
                  <>
                    <Pause className="mr-2 h-5 w-5" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-5 w-5" />
                    Start
                  </>
                )}
              </Button>
              
              <Button
                onClick={resetBreathing}
                variant="outline"
                size="lg"
                className="px-8"
              >
                <RotateCcw className="mr-2 h-5 w-5" />
                Reset
              </Button>
            </div>

            {/* Pattern indicator */}
            <div className="mt-4 text-center">
              <p className="text-xs text-muted-foreground">
                Breathing Pattern: 4-4-4-4 (Inhale • Hold • Exhale • Hold)
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreathingWave;

