import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CalendarDays, MapPin, Bell, Link } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const defaultEvent = {
  title: "",
  description: "",
  start_date: "",
  end_date: "",
  all_day: false,
  category: "event",
  color: "#3B82F6",
  location: "",
  reminder_minutes: 30,
};

const AddEventModal = ({ isOpen, onClose, onCreate }) => {
  const [event, setEvent] = useState(defaultEvent);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setEvent(defaultEvent);
    }
  }, [isOpen]);

  const handleChange = (key, value) => {
    setEvent((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!event.title || !event.start_date) return;

    try {
      setLoading(true);

      await onCreate({
        ...event,
        start_date: new Date(event.start_date).toISOString(),
        end_date: event.end_date
          ? new Date(event.end_date).toISOString()
          : null,
      });

      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
          >
            <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-xl shadow-xl">
              {/* Header */}
              <div className="flex items-center justify-between p-5 border-b border-gray-800">
                <h3 className="text-lg font-semibold text-white">
                  Create Event
                </h3>
                <Button size="icon" variant="ghost" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-5 space-y-4">
                {/* Title */}
                <div className="space-y-1">
                  <Label>Title *</Label>
                  <Input
                    placeholder="Sprint Planning"
                    value={event.title}
                    onChange={(e) =>
                      handleChange("title", e.target.value)
                    }
                    required
                  />
                </div>

                {/* Description */}
                <div className="space-y-1">
                  <Label>Description</Label>
                  <Textarea
                    placeholder="Discuss roadmap and priorities"
                    value={event.description}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                  />
                </div>

                {/* Dates */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label>Start</Label>
                    <Input
                      type="datetime-local"
                      value={event.start_date}
                      onChange={(e) =>
                        handleChange("start_date", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <Label>End</Label>
                    <Input
                      type="datetime-local"
                      value={event.end_date}
                      onChange={(e) =>
                        handleChange("end_date", e.target.value)
                      }
                    />
                  </div>
                </div>

                {/* All day */}
                <div className="flex items-center justify-between">
                  <Label className="inline-flex items-center gap-2 leading-none">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    <span>All day</span>
                  </Label>
                  <Switch
                    checked={event.all_day}
                    onCheckedChange={(v) =>
                      handleChange("all_day", v)
                    }
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <Label>Category</Label>
                  <Select
                    value={event.category}
                    onValueChange={(v) =>
                      handleChange("category", v)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="event">Event</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                      <SelectItem value="deadline">Deadline</SelectItem>
                      <SelectItem value="reminder">Reminder</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label className="inline-flex items-center gap-2 leading-none">
                    <MapPin className="w-4 h-4 shrink-0" />
                    <span>Location</span>
                  </Label>
                  <Input
                    placeholder="Google Meet / Office"
                    value={event.location}
                    onChange={(e) =>
                      handleChange("location", e.target.value)
                    }
                  />
                </div>

                {/* Link */}
                <div className="space-y-1">
                  <Label className="inline-flex items-center gap-2 leading-none">
                    <Link className="w-4 h-4 shrink-0" />
                    <span>Link</span>
                  </Label>
                  <Input
                    placeholder="https://meet.google.com/abc-defg-hij"
                    value={event.link}
                    onChange={(e) =>
                      handleChange("link", e.target.value)
                    }
                  />
                </div>

                {/* Reminder */}
                <div className="space-y-1">
                  <Label className="inline-flex items-center gap-2 leading-none">
                    <Bell className="w-4 h-4 shrink-0" />
                    <span>Reminder (minutes before)</span>
                  </Label>
                  <Input
                    type="number"
                    min={0}
                    value={event.reminder_minutes}
                    onChange={(e) =>
                      handleChange(
                        "reminder_minutes",
                        Number(e.target.value)
                      )
                    }
                  />
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-2 pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddEventModal;
