import { useState, useEffect } from "react";
import { Inbox, Check, X, Calendar, Clock, Users, MapPin, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Booking {
  id: string;
  status: string;
  message: string | null;
  created_at: string;
  stadiums: {
    name: string;
  };
  time_slots: {
    date: string;
    start_time: string;
    end_time: string;
  };
  teams: {
    name: string;
  } | null;
}

const BookingRequests = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "accepted" | "rejected">("all");

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    try {
      // First get owner's stadiums
      const { data: stadiums } = await supabase
        .from("stadiums")
        .select("id")
        .eq("owner_id", user?.id);

      if (!stadiums || stadiums.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const stadiumIds = stadiums.map((s) => s.id);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          stadiums (name),
          time_slots (date, start_time, end_time),
          teams (name)
        `)
        .in("stadium_id", stadiumIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (bookingId: string, status: "accepted" | "rejected") => {
    try {
      const { error } = await supabase
        .from("bookings")
        .update({ status })
        .eq("id", bookingId);

      if (error) throw error;

      // If accepted, update the time slot status
      if (status === "accepted") {
        const booking = bookings.find((b) => b.id === bookingId);
        // Update time slot to booked - this would need the time_slot_id
      }

      toast({
        title: status === "accepted" ? "Booking Accepted!" : "Booking Rejected",
        description: `The booking request has been ${status}.`,
      });
      fetchBookings();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const filteredBookings = bookings.filter((booking) =>
    filter === "all" ? true : booking.status === filter
  );

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
        <h2 className="text-2xl font-display">Booking Requests</h2>
        <div className="flex gap-2">
          {(["all", "pending", "accepted", "rejected"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
              className={filter === f ? "bg-primary" : ""}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === "pending" && (
                <span className="ml-2 bg-yellow-400/20 text-yellow-400 px-1.5 rounded-full text-xs">
                  {bookings.filter((b) => b.status === "pending").length}
                </span>
              )}
            </Button>
          ))}
        </div>
      </div>

      {filteredBookings.length > 0 ? (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-card/50 rounded-xl p-6 border border-white/10"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-4">
                  {/* Stadium Icon */}
                  <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <MapPin size={28} className="text-primary" />
                  </div>

                  {/* Booking Info */}
                  <div>
                    <h3 className="font-semibold text-lg">{booking.stadiums?.name}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        {booking.time_slots?.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} />
                        {booking.time_slots?.start_time} - {booking.time_slots?.end_time}
                      </span>
                      {booking.teams && (
                        <span className="flex items-center gap-1">
                          <Users size={14} />
                          {booking.teams.name}
                        </span>
                      )}
                    </div>
                    {booking.message && (
                      <p className="text-sm text-muted-foreground mt-2 italic">
                        "{booking.message}"
                      </p>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>

                  {booking.status === "pending" && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleUpdateStatus(booking.id, "accepted")}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check size={16} className="mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(booking.id, "rejected")}
                        className="text-red-400 hover:bg-red-500/10"
                      >
                        <X size={16} className="mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}

                  {booking.teams && (
                    <Button size="sm" variant="ghost">
                      <Eye size={16} className="mr-1" />
                      View Lineup
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <Inbox size={64} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">No Booking Requests</h3>
          <p className="text-muted-foreground">
            {filter === "all"
              ? "You haven't received any booking requests yet"
              : `No ${filter} requests found`}
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;