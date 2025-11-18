import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format, subDays } from "date-fns";
import { Loader2, TrendingUp, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import { useToast } from "@/components/ui/use-toast";

/**
 * Insights Section Component
 * Displays real mood trends and analytics from user's test results
 */

type MoodDataPoint = {
  date: string;
  score: number;
  level: string;
};

const Insights = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [moodData, setMoodData] = useState<MoodDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalTests: 0,
    averageScore: 0,
    latestLevel: "N/A",
    trend: "stable" as "improving" | "stable" | "declining",
  });
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchMoodData();
    } else {
      setIsLoading(false);
    }

    // Listen for new mood test results
    const channel = supabase
      .channel('mood_test_results_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'mood_test_results',
          filter: `user_id=eq.${user?.id}`
        },
        () => {
          fetchMoodData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchMoodData = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Fetch mood test results from last 30 days
      const thirtyDaysAgo = subDays(new Date(), 30);
      
      const { data, error } = await supabase
        .from("mood_test_results")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        // Transform data for charts
        const chartData = data.map((result) => ({
          date: format(new Date(result.created_at), "MMM dd"),
          score: result.score,
          level: result.level,
        }));

        setMoodData(chartData);

        // Calculate statistics
        const total = data.length;
        const avgScore = data.reduce((sum, r) => sum + r.score, 0) / total;
        const latest = data[data.length - 1];
        
        // Determine trend
        let trend: "improving" | "stable" | "declining" = "stable";
        if (data.length >= 2) {
          const recent = data.slice(-3).reduce((sum, r) => sum + r.score, 0) / Math.min(3, data.length);
          const older = data.slice(0, Math.max(1, data.length - 3)).reduce((sum, r) => sum + r.score, 0) / Math.max(1, data.length - 3);
          
          if (recent < older - 2) trend = "improving";
          else if (recent > older + 2) trend = "declining";
        }

        setStats({
          totalTests: total,
          averageScore: Math.round(avgScore * 10) / 10,
          latestLevel: latest.level,
          trend,
        });
      }
    } catch (error) {
      console.error("Error fetching mood data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const weeklySummary = [
    { 
      label: "Average Score", 
      value: stats.averageScore.toFixed(1), 
      icon: "📊", 
      color: "text-primary" 
    },
    { 
      label: "Total Assessments", 
      value: stats.totalTests.toString(), 
      icon: "📝", 
      color: "text-accent" 
    },
    { 
      label: "Current Level", 
      value: stats.latestLevel, 
      icon: stats.latestLevel === "low" ? "😊" : stats.latestLevel === "severe" ? "😔" : "😐", 
      color: "text-sentiment-positive" 
    },
    { 
      label: "Trend", 
      value: stats.trend, 
      icon: stats.trend === "improving" ? "📈" : stats.trend === "declining" ? "📉" : "➡️", 
      color: stats.trend === "improving" ? "text-sentiment-positive" : stats.trend === "declining" ? "text-destructive" : "text-muted-foreground"
    },
  ];

  const handleExportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(20);
      doc.text("Emotional Insights Report", 15, 20);
      doc.setFontSize(12);
      doc.text(`Generated: ${new Date().toLocaleString()}`, 15, 30);
      doc.text("", 15, 36);
      doc.setFontSize(16);
      doc.text("Weekly Summary", 15, 45);

      weeklySummary.forEach((item, i) => {
        doc.setFontSize(12);
        doc.text(`${item.label}: ${item.value}`, 20, 55 + i * 8);
      });

      if (moodData.length > 0) {
        doc.setFontSize(16);
        doc.text("Mood Data (last 30 days)", 15, 85);
        doc.setFontSize(10);
        doc.text("Date", 20, 92);
        doc.text("Score", 60, 92);
        doc.text("Level", 90, 92);
        moodData.forEach((d, i) => {
          doc.text(d.date, 20, 100 + i * 7);
          doc.text(String(d.score), 60, 100 + i * 7);
          doc.text(String(d.level), 90, 100 + i * 7);
        });
      }

      doc.save("emotional-insights-report.pdf");
      if (typeof toast !== 'undefined') toast({title: 'Exported!', description: 'PDF report downloaded.'});
    } catch (e) {
      if (typeof toast !== 'undefined') toast({title: 'Export failed', description: 'Could not export report', variant: 'destructive'});
    }
  };

  if (!user) {
    return (
      <section id="insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your Emotional Insights
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Login to track your mood over time and see personalized insights
            </p>
            <Card className="shadow-soft border-border p-8">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground mb-6">
                Start tracking your mental wellbeing journey by creating an account. You'll be able to see your mood trends, progress over time, and get personalized recommendations.
              </p>
              <Button 
                onClick={() => navigate("/auth")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login to View Insights
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section id="insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  if (moodData.length === 0) {
    return (
      <section id="insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Your Emotional Insights
            </h2>
            <Card className="shadow-soft border-border p-8">
              <TrendingUp className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-6">
                Complete your first mental wellbeing assessment to start tracking your mood and see insights.
              </p>
              <Button 
                onClick={() => {
                  const element = document.querySelector("#test");
                  if (element) element.scrollIntoView({ behavior: "smooth" });
                }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Take Assessment
              </Button>
            </Card>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="insights" className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Your Emotional Insights
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Visualize your mental health journey and track your progress over time
          </p>
        </motion.div>

        {/* Weekly Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {weeklySummary.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="text-center shadow-soft hover:shadow-hover transition-shadow">
                <CardContent className="pt-6">
                  <div className={`text-4xl mb-2 ${item.color}`}>{item.icon}</div>
                  <div className="text-3xl font-bold text-foreground mb-1 capitalize">{item.value}</div>
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <Button onClick={handleExportPDF} className="ml-auto mb-4 flex-shrink-0 bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:opacity-90">
          Export Report
        </Button>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Mood Trend Line Chart */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Mood Score Trend</CardTitle>
                <CardDescription>Your emotional patterns over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 30]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      strokeWidth={3}
                      name="Mood Score"
                      dot={{ fill: "hsl(var(--primary))", r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>

          {/* Assessment History Bar Chart */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Assessment History</CardTitle>
                <CardDescription>Scores from each completed assessment</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" domain={[0, 30]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Legend />
                    <Bar
                      dataKey="score"
                      fill="hsl(var(--accent))"
                      name="Assessment Score"
                      radius={[8, 8, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Insights;
