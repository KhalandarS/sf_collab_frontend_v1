import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Clock, MapPin, Pencil, Trash2, Repeat2, Bell } from "lucide-react";

export default function EventDetailsModal({
  event, open, onClose, isCreator, onEdit, onDelete
}) {
  if (!event) return null;

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: event.color }} />
            {event.title}
          </DialogTitle>
          <span className="text-xs font-semibold px-2 py-1 rounded bg-gray-800 w-fit mt-2">
            {event.category}
          </span>
        </DialogHeader>

        <div className="space-y-4">
          {/* Date & Time */}
          <div className="text-sm text-gray-300 space-y-2">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400" />
              <div>
                <p className="font-semibold">{formatDateTime(event.start_date)}</p>
                {event.end_date && (
                  <p className="text-xs text-gray-400">
                    Until {formatDateTime(event.end_date)} ({event.duration_minutes} min)
                  </p>
                )}
                {event.all_day && <p className="text-xs text-gray-400">All day event</p>}
              </div>
            </div>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="w-4 h-4 text-green-400 mt-0.5" />
              <p className="text-gray-300">{event.location}</p>
            </div>
          )}

          {/* Description */}
          {event.description && (
            <div>
              <p className="text-xs text-gray-400 font-semibold mb-1">Description</p>
              <p className="text-sm text-gray-300 whitespace-pre-wrap bg-gray-800 p-2 rounded">
                {event.description}
              </p>
            </div>
          )}

          {/* Recurring */}
          {event.is_recurring && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Repeat2 className="w-4 h-4 text-purple-400" />
              <span>Recurring event</span>
            </div>
          )}

          {/* Reminder */}
          {event.reminder_minutes > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-300">
              <Bell className="w-4 h-4 text-yellow-400" />
              <span>Reminder {event.reminder_minutes} min before</span>
            </div>
          )}

          {/* Status */}
          {event.is_past && (
            <p className="text-xs text-gray-500 italic">Past event</p>
          )}
          {event.is_ongoing && (
            <p className="text-xs text-green-400 font-semibold">Ongoing</p>
          )}

          {/* Actions */}
          {isCreator && (
            <div className="flex justify-end gap-2 pt-4">
              {/* <Button
                variant="ghost"
                onClick={() => {
                  onClose(false);
                  onEdit(event);
                }}
              >
                <Pencil className="w-4 h-4 mr-1" />
                Edit
              </Button> */}

              <Button
                variant="destructive"
                onClick={() => {
                  onClose(false);
                  onDelete(event.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
