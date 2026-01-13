import { Brain, Database, FileSignature, ImageIcon, MessageSquare, PenTool } from "lucide-react";

export const tools = [
  {
    name: "Business Plan AI",
    description: "Generate structured business plans, pitch logic, and market insights.",
    icon: Brain,
    path: "/business-plan",
    gradient: "from-purple-600 to-indigo-600"
  },
  {
    name: "Multimodal Image AI",
    description: "Create, analyze, and reason over images using multimodal models.",
    icon: ImageIcon,
    path: "/multimodal-images",
    gradient: "from-blue-600 to-cyan-600"
  },
  {
    name: "Startup Logo Generator",
    description: "Generate brand-ready logos aligned with your startup identity.",
    icon: PenTool,
    path: "/logo-generator",
    gradient: "from-pink-600 to-rose-600"
  },
  {
    name: "Data Scraper AI",
    description: "Extract, structure, and analyze data from the web intelligently.",
    icon: Database,
    path: "/data-scraper",
    gradient: "from-emerald-600 to-green-600"
  },
  {
    name: "Qwen AI Chat",
    description: "Advanced conversational AI for reasoning, coding, and research.",
    icon: MessageSquare,
    path: "/qwen-chat",
    gradient: "from-orange-600 to-amber-600"
  },
  {
    name: "PDF Signing AI",
    description: "Securely sign, verify, and manage documents using AI workflows.",
    icon: FileSignature,
    path: "/pdf-signing",
    gradient: "from-slate-600 to-gray-600"
  }
];