/**
 * MindMend - AI-Powered Mental Health & Wellness Platform
 * Main Index Page Component
 * 
 * This page combines all sections into a single-page application:
 * - Hero section with call-to-action
 * - Features overview
 * - Interactive journal with sentiment analysis
 * - AI therapist chat interface
 * - Emotional insights and visualizations
 * - Support resources
 * - Contact form
 */

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import MoodTest from "@/components/MoodTest";
import Journal from "@/components/Journal";
import Meditations from "@/components/Meditations";
import Activities from "@/components/Activities";
import Chat from "@/components/Chat";
import Insights from "@/components/Insights";
import SelfHelpLibrary from "@/components/SelfHelpLibrary";
import EmergencyDetection from "@/components/EmergencyDetection";
import Support from "@/components/Support";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <MoodTest />
        <Journal />
        <Activities />
        <Meditations />
        <Chat />
        <Insights />
        <SelfHelpLibrary />
        <EmergencyDetection />
        <Support />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
