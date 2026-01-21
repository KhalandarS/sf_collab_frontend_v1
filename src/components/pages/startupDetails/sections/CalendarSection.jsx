import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, List, Columns, Clock, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import EventDetailsModal from "../modals/EventDetails";

const toDate = (d) => new Date(d);

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isDateInRange = (date, start, end) => {
  const day = new Date(date.setHours(0, 0, 0, 0));
  const s = new Date(start.setHours(0, 0, 0, 0));
  const e = new Date((end ?? start).setHours(0, 0, 0, 0));
  return day >= s && day <= e;
};

const CalendarSection = ({
  events,
  onCreateEvent,
  onEditEvent,
  onDeleteEvent,
  isCreator
}) => {
  const [view, setView] = useState("agenda");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const openEvent = (event) => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">
            Calendar
          </h2>
          <p className="text-sm text-gray-400">
            Track meetings, deadlines, and milestones.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View switch */}
          <div className="flex rounded-lg bg-gray-800 border border-gray-700 overflow-hidden">
            <Button
              size="sm"
              variant={view === "agenda" ? "default" : "ghost"}
              onClick={() => setView("agenda")}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === "week" ? "default" : "ghost"}
              onClick={() => setView("week")}
            >
              <Columns className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant={view === "month" ? "default" : "ghost"}
              onClick={() => setView("month")}
            >
              <CalendarDays className="w-4 h-4" />
            </Button>
          </div>

          {isCreator && (
            <Button
              size="sm"
              onClick={onCreateEvent}
              className="bg-blue-600 hover:bg-blue-700"
            >
              New Event
            </Button>
          )}
        </div>
      </div>

      {/* Views */}
      {view === "agenda" && (
        <CalendarAgendaView
          events={events}
          isCreator={isCreator}
          onEditEvent={onEditEvent}
          onDeleteEvent={onDeleteEvent}
            onOpenEvent={openEvent}

        />
      )}

      {view === "week" && (
        <CalendarWeekView
          events={events}
          onEditEvent={onEditEvent}
            onOpenEvent={openEvent}

        />
      )}

      {view === "month" && (
        <CalendarMonthView
          events={events}

          onEditEvent={onEditEvent}
            onOpenEvent={openEvent}

        />
      )}
      <EventDetailsModal
  event={selectedEvent}
  open={modalOpen}
  onClose={setModalOpen}
  isCreator={isCreator}
  onEdit={onEditEvent}
  onDelete={onDeleteEvent}
/>

    </div>
  );
};

export default CalendarSection;
const CalendarAgendaView = ({
  events,
  isCreator,
  onEditEvent,
  onDeleteEvent,
  onOpenEvent
}) => {
  return (
    <div className="space-y-3">
      {events.map((event) => (
        <Card
          key={event.id}
          onClick={() => onOpenEvent(event)}
          className="bg-gray-900 border-gray-800 hover:border-blue-500/40 cursor-pointer"
        >

          <CardContent className="p-4 flex gap-4">
            <div
              className="w-1.5 rounded-full"
              style={{ backgroundColor: event.color }}
            />

            <div className="flex-1">
              <h3 className="text-white font-medium">
                {event.title}
              </h3>
              {event.description && (
                <p className="text-sm text-gray-400 mt-1">
                  {event.description}
                </p>
              )}

              <div className="flex items-center gap-2 mt-2 text-sm text-gray-400">
                <Clock className="w-4 h-4" />
                <span>
                  {new Date(event.start_date).toLocaleDateString()}{" "}
                  {event.end_date && (
                    <>
                      → {new Date(event.end_date).toLocaleDateString()}
                    </>
                  )}
                </span>
              </div>

            </div>

            {isCreator && (
              <div className="flex gap-1">
                {/* <Button
  size="icon"
  variant="ghost"
  onClick={(e) => {
    e.stopPropagation();
    onEditEvent(event);
  }}
>

                  <Pencil className="w-4 h-4" />
                </Button> */}
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => onDeleteEvent(event.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const CalendarWeekView = ({ events, onOpenEvent }) => {
  const startOfWeek = (() => {
    const d = new Date();
    const day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  })();

  return (
    <div className="grid grid-cols-7 gap-2">
      {days.map((label, index) => {
        const date = new Date(startOfWeek);
        date.setDate(startOfWeek.getDate() + index);

        const dayEvents = events.filter((e) =>
          isDateInRange(
            new Date(date),
            toDate(e.start_date),
            e.end_date ? toDate(e.end_date) : null
          )
        );

        return (
          <div
            key={label}
            className="bg-gray-900 border border-gray-800 rounded-lg p-2"
          >
            <div className="text-sm font-semibold text-gray-300 mb-2">
              {label}
            </div>

            <div className="space-y-1">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onOpenEvent(event)}
                  className="text-xs text-white rounded px-2 py-1 cursor-pointer"
                  style={{
                    backgroundColor: event.color + "33",
                    borderLeft: `3px solid ${event.color}`
                  }}
                >
                  {event.title}
                </div>

              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};


const daysInMonth = (year, month) =>
  new Date(year, month + 1, 0).getDate();

const CalendarMonthView = ({ events, onOpenEvent }) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const days = daysInMonth(year, month);

  return (
    <div className="grid grid-cols-7 gap-2">
      {[...Array(days)].map((_, i) => {
        const date = new Date(year, month, i + 1);

        const dayEvents = events.filter((e) =>
          isDateInRange(
            new Date(date),
            toDate(e.start_date),
            e.end_date ? toDate(e.end_date) : null
          )
        );

        return (
          <div
            key={i}
            className="bg-gray-900 border border-gray-800 rounded-lg p-2 min-h-[90px]"
          >
            <div className="text-xs text-gray-400 mb-1">
              {i + 1}
            </div>

            <div className="space-y-1">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  onClick={() => onOpenEvent(event)}
                  className="text-xs truncate text-white rounded px-1 cursor-pointer"
                  style={{
                    backgroundColor: event.color + "33",
                    borderLeft: `3px solid ${event.color}`
                  }}
                >
                  {event.title}
                </div>

              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

