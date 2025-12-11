import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  TrendingUp, 
  Play,
  BarChart3,
  Waves
} from 'lucide-react';
import { motion } from 'framer-motion';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { ThemeToggle } from '@/components/ThemeToggle';

interface Session {
  id: string;
  started_at: string;
  ended_at: string | null;
  duration_seconds: number | null;
  preset_id: string | null;
  presets?: {
    name: string;
    intent: string;
    beat_hz_start: number;
  } | null;
}

interface DailyStats {
  date: string;
  minutes: number;
  sessions: number;
}

export default function SessionHistory() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [totalStats, setTotalStats] = useState({
    totalMinutes: 0,
    totalSessions: 0,
    avgSessionLength: 0,
    currentStreak: 0,
  });

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchSessions();
  }, [user, navigate]);

  const fetchSessions = async () => {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select(`
          id,
          started_at,
          ended_at,
          duration_seconds,
          preset_id,
          presets (
            name,
            intent,
            beat_hz_start
          )
        `)
        .eq('user_id', user!.id)
        .order('started_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setSessions(data || []);
      calculateStats(data || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (sessionData: Session[]) => {
    // Calculate total stats
    const totalMinutes = sessionData.reduce((acc, s) => acc + (s.duration_seconds || 0), 0) / 60;
    const totalSessions = sessionData.length;
    const avgSessionLength = totalSessions > 0 ? totalMinutes / totalSessions : 0;

    // Calculate streak
    const today = new Date();
    let streak = 0;
    const sessionDates = new Set(
      sessionData.map(s => new Date(s.started_at).toDateString())
    );
    
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      if (sessionDates.has(checkDate.toDateString())) {
        streak++;
      } else if (i > 0) {
        break;
      }
    }

    setTotalStats({
      totalMinutes: Math.round(totalMinutes),
      totalSessions,
      avgSessionLength: Math.round(avgSessionLength),
      currentStreak: streak,
    });

    // Calculate daily stats for chart (last 14 days)
    const dailyMap = new Map<string, { minutes: number; sessions: number }>();
    const last14Days = [];
    
    for (let i = 13; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyMap.set(dateStr, { minutes: 0, sessions: 0 });
      last14Days.push(dateStr);
    }

    sessionData.forEach(session => {
      const dateStr = new Date(session.started_at).toISOString().split('T')[0];
      if (dailyMap.has(dateStr)) {
        const current = dailyMap.get(dateStr)!;
        current.minutes += (session.duration_seconds || 0) / 60;
        current.sessions += 1;
      }
    });

    setDailyStats(
      last14Days.map(date => ({
        date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        minutes: Math.round(dailyMap.get(date)?.minutes || 0),
        sessions: dailyMap.get(date)?.sessions || 0,
      }))
    );
  };

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return '0m';
    const mins = Math.floor(seconds / 60);
    return mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins}m`;
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-primary shadow-soft">
                <BarChart3 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h1 className="text-base sm:text-xl font-semibold tracking-tight">Session History</h1>
            </div>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-28 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
              {[
                { icon: Clock, label: 'Total Time', value: `${totalStats.totalMinutes}m`, color: 'primary' },
                { icon: Play, label: 'Sessions', value: totalStats.totalSessions, color: 'accent' },
                { icon: TrendingUp, label: 'Avg Length', value: `${totalStats.avgSessionLength}m`, color: 'primary' },
                { icon: Calendar, label: 'Day Streak', value: totalStats.currentStreak, color: 'accent' },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 sm:p-5 border-border bg-card hover:shadow-float transition-shadow">
                    <div className="flex items-start justify-between mb-2">
                      <div className={`p-2 rounded-lg bg-${stat.color}/10`}>
                        <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${stat.color}`} />
                      </div>
                    </div>
                    <div className="text-2xl sm:text-3xl font-bold text-foreground">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="p-4 sm:p-6 border-border bg-card">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Daily Listening Time</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyStats}>
                        <defs>
                          <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                          }} 
                        />
                        <Area 
                          type="monotone" 
                          dataKey="minutes" 
                          stroke="hsl(var(--primary))" 
                          fill="url(#colorMinutes)" 
                          strokeWidth={2}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-4 sm:p-6 border-border bg-card">
                  <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Sessions Per Day</h3>
                  <div className="h-48 sm:h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyStats}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'hsl(var(--card))', 
                            border: '1px solid hsl(var(--border))',
                            borderRadius: '8px',
                            color: 'hsl(var(--foreground))'
                          }} 
                        />
                        <Bar 
                          dataKey="sessions" 
                          fill="hsl(var(--accent))" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Session List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Card className="p-4 sm:p-6 border-border bg-card">
                <h3 className="text-base sm:text-lg font-semibold mb-4 text-foreground">Recent Sessions</h3>
                {sessions.length === 0 ? (
                  <div className="text-center py-12">
                    <Waves className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">No sessions yet</p>
                    <Button onClick={() => navigate('/')} className="bg-gradient-primary text-white">
                      Start Your First Session
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.slice(0, 20).map((session, index) => (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * index }}
                        className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-secondary/50 border border-border hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <Waves className="w-4 h-4 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm sm:text-base text-foreground">
                              {session.presets?.name || 'Custom Session'}
                            </p>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              {formatDate(session.started_at)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sm sm:text-base text-foreground">
                            {formatDuration(session.duration_seconds)}
                          </p>
                          {session.presets && (
                            <p className="text-xs text-muted-foreground">
                              {session.presets.beat_hz_start} Hz • {session.presets.intent}
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </Card>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
