import { useState, useEffect } from "react";
import { Calendar, Clock, Lock, Unlock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface Stadium {
  id: string;
  name: string;
}

interface TimeSlot {
  id: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

const TimelineManagement = () => {
  const { user } = useAuth();
  const [stadiums, setStadiums] = useState<Stadium[]>([]);
  const [selectedStadium, setSelectedStadium] = useState<string>("");
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);

  // Generate time slots for a day
  const generateDefaultSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 22; hour++) {
      slots.push({
        start: `${hour.toString().padStart(2, "0")}:00`,
        end: `${(hour + 1).toString().padStart(2, "0")}:00`,
      });
    }
    return slots;
  };

  const defaultSlots = generateDefaultSlots();

  useEffect(() => {
    if (user) fetchStadiums();
  }, [user]);

  useEffect(() => {
    if (selectedStadium) fetchTimeSlots();
  }, [selectedStadium, selectedDate]);

  const fetchStadiums = async () => {
    try {
      const { data, error } = await supabase
        .from("stadiums")
        .select("id, name")
        .eq("owner_id", user?.id);

      if (error) throw error;
      setStadiums(data || []);
      if (data && data.length > 0) {
        setSelectedStadium(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching stadiums:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTimeSlots = async () => {
    try {
      const { data, error } = await supabase
        .from("time_slots")
        .select("*")
        .eq("stadium_id", selectedStadium)
        .eq("date", selectedDate);

      if (error) throw error;
      setTimeSlots(data || []);
    } catch (error) {
      console.error("Error fetching time slots:", error);
    }
  };

  const getSlotStatus = (startTime: string) => {
    const slot = timeSlots.find((s) => s.start_time === startTime + ":00");
    return slot?.status || "available";
  };

  const toggleSlotStatus = async (startTime: string, endTime: string) => {
    const existingSlot = timeSlots.find((s) => s.start_time === startTime + ":00");

    try {
      if (existingSlot) {
        const newStatus = existingSlot.status === "available" ? "locked" : "available";
        const { error } = await supabase
          .from("time_slots")
          .update({ status: newStatus })
          .eq("id", existingSlot.id);

        if (error) throw error;
      } else {
        const { error } = await supabase.from("time_slots").insert({
          stadium_id: selectedStadium,
          date: selectedDate,
          start_time: startTime + ":00",
          end_time: endTime + ":00",
          status: "available",
        });

        if (error) throw error;
      }

      fetchTimeSlots();
      toast({ title: "Slot Updated", description: "Time slot status has been updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-primary/20 border-primary/50 hover:bg-primary/30";
      case "booked":
        return "bg-yellow-500/20 border-yellow-500/50";
      case "locked":
        return "bg-muted border-white/10";
      default:
        return "bg-white/5 border-white/10 hover:bg-white/10";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "available":
        return <Check size={16} className="text-primary" />;
      case "booked":
        return <Clock size={16} className="text-yellow-400" />;
      case "locked":
        return <Lock size={16} className="text-muted-foreground" />;
      default:
        return <Unlock size={16} className="text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (stadiums.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">No Stadiums Found</h3>
        <p className="text-muted-foreground">
          Add a stadium first to manage its availability
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display">Timeline Management</h2>
        <div className="flex gap-4">
          <Select value={selectedStadium} onValueChange={setSelectedStadium}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select stadium" />
            </SelectTrigger>
            <SelectContent>
              {stadiums.map((stadium) => (
                <SelectItem key={stadium.id} value={stadium.id}>
                  {stadium.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 rounded-lg bg-muted border border-white/10"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-primary/20 border border-primary/50" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-yellow-500/20 border border-yellow-500/50" />
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-muted border border-white/10" />
          <span>Locked</span>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="bg-card/50 rounded-xl p-6 border border-white/10">
        <div className="grid grid-cols-5 gap-3">
          {defaultSlots.map((slot) => {
            const status = getSlotStatus(slot.start);
            const isBooked = status === "booked";

            return (
              <button
                key={slot.start}
                onClick={() => !isBooked && toggleSlotStatus(slot.start, slot.end)}
                disabled={isBooked}
                className={`p-4 rounded-xl border transition-all ${getStatusColor(status)} ${
                  isBooked ? "cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{slot.start}</span>
                  {getStatusIcon(status)}
                </div>
                <div className="text-xs text-muted-foreground">
                  {slot.start} - {slot.end}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-sm text-muted-foreground text-center">
        Click on a time slot to toggle its availability. Booked slots cannot be modified.
      </p>
    </div>
  );
};

export default TimelineManagement;