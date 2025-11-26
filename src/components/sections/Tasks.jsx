import React, { useRef, useState, useEffect, useMemo } from "react";
import { ChevronRight, MoreVertical, CheckCircle2, Clock, Calendar, Users } from "lucide-react";
import ShinyText from "../ui/ShinyText";
import SpotlightCard from "../ui/SpotlightCard";

export default function Tasks({ searchQuery = "" }) {
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollRef = useRef(null);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollWidth, clientWidth } = scrollRef.current;
      setShowScrollIndicator(scrollWidth > clientWidth);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  const tasks = [
    {
      id: 1,
      title: "User Research",
      description: "Conduct a user research by conducting online survey and draft out questionnaires.",
      status: "In Progress",
      date: "Monday",
      priority: "high",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
    {
      id: 2,
      title: "Design System",
      description: "Conduct a user research by conducting online survey and draft out questionnaires.",
      status: "In Progress",
      date: "Monday",
      priority: "medium",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
    {
      id: 3,
      title: "Real Estate Landing Page",
      description: "Assist to leverage on our efforts in making the user research possible and ensure the design solution for the real estate project.",
      status: "Completed",
      date: "31/04/22",
      priority: "low",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
    {
      id: 4,
      title: "Mobile App Redesign",
      description: "Complete redesign of the mobile application interface with new branding guidelines.",
      status: "Completed",
      date: "31/04/22",
      priority: "high",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
  ];

  const inProgressTasks = [
    {
      id: 7,
      title: "UI/UX Design",
      description: "Create wireframes and mockups for the new dashboard interface",
      status: "In Progress",
      date: "Tuesday",
      priority: "high",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
    {
      id: 8,
      title: "Frontend Development",
      description: "Implement responsive design components using React",
      status: "In Progress",
      date: "Wednesday",
      priority: "medium",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
  ];

  const completedTasks = [
    {
      id: 9,
      title: "Project Setup",
      description: "Initialize project repository and set up development environment",
      status: "Completed",
      date: "15/04/22",
      priority: "medium",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
    {
      id: 10,
      title: "API Integration",
      description: "Connect frontend with backend APIs and implement error handling",
      status: "Completed",
      date: "20/04/22",
      priority: "high",
      avatars: [
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
        "/placeholder.svg?height=24&width=24",
      ],
    },
  ];

  const filterList = (list, q) =>
    list.filter((t) => {
      const title = t.title?.toLowerCase() || "";
      const description = t.description?.toLowerCase() || "";
      const status = t.status?.toLowerCase() || "";
      const date = t.date?.toLowerCase() || "";
      return title.includes(q) || description.includes(q) || status.includes(q) || date.includes(q);
    });

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return { tasks, inProgressTasks, completedTasks };
    }
    return {
      tasks: filterList(tasks, q),
      inProgressTasks: filterList(inProgressTasks, q),
      completedTasks: filterList(completedTasks, q),
    };
  }, [searchQuery]);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'from-rose-500/40 to-red-600/40';
      case 'medium':
        return 'from-amber-500/40 to-orange-600/40';
      case 'low':
        return 'from-emerald-500/40 to-green-600/40';
      default:
        return 'from-slate-500/40 to-slate-600/40';
    }
  };
  
  const getPriorityColorTwo = (priority) => {
    switch (priority) {
      case 'high':
        return 'rgba(181, 13, 139, 0.20)';
      case 'medium':
        return 'rgba(207, 137, 25, 0.20)';
      case 'low':
        return 'rgba(20, 181, 138, 0.20)';
      default:
        return 'from-slate-500/40 to-slate-600/40';
    }
  };

  const TaskCard = ({ task }) => (
    <SpotlightCard
    spotlightColor={getPriorityColorTwo(task?.priority)}
    className="relative group max-w-96  hover:scale-[1.02] shadow-xl hover:shadow-2xl">
      {/* Top accent line */}
      <div className={`absolute top-0 p-1 left-0 right-0 h-1.5 bg-linear-to-r ${getPriorityColor(task.priority)} rounded-t-xl`} />
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className={`p-1.5 rounded-lg ${task.status === "Completed" ? "bg-emerald-500/10 ring-1 ring-emerald-500/20" : "bg-amber-500/10 ring-1 ring-amber-500/20"}`}>
            {task.status === "Completed" ? (
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            ) : (
              <Clock className="h-4 w-4 text-amber-400" />
            )}
          </div>
          <span className="font-semibold text-slate-100 truncate">{task.title}</span>
        </div>
        <button className="p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors flex-shrink-0 ml-2">
          <MoreVertical className="h-4 w-4 text-slate-400" />
        </button>
      </div>

      {/* Description */}
      <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed min-h-[60px]">
        {task.description}
      </p>

      {/* Priority Badge */}
      <div className="mb-4">
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-linear-to-r ${getPriorityColor(task.priority)} text-white shadow-lg`}>
          <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </span>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-4 border-t border-slate-700/50">
        <div className="flex -space-x-2">
          {task.avatars.map((avatar, index) => (
            <div
              key={index}
              className="h-7 w-7 rounded-full border-2 border-slate-800 overflow-hidden ring-1 ring-slate-700/50 hover:scale-110 transition-transform duration-200"
            >
              <div className="h-full w-full bg-linear-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white text-xs font-semibold">
                {index + 1}
              </div>
            </div>
          ))}
          {task.avatars.length > 0 && (
            <div className="h-7 w-7 rounded-full border-2 border-slate-800 bg-slate-700/50 flex items-center justify-center ring-1 ring-slate-700/50">
              <Users className="h-3.5 w-3.5 text-slate-400" />
            </div>
          )}
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Calendar className="h-3.5 w-3.5" />
          <span className="font-medium">{task.date}</span>
        </div>
      </div>
    </SpotlightCard>
  );

  const TaskSection = ({ title, tasks, badgeCount, icon, gradient }) => (
    <div className="space-y-4 w-full">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className={`p-2 bg-linear-to-br ${gradient} rounded-xl shadow-lg`}>
            {icon}
          </div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
        </div>
        <span className="bg-linear-to-br from-slate-700/50 to-slate-800/50 backdrop-blur-xl text-white px-4 py-1.5 rounded-full text-sm font-semibold border border-slate-600/50 shadow-lg">
          {badgeCount}
        </span>
      </div>

      <div className="relative w-full">
        <div
          className="overflow-x-auto pb-4 scrollbar-hide"
          ref={scrollRef}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <div className="flex gap-4 w-max min-w-full p-2">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
            {tasks.length === 0 && (
              <div className="text-sm text-slate-400 py-6 px-4 bg-slate-800/30 rounded-xl border border-slate-700/50">
                No tasks match your search
              </div>
            )}
          </div>
        </div>
        {showScrollIndicator && (
          <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-gradient-to-l from-slate-900 via-slate-900/80 to-transparent w-16 h-full flex items-center justify-end pr-3 pointer-events-none">
            <div className="p-2 bg-slate-800/50 rounded-full backdrop-blur-sm border border-slate-700/50">
              <ChevronRight className="h-4 w-4 text-slate-400" />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2.5">
              <CheckCircle2 className="h-7 w-7 text-white" />
            </div>
            <ShinyText 
              text="Tasks Board" 
              disabled={false} 
              speed={3} 
              className='custom-class text-2xl font-bold' 
            />
          </div>
          <p className="text-slate-400 text-lg ml-14">Manage and track your project tasks</p>
        </div>

        <div className="flex-1 flex flex-col gap-8 w-full">
          <TaskSection
            title="Today's Tasks"
            tasks={filtered.tasks}
            badgeCount={filtered.tasks.length}
            icon={<Calendar className="h-5 w-5 text-white" />}
            gradient="from-blue-500 to-cyan-600"
          />

          <TaskSection
            title="In Progress"
            tasks={filtered.inProgressTasks}
            badgeCount={filtered.inProgressTasks.length}
            icon={<Clock className="h-5 w-5 text-white" />}
            gradient="from-amber-500 to-orange-600"
          />

          <TaskSection
            title="Completed"
            tasks={filtered.completedTasks}
            badgeCount={filtered.completedTasks.length}
            icon={<CheckCircle2 className="h-5 w-5 text-white" />}
            gradient="from-emerald-500 to-green-600"
          />
        </div>
      </div>

      <style >{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}