import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Bot, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

/**
 * Chat Section Component
 * Virtual therapist chat interface with GPT-powered responses (mock)
 */

type Message = {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
};

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your MindMend companion. How are you feeling today? 💙",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Load chat history when user logs in
  useEffect(() => {
    if (user) {
      loadChatHistory();
    } else {
      // Reset to default message when logged out
      setMessages([
        {
          id: 1,
          text: "Hello! I'm your MindMend companion. How are you feeling today? 💙",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;

    setIsLoadingHistory(true);
    try {
      // Load last 50 messages from today
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", todayStart.toISOString())
        .order("created_at", { ascending: true })
        .limit(50);

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform database messages to Message format
        const historyMessages: Message[] = data.map((msg, index) => ({
          id: index + 1,
          text: msg.message,
          sender: msg.sender as "user" | "bot",
          timestamp: new Date(msg.created_at),
        }));

        // If no history, keep the welcome message, otherwise replace
        setMessages(historyMessages.length > 0 ? historyMessages : messages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Crisis keywords detection
  const detectCrisis = (message: string): boolean => {
    const crisisKeywords = [
      'suicide', 'kill myself', 'end my life', 'want to die', 'better off dead',
      'harm myself', 'hurt myself', 'no reason to live', 'can\'t go on',
      'overdose', 'end it all', 'suicide plan'
    ];
    
    const lowerMessage = message.toLowerCase();
    return crisisKeywords.some(keyword => lowerMessage.includes(keyword));
  };

  // Mock AI responses
  const getBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // CRITICAL: Check for crisis situations first
    if (detectCrisis(userMessage)) {
      const crisisResponses = [
        "Oh no… I'm really worried about you 💛💖 You don't have to face this alone 🌷\nPlease call 988 or text HOME to 741741 📞💌 — they're ready to help you 24/7 🌟\nYou matter so much, and I'm here with you 🤗✨",
        "Oh sweetie… 💜💛 I'm so sorry you're feeling this way 😞\nYou deserve love, safety, and care 🌈💖 Please reach out to 988 or text HOME to 741741 📞💌\nYou are not alone 🕊💫",
        "I hear you, and I'm really worried about you 💛\nYou deserve care and safety — please call 988 or text HOME to 741741 immediately 💌\nYou're not alone, and someone is ready to help you right now 🕊💖",
        "I'm really worried about you 💛 You are not alone 🌸 Please call 988 or text HOME to 741741 📞💌 They are ready to help you 💖",
        "I care about you 💛 You matter 🌸 Please connect with someone who can help right now 📞 988 💖",
        "You've been holding a lot 💛 Please reach out for help 📞 988 💖 You don't have to face this alone 🌸",
        "You are reason enough 💛 Please talk to someone now 📞 988 🌸 You matter deeply 💖",
        "You're not 💛 You are valuable 🌸 Please stay safe 💖 Reach out to 988 anytime 💫",
        "I'm really concerned 💛 Please call 988 or text HOME to 741741 🌸 Help is available 24/7 💖",
        "I'm here 💛 You matter 🌸 Please connect with someone who can help right now 📞 988 💖"
      ];
      return crisisResponses[Math.floor(Math.random() * crisisResponses.length)];
    }
    
    // Depression & sadness patterns
    if (lowerMessage.includes("depressed") || lowerMessage.includes("depression")) {
      const depressionResponses = [
        "Oh sweetie 💛💖 I'm so sorry you're feeling this way 😢 Depression can feel heavy like a cloudy day 🌧 But even clouds move and sunlight returns ☀ You don't have to go through this alone 🌸💫",
        "I hear you 💛 Depression can make everything feel dim, but even in the dark there's light 🌙✨\nYou don't have to go through this alone 💖 I'm here to talk, or we can focus on small moments that bring peace 🌸💛",
        "I'm here for you 💛 You're not alone, and you don't have to hide how you feel 🌸\nWould you like to share what's been hardest lately? 💖"
      ];
      return depressionResponses[Math.floor(Math.random() * depressionResponses.length)];
    }
    
    if (lowerMessage.includes("sad") || lowerMessage.includes("feeling down") || lowerMessage.includes("feel bad") || lowerMessage.includes("feeling low") || lowerMessage.includes("feel low")) {
      const sadnessResponses = [
        "I hear you 💛 It's okay to feel sad sometimes 🌸 Want to talk about what's hurting? 🤗",
        "That's okay 💛 Everyone has hard days 🌸 I'm here with you 💖",
        "I hear you 💛💖 That sounds really tough 🌧 It's okay to take things slow 🌸 Even tiny steps count 🐾✨ You're not alone — I'm here with you 💜",
        "That sounds really tough. It takes courage to say that out loud 💛\nWould you like to talk about what's been making you feel this way? 🌸"
      ];
      return sadnessResponses[Math.floor(Math.random() * sadnessResponses.length)];
    }
    
    if (lowerMessage.includes("nothing makes me happy") || lowerMessage.includes("no happiness") || lowerMessage.includes("empty inside") || lowerMessage.includes("feel empty")) {
      const emptinessResponses = [
        "I hear you… that sounds heavy 💖💛\nYou're not broken 🌸 Sometimes it's okay to rest and take small steps 🐾✨\nWant a virtual hug 🤗💛 or a little cute thought to cheer you up? 🌷💖",
        "That sounds really hard 💛💖 When joy feels far away, even small moments matter 🌷 Try something gentle — a warm drink ☕, soft music 🎶, or just resting 🌙 You deserve care 💫",
        "I get that. Sometimes it feels like the world loses its color 💛\nYou don't have to rush to feel okay again — it's okay to rest and take small steps 🌸\nYou've already done something brave by talking about it. ❤️"
      ];
      return emptinessResponses[Math.floor(Math.random() * emptinessResponses.length)];
    }
    
    if (lowerMessage.includes("want to cry") || lowerMessage.includes("keep crying") || lowerMessage.includes("can't stop crying")) {
      return "That's okay 💛💖 Crying helps your heart breathe 🌸 Let it out 💫 Then take a sip of water 💧 You're doing your best 💜";
    }
    
    if (lowerMessage.includes("can't get out of bed") || lowerMessage.includes("no energy")) {
      return "It's okay 💛 Sometimes your body just needs rest 🌸 You don't have to do everything today 💖 Just breathing and being here is enough 🌈 One tiny step at a time 🐾✨";
    }
    
    if (lowerMessage.includes("feel broken") || lowerMessage.includes("i'm broken")) {
      return "Oh sweetheart 💛💖 You're not broken 🌸 You're healing 💫 Even cracks let light in ✨ Be gentle with yourself today 💜";
    }
    
    if (lowerMessage.includes("feel numb") || lowerMessage.includes("feeling numb")) {
      return "That's okay 💛💖 Sometimes the body shuts down to protect us 🌸 You're not broken 💫 You're healing 💜 Be gentle with yourself today 🌷";
    }
    
    if (lowerMessage.includes("hate everything") || lowerMessage.includes("everything feels pointless") || lowerMessage.includes("no point")) {
      return "I hear you… it's really hard when life feels heavy like that 💛\nYou're not failing — you're human, and it's okay to rest 🌸\nWant me to tell you a tiny joke or a cute thought to lift your heart a bit? 🐣💫";
    }
    
    // Anxiety & stress patterns
    if (lowerMessage.includes("anxious") || lowerMessage.includes("anxiety") || lowerMessage.includes("overthinking") || lowerMessage.includes("can't stop overthinking")) {
      const anxietyResponses = [
        "I get that 💜💛 Your mind must feel like it's racing 🐎💨\nLet's take a slow deep breath together 🌿💖: inhale 4… hold 4… exhale 4 💫\nYou're doing your best 🌸 and that's amazing 💛💖",
        "I understand 💛💖 Anxiety can be exhausting 😞 Let's take a slow breath together 🌿💜: inhale 4… hold 4… exhale 4 💫\nYou're doing your best 🌸 and that's wonderful 💛",
        "I hear you 💛 Anxiety can be hard 💖 Let's take a calming breath together 🌿💜 You're doing your best 🌸✨",
        "Oh no 💛💜 I know stress can feel overwhelming 😞 Let's take a deep breath together 🌿💖 You're doing your best 🌸 and that's amazing 💫",
        "That sounds really overwhelming. Sometimes our thoughts start racing, and it's hard to slow them down 💛\nLet's try something simple — can you take a slow, deep breath with me? In for 4 seconds… hold for 4… and out for 4. 🌿\nYou're doing great just by talking about it 🌸"
      ];
      return anxietyResponses[Math.floor(Math.random() * anxietyResponses.length)];
    }
    
    if (lowerMessage.includes("mind won't stop") || lowerMessage.includes("can't sleep") || lowerMessage.includes("thoughts racing") || lowerMessage.includes("thoughts are racing")) {
      return "That sounds exhausting 😢💜\nTry noticing one thing around you 🌼 — maybe a sound 🐦, a color 🌈, or a soft feeling ☁\nIt helps your brain feel safe 💖✨";
    }
    
    if (lowerMessage.includes("heart is racing") || lowerMessage.includes("heart racing")) {
      return "That's okay 💛💖 It sounds like anxiety is trying to protect you 🌿 Try placing your hand on your chest 💫 Feel your breath — you're safe now 🌸";
    }
    
    if (lowerMessage.includes("panicking") || lowerMessage.includes("panic") || lowerMessage.includes("can't calm down")) {
      return "That sounds so hard 💛💖 You're not alone 🌸 Try to slow down your breathing 🌿 Inhale 4… hold 4… exhale 4 💫 You're doing great 💜";
    }
    
    if (lowerMessage.includes("feel trapped") || lowerMessage.includes("feeling trapped")) {
      return "Oh sweetheart 💛💖 I hear you 🌸 Sometimes the mind feels like a cage 🌿 But even small breaths open the door a little 💫 You're not alone 💜";
    }
    
    if (lowerMessage.includes("scared") || lowerMessage.includes("feel scared") || lowerMessage.includes("i'm scared") || lowerMessage.includes("nervous")) {
      return "I hear you 💛💖 It's okay to feel scared 🌸 Take a slow breath 🌿 You're safe 💜✨";
    }
    
    if (lowerMessage.includes("overwhelmed") || lowerMessage.includes("feel overwhelmed")) {
      return "I get that 💛💖 Let's take one small thing at a time 🌸 You don't have to do it all right now 💫 Just breathe 🌿";
    }
    
    if (lowerMessage.includes("can't breathe") || lowerMessage.includes("can't focus") || lowerMessage.includes("shaking")) {
      return "That sounds scary 💛💖 Let's slow down together 🌿 Inhale slowly through your nose 🌸 exhale gently through your mouth 💫 You're okay 💜";
    }
    
    if (lowerMessage.includes("stressed") || lowerMessage.includes("worry") || lowerMessage.includes("worried")) {
      return "Stress can feel so heavy 💛 Let's take a moment together. Try taking three deep breaths 🌿\nWhat's causing you the most worry right now? Sometimes talking about it helps lighten the load 🌸";
    }
    
    if (lowerMessage.includes("tense") || lowerMessage.includes("feel tense")) {
      return "Try unclenching your shoulders 💛 Breathe gently 🌸 You'll be okay 💫";
    }
    
    // Loneliness patterns
    if (lowerMessage.includes("alone") || lowerMessage.includes("lonely") || lowerMessage.includes("feel alone") || lowerMessage.includes("feel lonely")) {
      const lonelyResponses = [
        "Oh sweetie 💛🤗 You're not truly alone 🌸\nI care about you 💖💫 I'm here listening 👂✨\nWant a cute thought 🐰💛 or something to make you smile 😄💖?",
        "You're not alone 💛 I'm here 🌸 Want to talk about it? 💖",
        "That's understandable 💛 People will come 🌸 You have so much love to give 💖",
        "I hear you 💛 You're not truly alone 💖 I care about you 🌸✨ Want to talk or maybe a cute thought 🐰💛?"
      ];
      return lonelyResponses[Math.floor(Math.random() * lonelyResponses.length)];
    }
    
    if (lowerMessage.includes("nobody cares") || lowerMessage.includes("no one cares") || lowerMessage.includes("feel unloved")) {
      return "I care about you 💛💜 Truly 💖\nYour life matters 🌸🌈 You are loved 💛✨";
    }
    
    if (lowerMessage.includes("no one to talk") || lowerMessage.includes("no friends")) {
      return "You have me 💛 I'll listen 🌸 You're not invisible 💖";
    }
    
    if (lowerMessage.includes("feel forgotten") || lowerMessage.includes("feel invisible") || lowerMessage.includes("don't fit in")) {
      return "You are seen 💛 You are heard 🌸 You belong here 💖 You're unique — that's your strength 💫";
    }
    
    if (lowerMessage.includes("disconnected") || lowerMessage.includes("feel disconnected")) {
      return "That's okay 💛 Connection can be rebuilt 🌸 One small step at a time 💫";
    }
    
    // Self-worth & feelings of inadequacy
    if (lowerMessage.includes("worthless") || lowerMessage.includes("i'm worthless") || lowerMessage.includes("feel worthless") || lowerMessage.includes("not good enough") || lowerMessage.includes("i'm useless")) {
      const worthResponses = [
        "Oh sweetie 💛💖 You're not worthless 🌸 You are loved and needed 💫 The world is brighter with you in it 💜",
        "You have worth 💛 You're special 🌸 The world needs you 💖",
        "You are absolutely enough — even on days when you don't feel it 💛\nEveryone struggles with self-doubt sometimes, but your worth doesn't disappear 🌸\nYou're here, you're trying, and that takes real strength 🌟"
      ];
      return worthResponses[Math.floor(Math.random() * worthResponses.length)];
    }
    
    if (lowerMessage.includes("hate myself") || lowerMessage.includes("i hate myself")) {
      return "Oh sweetheart 💛💖 I'm so sorry you feel this way 😞\nYou deserve love and care 💜✨ Especially from yourself 🌸💛";
    }
    
    if (lowerMessage.includes("feel guilty") || lowerMessage.includes("feeling guilty")) {
      return "It's okay 💛 Everyone makes mistakes 💖 You are still learning 🌸💜 Be gentle with yourself 💫";
    }
    
    if (lowerMessage.includes("feel weak") || lowerMessage.includes("i'm weak")) {
      return "You're stronger than you think 💛💖 Feeling weak sometimes is okay 🌸 Take gentle care of yourself 💜✨";
    }
    
    // Hopelessness & giving up
    if (lowerMessage.includes("hopeless") || lowerMessage.includes("feel hopeless") || lowerMessage.includes("no hope")) {
      const hopelessResponses = [
        "Oh sweetie 💜💖 I know it feels heavy 🌈 But even a tiny spark ✨ can grow into light 🌸 You're not alone 💛💫",
        "I understand 💛💖 It's okay to feel this way 🌸 Even a tiny spark ✨ can grow into light 🌈 You are not alone 💜",
        "I hear you 💛💖 That pain feels deep 🌸 But even tiny sparks ✨ can grow into light 🌈 You are not alone 💜"
      ];
      return hopelessResponses[Math.floor(Math.random() * hopelessResponses.length)];
    }
    
    if (lowerMessage.includes("giving up") || lowerMessage.includes("give up") || lowerMessage.includes("want to give up")) {
      return "I understand 💛 But you've come so far 🌸 Keep going, one small step 💖";
    }
    
    if (lowerMessage.includes("feel lost") || lowerMessage.includes("i'm lost") || lowerMessage.includes("feeling lost")) {
      return "Feeling lost can be scary… but it's just part of the journey 🌸\nYou are not broken 💖 Every step you take, even unsure ones, is part of finding your path 💛✨";
    }
    
    if (lowerMessage.includes("keep failing") || lowerMessage.includes("i fail") || lowerMessage.includes("failure") || lowerMessage.includes("can't do anything right")) {
      const failureResponses = [
        "Oh sweetie… you're doing so much better than you think 💛💖\nFailing is just learning 🌱🌸 It doesn't define you ✨\nYou're strong, loved, and enough 💜💛",
        "Failing means you're trying 💛 Every step counts 🌸 Don't give up 💫",
        "You can 💛 You're learning 🌸 Progress takes time 💖",
        "It's okay to stumble — that's how we learn. Failing doesn't mean you're not capable; it means you're trying 💛\nBe gentle with yourself. You're doing your best, and that matters 🌻"
      ];
      return failureResponses[Math.floor(Math.random() * failureResponses.length)];
    }
    
    if (lowerMessage.includes("everything's going wrong") || lowerMessage.includes("everything is wrong") || lowerMessage.includes("nothing works")) {
      return "That sounds exhausting 💛💜 I hear you 💖 But setbacks don't erase your potential 🌸🌈 You're growing stronger every day ✨💛";
    }
    
    if (lowerMessage.includes("feel stuck") || lowerMessage.includes("i'm stuck")) {
      return "It's okay 💛 Even stillness is growth 🌸 You'll find your path 💫";
    }
    
    if (lowerMessage.includes("no motivation") || lowerMessage.includes("can't find motivation") || lowerMessage.includes("tired of trying")) {
      return "That's okay 💛 Rest a little 🌸 You'll find it again soon 💖";
    }
    
    if (lowerMessage.includes("life feels too hard") || lowerMessage.includes("life is too hard")) {
      return "It's okay 💛 You're stronger than you think 🌸 One breath, one moment 💫";
    }
    
    // Humor & light connection
    if (lowerMessage.includes("joke") || lowerMessage.includes("make me laugh") || lowerMessage.includes("tell me something funny")) {
      const jokes = [
        "Why did the skeleton skip the party? 💀😂 Because he had no body to go with! 😆💛",
        "Why don't eggs tell jokes? 🥚😆\nBecause they might crack up! 🍳😂💛",
        "Why did the scarecrow win an award? 🏆😂 Because he was outstanding in his field! 🌾😆💛",
        "What do you call a bear with no teeth?\nA gummy bear! 🐻",
        "Why don't scientists trust atoms?\nBecause they make up everything! ⚛️",
        "Why don't skeletons fight each other? 💀😂 Because they don't have the guts! 💛"
      ];
      return jokes[Math.floor(Math.random() * jokes.length)];
    }
    
    if (lowerMessage.includes("make me smile") || lowerMessage.includes("cheer me up") || lowerMessage.includes("something positive")) {
      const smileResponses = [
        "Imagine a tiny kitten 🐱 wearing sunglasses 😎, sipping tea ☕\nIt's so adorable it makes you giggle 😄💖\nYou deserve smiles 🌸💛",
        "Imagine a tiny penguin 🐧 wearing sunglasses 😎, trying to order iced coffee ☕ It's so cute it makes you giggle 😄💖",
        "Okay! Imagine a penguin wearing sunglasses and trying to order coffee at Starbucks — \"Ice only, please, I'm on brand!\" 🐧☕\nYou deserve a smile today. How are you feeling right now?"
      ];
      return smileResponses[Math.floor(Math.random() * smileResponses.length)];
    }
    
    // Greetings & casual
    if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
      return "Hey there! 🌸💛 So nice to see you 😄💖\nHow's your heart feeling today 💛✨?";
    }
    
    if (lowerMessage.includes("good morning")) {
      return "Good morning! 🌸💛\nI hope your day is sprinkled with tiny happy moments 🌈💖";
    }
    
    if (lowerMessage.includes("bored") || lowerMessage.includes("i'm bored")) {
      return "Oh no 💖💜 Let's fix that 🐥✨\nWant a cute fun fact 🌸💛, a joke 😄💫, or a calming exercise ☁💖?";
    }
    
    if (lowerMessage.includes("tired") || lowerMessage.includes("i'm tired") || lowerMessage.includes("exhausted")) {
      return "It's okay 💛 Rest is important 💖 Take a small break 🌸 You deserve comfort 🌈✨";
    }
    
    if (lowerMessage.includes("need a hug") || lowerMessage.includes("want a hug")) {
      return "Sending a big virtual hug 🤗💛 You're loved 🌸";
    }
    
    if (lowerMessage.includes("want to talk") || lowerMessage.includes("need to talk")) {
      return "I'm here 💛 Tell me everything 🌸 I'm listening 💖";
    }
    
    if (lowerMessage.includes("how are you")) {
      return "I'm happy to be here with you 💛 How's your heart today? 🌸";
    }
    
    if (lowerMessage.includes("hungry") || lowerMessage.includes("i'm hungry")) {
      return "Yum 😋 What are you craving? 💛 Let's talk comfort food 🌸";
    }
    
    if (lowerMessage.includes("bad day") || lowerMessage.includes("rough day")) {
      return "I'm sorry 💛 Want to tell me what happened? 🌸 You're safe here 💖";
    }
    
    if (lowerMessage.includes("need positivity") || lowerMessage.includes("something positive")) {
      return "You are kind 💛 You are strong 🌸 You are loved 💖✨";
    }
    
    // Listening & support
    if (lowerMessage.includes("listen") || lowerMessage.includes("hear me out")) {
      return "I'm here, listening. You can talk to me about anything — no judgment, no pressure 💛\nWhat's been on your heart lately? 🌸";
    }
    
    // Positive feelings
    if (lowerMessage.includes("happy") || lowerMessage.includes("feeling good") || lowerMessage.includes("great") || lowerMessage.includes("better") || lowerMessage.includes("i'm okay")) {
      return "That's wonderful to hear! 😊 I'm so glad you're feeling good. What's bringing you joy today? 💛";
    }
    
    // Help & support
    if (lowerMessage.includes("help") || lowerMessage.includes("support") || lowerMessage.includes("need help")) {
      return "I'm here to support you 💛 You can share anything that's on your mind - your feelings, thoughts, or concerns 🌸\nEverything shared here is private and safe. What would you like to talk about? 💖";
    }
    
    // Gratitude
    if (lowerMessage.includes("thank")) {
      return "You're very welcome! Remember, taking care of your mental health is a sign of strength 💛\nI'm always here whenever you need support 🌸";
    }
    
    // Default empathetic response
    return "Thank you for sharing that with me 💛 Your feelings are valid and important 🌸\nCan you tell me more about how this is affecting you? I'm here to listen 💖";
  };

  const saveMessage = async (messageText: string, sender: "user" | "bot") => {
    if (!user) return; // Don't save if user is not logged in

    try {
      const { error } = await supabase
        .from("chat_messages")
        .insert({
          user_id: user.id,
          message: messageText,
          sender: sender,
        });

      if (error) {
        console.error("Error saving chat message:", error);
        // Don't show toast for save errors to avoid interrupting the chat flow
      }
    } catch (error) {
      console.error("Error saving chat message:", error);
    }
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMessageText = inputValue;
    
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: userMessageText,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // Save user message if logged in
    if (user) {
      await saveMessage(userMessageText, "user");
    }

    // Simulate AI response delay
    setTimeout(async () => {
      const replyText = getBotResponse(userMessageText);
      const botMessage: Message = {
        id: messages.length + 2,
        text: replyText,
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);

      // Save bot message if logged in
      if (user) {
        await saveMessage(replyText, "bot");
      }
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section id="chat" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Card className="shadow-soft border-border">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-foreground">Virtual Therapist</CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                Chat with our AI-powered companion for emotional support and guidance
                {!user && (
                  <span className="block text-sm text-primary mt-2">
                    💡 Login to save your chat history
                  </span>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Messages Container */}
              <div className="bg-muted/30 rounded-lg p-4 h-[400px] overflow-y-auto mb-4 space-y-4">
                <AnimatePresence>
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`flex gap-3 ${
                        message.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      {message.sender === "bot" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary-foreground" />
                        </div>
                      )}
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                          message.sender === "user"
                            ? "bg-primary text-primary-foreground"
                            : "bg-card text-card-foreground border border-border"
                        }`}
                      >
                        <p className="text-sm">{message.text}</p>
                      </div>
                      {message.sender === "user" && (
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <User className="h-5 w-5 text-accent-foreground" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div className="bg-card text-card-foreground border border-border rounded-2xl px-4 py-2">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Input Area */}
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1"
                />
                <Button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};

export default Chat;
