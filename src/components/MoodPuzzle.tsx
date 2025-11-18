import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Puzzle, X, RotateCcw, Trophy, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MoodPuzzleProps {
  isOpen: boolean;
  onClose: () => void;
}

type Emotion = {
  id: string;
  name: string;
  emoji: string;
  color: string;
};

type CardState = "hidden" | "flipped" | "matched";

type Card = {
  id: string;
  emotion: Emotion;
  state: CardState;
  index: number;
};

const emotions: Emotion[] = [
  { id: "happy", name: "Happy", emoji: "😊", color: "from-yellow-400 to-orange-400" },
  { id: "sad", name: "Sad", emoji: "😢", color: "from-blue-400 to-cyan-400" },
  { id: "angry", name: "Angry", emoji: "😠", color: "from-red-400 to-pink-400" },
  { id: "excited", name: "Excited", emoji: "🤩", color: "from-purple-400 to-pink-400" },
  { id: "calm", name: "Calm", emoji: "😌", color: "from-green-400 to-teal-400" },
  { id: "anxious", name: "Anxious", emoji: "😰", color: "from-orange-400 to-red-400" },
  { id: "love", name: "Love", emoji: "❤️", color: "from-pink-400 to-rose-400" },
  { id: "surprised", name: "Surprised", emoji: "😲", color: "from-indigo-400 to-purple-400" },
];

const MoodPuzzle = ({ isOpen, onClose }: MoodPuzzleProps) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameWon, setGameWon] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Initialize game
  const initializeGame = () => {
    // Create pairs of cards
    const cardPairs: Card[] = [];
    const selectedEmotions = emotions.slice(0, 6); // Use 6 emotions for 12 cards (3x4 grid)
    
    selectedEmotions.forEach((emotion, index) => {
      // Create two cards for each emotion
      cardPairs.push({
        id: `${emotion.id}-1`,
        emotion,
        state: "hidden",
        index: index * 2,
      });
      cardPairs.push({
        id: `${emotion.id}-2`,
        emotion,
        state: "hidden",
        index: index * 2 + 1,
      });
    });

    // Shuffle cards
    const shuffled = cardPairs.sort(() => Math.random() - 0.5);
    setCards(shuffled);
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameWon(false);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (isOpen) {
      initializeGame();
    }
  }, [isOpen]);

  const handleCardClick = (index: number) => {
    // Don't allow clicking if processing, already matched, already flipped, or two cards are already flipped
    if (
      isProcessing ||
      cards[index].state === "matched" ||
      cards[index].state === "flipped" ||
      flippedCards.length >= 2
    ) {
      return;
    }

    const newCards = [...cards];
    newCards[index].state = "flipped";
    setCards(newCards);
    setFlippedCards([...flippedCards, index]);
  };

  useEffect(() => {
    if (flippedCards.length === 2) {
      setIsProcessing(true);
      const [firstIndex, secondIndex] = flippedCards;
      const firstCard = cards[firstIndex];
      const secondCard = cards[secondIndex];

      setTimeout(() => {
        const currentMoves = moves;
        const nextMoves = currentMoves + 1;
        
        if (firstCard.emotion.id === secondCard.emotion.id) {
          // Match found!
          setCards((prevCards) => {
            const newCards = [...prevCards];
            newCards[firstIndex].state = "matched";
            newCards[secondIndex].state = "matched";
            return newCards;
          });
          
          setMatches((prevMatches) => {
            const newMatches = prevMatches + 1;
            // Check if all matched
            if (newMatches === emotions.slice(0, 6).length) {
              setTimeout(() => {
                setGameWon(true);
                toast({
                  title: "🎊 Puzzle Complete!",
                  description: `You completed the puzzle in ${nextMoves} moves!`,
                });
              }, 500);
            }
            return newMatches;
          });
          
          setMoves(nextMoves);
          
          toast({
            title: "🎉 Match Found!",
            description: `You matched ${firstCard.emotion.name}!`,
          });
        } else {
          // No match - flip back
          setCards((prevCards) => {
            const newCards = [...prevCards];
            newCards[firstIndex].state = "hidden";
            newCards[secondIndex].state = "hidden";
            return newCards;
          });
          setMoves(nextMoves);
        }

        setFlippedCards([]);
        setIsProcessing(false);
      }, 1000);
    }
  }, [flippedCards, cards, moves, toast]);

  const getCardContent = (card: Card) => {
    if (card.state === "hidden") {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <Puzzle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 text-purple-400" />
        </div>
      );
    }
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-1.5 sm:p-2 md:p-3">
        <div className="text-xl sm:text-2xl md:text-3xl mb-0.5 sm:mb-1">{card.emotion.emoji}</div>
        <div className="text-[10px] sm:text-xs md:text-sm font-semibold text-white text-center px-1 leading-tight">{card.emotion.name}</div>
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] p-0 bg-gradient-to-br from-purple-50 via-pink-50 to-indigo-50 dark:from-purple-950 dark:via-pink-950 dark:to-indigo-950 overflow-hidden">
        <div className="relative flex flex-col h-full max-h-[90vh]">
          {/* Win Screen */}
          <AnimatePresence>
            {gameWon && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 text-center max-w-md shadow-2xl"
                >
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.5,
                      repeat: Infinity,
                      repeatDelay: 2,
                    }}
                    className="inline-block mb-4"
                  >
                    <Trophy className="h-16 w-16 text-yellow-500 mx-auto" />
                  </motion.div>
                  <h3 className="text-3xl font-bold mb-2 text-foreground">
                    Puzzle Complete! 🎊
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You matched all emotions in {moves} moves!
                  </p>
                  <p className="text-sm text-muted-foreground mb-6">
                    Great job building your emotional awareness!
                  </p>
                  <div className="flex gap-3 justify-center">
                    <Button onClick={initializeGame} className="bg-gradient-to-r from-purple-500 to-pink-500">
                      Play Again
                    </Button>
                    <Button onClick={onClose} variant="outline">
                      Close
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-3 px-4 sm:px-6 md:px-8 flex-shrink-0"
          >
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2">
              <Puzzle className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500" />
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Mood Puzzle</h2>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Match the emotion pairs to build emotional awareness
            </p>
          </motion.div>

          {/* Game Stats */}
          <div className="flex items-center justify-between px-4 sm:px-6 md:px-8 pb-3 flex-shrink-0">
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-purple-600">{matches}</div>
                <div className="text-xs text-muted-foreground">Matches</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-pink-600">{moves}</div>
                <div className="text-xs text-muted-foreground">Moves</div>
              </div>
            </div>
            <Button
              onClick={initializeGame}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Restart</span>
              <span className="sm:hidden">Reset</span>
            </Button>
          </div>

          {/* Game Grid */}
          <div className="flex-1 flex items-center justify-center overflow-y-auto px-3 sm:px-4 md:px-6 py-3">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2 w-full max-w-xl mx-auto">
              {cards.map((card, index) => (
                <motion.button
                  key={`${card.id}-${index}`}
                  onClick={() => handleCardClick(index)}
                  disabled={isProcessing || card.state === "matched"}
                  className={`aspect-square rounded-md sm:rounded-lg overflow-hidden relative ${
                    card.state === "matched"
                      ? "opacity-50 cursor-not-allowed"
                      : "cursor-pointer hover:scale-105 transition-transform"
                  } ${
                    card.state === "flipped" || card.state === "matched"
                      ? `bg-gradient-to-br ${card.emotion.color}`
                      : "bg-gradient-to-br from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800"
                  } shadow-md`}
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    delay: index * 0.05,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={card.state !== "matched" && card.state !== "flipped" ? { scale: 1.05 } : {}}
                  whileTap={card.state !== "matched" ? { scale: 0.95 } : {}}
                >
                  <motion.div
                    initial={false}
                    animate={{
                      rotateY: card.state === "hidden" ? 180 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    className="w-full h-full relative"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    {/* Back of card (hidden state) */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(180deg)",
                      }}
                    >
                      {getCardContent({ ...card, state: "hidden" })}
                    </div>
                    {/* Front of card (flipped/matched state) */}
                    <div
                      className="absolute inset-0 w-full h-full"
                      style={{
                        backfaceVisibility: "hidden",
                        WebkitBackfaceVisibility: "hidden",
                        transform: "rotateY(0deg)",
                      }}
                    >
                      {getCardContent(card)}
                    </div>
                  </motion.div>

                  {/* Match indicator */}
                  {card.state === "matched" && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1"
                    >
                      <Heart className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 text-white fill-white" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center text-xs sm:text-sm text-muted-foreground px-4 sm:px-6 md:px-8 py-3 flex-shrink-0"
          >
            💡 Click cards to flip them and find matching emotion pairs
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MoodPuzzle;

