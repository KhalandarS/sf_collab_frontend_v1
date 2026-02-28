import { Link } from "react-router-dom";
import {
  Brain,
  Image as ImageIcon,
  PenTool,
  Database,
  MessageSquare,
  FileSignature,
  ArrowRight
} from "lucide-react";
import { tools } from "./AITools";
import { isAiToolsLocked, getAiToolsLockRemainingDays } from "../../../../utils/config.js";

export default function AIDashboard() {
  const locked = isAiToolsLocked();
  const daysRemaining = getAiToolsLockRemainingDays();
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 p-4 sm:p-8">
      
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-float" />
        <div className="absolute top-1/3 -right-10 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute -bottom-20 left-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Premium Header Section */}
        <div className="text-center mb-12 animate-fade-in">

          {/* Main Title */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
            <span className="bg-linear-to-r from-white via-blue-100 to-purple-200 bg-clip-text text-transparent">
              SF AI Tools
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-slate-300 mb-2 max-w-3xl mx-auto leading-relaxed animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Access your AI-powered tools to <span className="bg-linear-to-r from-blue-300 to-purple-300 bg-clip-text text-transparent font-semibold">build, design, analyze, and scale</span> — all from one intelligent workspace.
          </p>

          {locked && (
            <div
              className="mt-6 max-w-2xl mx-auto px-4 py-3 rounded-xl border border-amber-400/40 bg-amber-500/10 text-amber-100 text-sm sm:text-base animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <p className="font-medium mb-1">AI tools are temporarily locked</p>
              <p className="text-amber-100/90">
                We&apos;re rolling out additional security measures and running tests.
                {daysRemaining > 0 && (
                  <>
                    {" "}
                    Access will automatically resume in{" "}
                    <span className="font-semibold">
                      {daysRemaining} day{daysRemaining !== 1 ? "s" : ""}
                    </span>.
                  </>
                )}
              </p>
            </div>
          )}

          {/* Feature Highlights */}
          <div className="flex flex-wrap justify-center gap-6 mt-8 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            {[
              { icon: '⚡', label: 'Lightning Fast' },
              { icon: '🧠', label: 'AI Powered' },
              { icon: '🔒', label: 'Enterprise Grade' }
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <span className="text-lg">{feature.icon}</span>
                <span className="text-sm text-slate-300 font-medium">{feature.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Tools Grid - Full Screen */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {tools.map(({ name, available = true, description, icon: Icon, path, gradient }) => (
            <Link
              key={name}
              to={available && !locked ? path : "#"}
              className="group relative rounded-2xl overflow-hidden transition-all duration-300 hover:scale-[1.05] h-full"
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-linear-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-2xl border border-white/10" />

              {/* Animated Gradient Overlay */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br ${gradient} blur-2xl`} />

              {/* Border Glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />

              {/* Content */}
              <div className="relative z-10 p-6 sm:p-8 h-full flex flex-col">
                {/* Icon Container */}
                <div className="mb-4">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${gradient} opacity-100 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg sm:text-xl text-white mb-3 group-hover:text-transparent group-hover:bg-linear-to-r group-hover:from-white group-hover:to-slate-300 group-hover:bg-clip-text transition-all duration-300">
                  {name}
                </h3>

                {/* Description */}
                <p className="text-slate-300 text-sm flex-1 mb-6 group-hover:text-white transition-colors duration-300">
                  {description}
                </p>

                {/* CTA */}
                {locked ? (
                  <div className="text-sm font-semibold text-amber-300 opacity-80">
                    Temporarily locked for security updates
                  </div>
                ) : available ? (
                  <div className="flex items-center gap-2 text-sm font-semibold text-white opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:gap-3">
                    <span>Launch Tool</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                  </div>
                ) : (
                  <div className="text-sm font-semibold text-red-400 opacity-70">
                    Coming Soon
                  </div>
                )}
              </div>

              {/* Corner Accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-bl-full" />
            </Link>
          ))}
        </div>

        {/* Animated Scan Line */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent animate-scan" />
      </div>
    </div>
  );
}
