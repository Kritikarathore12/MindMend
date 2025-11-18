import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Star, CheckCircle2, Trash2, Edit3 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StarWishesProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Wish {
  id: string;
  text: string;
  completed: boolean;
}

const MAX_WISHES = 3;
const STORAGE_KEY = "star_wishes_entries";

const defaultPrompts = [
  "What do you wish for your wellness this week?",
  "What's a positive intention or goal?",
  "A small, meaningful step for yourself?",
];

const StarWishes = ({ isOpen, onClose }: StarWishesProps) => {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [newWish, setNewWish] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      // Load from storage
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishes(JSON.parse(stored));
      }
    }
  }, [isOpen]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishes));
  }, [wishes]);

  const handleAddWish = () => {
    if (wishes.length >= MAX_WISHES) return;
    if (!newWish.trim()) {
      toast({
        title: "Write something!",
        description: "Set your intention or wish before adding.",
        variant: "destructive",
      });
      return;
    }
    setWishes([
      ...wishes,
      { id: Date.now().toString(), text: newWish, completed: false },
    ]);
    setNewWish("");
    toast({ title: "Wish added!", description: "Wish big—then go for it 🌟" });
  };

  const handleDelete = (id: string) => {
    setWishes(wishes.filter((w) => w.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setWishes(
      wishes.map((w) =>
        w.id === id ? { ...w, completed: !w.completed } : w
      )
    );
  };

  const handleEditStart = (id: string, text: string) => {
    setEditingId(id);
    setEditingText(text);
  };

  const handleEditSave = () => {
    if (!editingId) return;
    setWishes(
      wishes.map((w) =>
        w.id === editingId ? { ...w, text: editingText } : w
      )
    );
    setEditingId(null);
    setEditingText("");
    toast({ title: "Wish updated!" });
  };

  const handleEditCancel = () => {
    setEditingId(null);
    setEditingText("");
  };

  const allCompleted = wishes.length > 0 && wishes.every((w) => w.completed);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl w-full bg-gradient-to-br from-yellow-50 via-blue-50 to-amber-100 dark:from-yellow-950 dark:via-blue-950 dark:to-amber-900 p-0 overflow-hidden">
        <div className="relative min-h-[400px] flex flex-col p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring" }}
                className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-yellow-400 flex items-center justify-center shadow-lg"
              >
                <Star className="h-8 w-8 text-white drop-shadow-lg" />
              </motion.div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">
                Star Wishes
              </h2>
            </div>
            <p className="text-muted-foreground">Set intentions for your well-being and watch yourself shine.</p>
          </motion.div>

          {/* Wishes List */}
          <AnimatePresence>
            {wishes.length > 0 && (
              <motion.ul
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-4 space-y-4"
              >
                {wishes.map((wish, i) => (
                  <li
                    key={wish.id}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 bg-white/60 dark:bg-background/70 shadow-md ${wish.completed ? "border-amber-500" : "border-border"}`}
                  >
                    <button
                      onClick={() => handleToggleComplete(wish.id)}
                      className={`w-7 h-7 flex items-center justify-center rounded-full border-2 focus:outline-none focus:ring-2 transition-all ${wish.completed ? "border-yellow-500 bg-yellow-300" : "border-muted-foreground"}`}
                      aria-label="Mark as completed"
                    >
                      {wish.completed ? (
                        <CheckCircle2 className="h-5 w-5 text-amber-600" />
                      ) : (
                        <Star className="h-5 w-5 text-muted-foreground" />
                      )}
                    </button>
                    {editingId === wish.id ? (
                      <>
                        <Input
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="flex-1 mr-2"
                          autoFocus
                        />
                        <Button onClick={handleEditSave} size="sm" type="button" variant="outline">Save</Button>
                        <Button onClick={handleEditCancel} size="sm" type="button" variant="ghost">Cancel</Button>
                      </>
                    ) : (
                      <>
                        <span className={`flex-1 text-lg ${wish.completed ? "line-through text-amber-500" : "text-foreground"}`}>{wish.text}</span>
                        <Button onClick={() => handleEditStart(wish.id, wish.text)} size="icon" type="button" variant="ghost" className="mr-1"><Edit3 className="h-4 w-4" /></Button>
                        <Button onClick={() => handleDelete(wish.id)} size="icon" type="button" variant="ghost"><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </>
                    )}
                  </li>
                ))}
              </motion.ul>
            )}
          </AnimatePresence>

          {/* Add wish form */}
          {wishes.length < MAX_WISHES && (
            <div className="flex items-center gap-3 mb-6">
              <Input
                value={newWish}
                onChange={e => setNewWish(e.target.value)}
                placeholder={defaultPrompts[wishes.length] || "Your new wish..."}
                maxLength={70}
                className="flex-1"
                onKeyDown={e => { if (e.key === "Enter") handleAddWish(); }}
              />
              <Button onClick={handleAddWish} type="button" className="bg-gradient-to-r from-yellow-400 to-amber-400 text-white shadow-lg" disabled={wishes.length >= MAX_WISHES}>
                Add
              </Button>
            </div>
          )}

          {/* Completion celebration */}
          <AnimatePresence>
            {allCompleted && (
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ duration: 0.45, type: "spring" }}
                className="mt-8 flex flex-col items-center gap-2"
              >
                <Star className="h-10 w-10 text-amber-400 animate-pulse mb-2" />
                <div className="text-xl font-bold bg-gradient-to-r from-yellow-600 to-amber-500 bg-clip-text text-transparent">You did it! All your wishes are complete!</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StarWishes;



