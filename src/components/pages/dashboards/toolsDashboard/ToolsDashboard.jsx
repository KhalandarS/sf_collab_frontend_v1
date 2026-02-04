import { Link } from "react-router-dom";

import { useSelector } from "react-redux";

import {
  Calculator,
  FileText,
  Grid3X3,
  FileSignature,
  ArrowRight,
  Zap,
  Lock,
} from "lucide-react";

const tools = [
  {
    name: "Calculator",
    description: "Advanced calculator for quick computations and financial analysis",
    icon: Calculator,
    path: "/calculator",
    gradient: "from-blue-600 to-cyan-500",
  },
  {
    name: "Notes",
    description: "Create, organize, and manage your notes with rich text formatting",
    icon: FileText,
    path: "/notes",
    gradient: "from-amber-600 to-orange-500",
  },
  // {
  //   name: "Board",
  //   description: "Collaborative whiteboard and kanban board for project planning",
  //   icon: Grid3X3,
  //   path: "/board",
  //   gradient: "from-purple-600 to-pink-500",
  // },
  {
    name: "PDF Signing",
    description: "Sign and manage digital document signatures securely",
    icon: FileSignature,
    path: "/pdf-signing",
    gradient: "from-emerald-600 to-teal-500",
  },
];

export default function ToolsDashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 sm:p-8">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              Essential Tools
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 mb-2 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: "0.2s" }}>
            Welcome back, <span className="text-purple-300 font-semibold">{user?.firstName || "User"}</span>. Access your productivity tools and get things done efficiently.
          </p>

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: "0.4s" }}>
            {[
              { icon: "⚡", label: "Quick Access" },
              { icon: "🔒", label: "Secure" },
              { icon: "📱", label: "All Devices" },
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm text-slate-300 font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 animate-fade-in" style={{ animationDelay: "0.6s" }}>
          {tools.map(({ name, description, icon: Icon, path, gradient }) => (
            <Link
              key={name}
              to={path}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.02] h-full"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border border-white/10" />

              {/* Animated Gradient Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} blur-2xl`} />

              {/* Border Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10 p-8 h-full flex flex-col">
                {/* Icon Container */}
                <div className="mb-6">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} opacity-100 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-2xl text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                  {name}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm flex-1 mb-6 group-hover:text-white transition-colors duration-300">
                  {description}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-2 text-sm font-semibold text-white opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:gap-3">
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                </div>
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            </Link>
          ))}
        </div>

        {/* Animated Scan Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-scan" />
      </div>
    </div>
  );
}