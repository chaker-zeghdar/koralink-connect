import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Calendar, DollarSign, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AnalyticsData {
  totalBookings: number;
  acceptedBookings: number;
  pendingBookings: number;
  estimatedRevenue: number;
  peakHours: string[];
}

const OwnerAnalytics = () => {
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalBookings: 0,
    acceptedBookings: 0,
    pendingBookings: 0,
    estimatedRevenue: 0,
    peakHours: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      // Get owner's stadiums
      const { data: stadiums } = await supabase
        .from("stadiums")
        .select("id, price_per_hour")
        .eq("owner_id", user?.id);

      if (!stadiums || stadiums.length === 0) {
        setLoading(false);
        return;
      }

      const stadiumIds = stadiums.map((s) => s.id);

      // Get bookings
      const { data: bookings } = await supabase
        .from("bookings")
        .select("status, stadium_id")
        .in("stadium_id", stadiumIds);

      const totalBookings = bookings?.length || 0;
      const acceptedBookings = bookings?.filter((b) => b.status === "accepted").length || 0;
      const pendingBookings = bookings?.filter((b) => b.status === "pending").length || 0;

      // Calculate estimated revenue
      const avgPrice = stadiums.reduce((acc, s) => acc + Number(s.price_per_hour), 0) / stadiums.length;
      const estimatedRevenue = acceptedBookings * avgPrice;

      setAnalytics({
        totalBookings,
        acceptedBookings,
        pendingBookings,
        estimatedRevenue,
        peakHours: ["18:00", "19:00", "20:00"],
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    {
      label: "Total Bookings",
      value: analytics.totalBookings,
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
    },
    {
      label: "Accepted",
      value: analytics.acceptedBookings,
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
    },
    {
      label: "Pending",
      value: analytics.pendingBookings,
      icon: Clock,
      color: "text-yellow-400",
      bgColor: "bg-yellow-400/10",
    },
    {
      label: "Est. Revenue",
      value: `${analytics.estimatedRevenue.toLocaleString()} DZD`,
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-display">Analytics</h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-card/50 rounded-xl p-6 border border-white/10"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-display">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Bookings Chart */}
        <div className="bg-card/50 rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold mb-6">Weekly Bookings</h3>
          <div className="h-64 flex items-end justify-between gap-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => {
              const height = Math.random() * 100 + 20;
              return (
                <div key={day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-primary/20 rounded-t-lg transition-all hover:bg-primary/40"
                    style={{ height: `${height}%` }}
                  />
                  <span className="text-xs text-muted-foreground">{day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-card/50 rounded-xl p-6 border border-white/10">
          <h3 className="font-semibold mb-6">Peak Hours</h3>
          <div className="space-y-4">
            {[
              { hour: "18:00 - 19:00", percentage: 95 },
              { hour: "19:00 - 20:00", percentage: 88 },
              { hour: "20:00 - 21:00", percentage: 75 },
              { hour: "17:00 - 18:00", percentage: 60 },
              { hour: "21:00 - 22:00", percentage: 45 },
            ].map((slot) => (
              <div key={slot.hour}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{slot.hour}</span>
                  <span className="text-muted-foreground">{slot.percentage}%</span>
                </div>
                <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-primary-glow rounded-full transition-all"
                    style={{ width: `${slot.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Revenue Estimation */}
      <div className="bg-card/50 rounded-xl p-6 border border-white/10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold">Revenue Insights</h3>
          <span className="text-sm text-muted-foreground">This Month</span>
        </div>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-display text-primary">
              {analytics.estimatedRevenue.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Revenue (DZD)</p>
          </div>
          <div>
            <p className="text-3xl font-display">{analytics.acceptedBookings}</p>
            <p className="text-sm text-muted-foreground mt-1">Completed Bookings</p>
          </div>
          <div>
            <p className="text-3xl font-display">
              {analytics.acceptedBookings > 0
                ? Math.round(analytics.estimatedRevenue / analytics.acceptedBookings).toLocaleString()
                : 0}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Avg. per Booking (DZD)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerAnalytics;