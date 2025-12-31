import { useState, useEffect } from "react";
import { Calendar, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Booking {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  stadiums: {
    name: string;
    location: string;
  };
  time_slots: {
    date: string;
    start_time: string;
    end_time: string;
  };
}

const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          stadiums (name, location),
          time_slots (date, start_time, end_time)
        `)
        .eq("player_id", user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "text-green-400 bg-green-400/10";
      case "rejected":
        return "text-red-400 bg-red-400/10";
      case "pending":
        return "text-yellow-400 bg-yellow-400/10";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">My Bookings</h2>
        <div className="flex gap-2">
          <span className="px-3 py-1 rounded-full text-xs bg-yellow-400/10 text-yellow-400">
            Pending: {bookings.filter((b) => b.status === "pending").length}
          </span>
          <span className="px-3 py-1 rounded-full text-xs bg-green-400/10 text-green-400">
            Accepted: {bookings.filter((b) => b.status === "accepted").length}
          </span>
        </div>
      </div>

      {bookings.length > 0 ? (
        <div className="grid gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card/50 rounded-xl p-6 border border-white/10 flex items-center gap-6"
            >
              {/* Stadium Icon */}
              <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MapPin size={28} className="text-primary" />
              </div>

              {/* Booking Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{booking.stadiums?.name || "Unknown Stadium"}</h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {booking.stadiums?.location || "Unknown Location"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={14} />
                    {booking.time_slots?.date || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {booking.time_slots?.start_time} - {booking.time_slots?.end_time}
                  </span>
                </div>
              </div>

              {/* Status Badge */}
              <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(booking.status)}`}>
                {getStatusIcon(booking.status)}
                <span className="text-sm font-medium capitalize">{booking.status}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Calendar size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Bookings Yet</h3>
          <p className="text-muted-foreground">
            Find a stadium and book your first match!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyBookings;