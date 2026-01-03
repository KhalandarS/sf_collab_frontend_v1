
import { motion } from "framer-motion";
import {
  Video,
  Send,
  Heart,
  Home,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../../ui/avatar";
import { Button } from "../../ui/button";
import { BarChart3, Settings } from "./Icons";

// Left Sidebar Component - NEW
export default function LeftSidebar() {
  const menuItems = [
    { icon: Home, label: "Feed", active: true },
    { icon: Search, label: "Explore", active: false },
    { icon: Heart, label: "My Favorites", active: false },
    { icon: Send, label: "Direct", active: false },
    { icon: Video, label: "16 TV", active: false },
    { icon: BarChart3, label: "Stats", active: false },
    { icon: Settings, label: "Setting", active: false },
  ];

  const suggestions = [
    {
      name: "Webulsylist",
      location: "Elk Grove, California",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Anghelina",
      location: "Sibiu, Romania",
      avatar: "https://i.pravatar.cc/150?img=13",
    },
    {
      name: "Male Designer",
      location: "Ukraine",
      avatar: "https://i.pravatar.cc/150?img=14",
    },
    {
      name: "Vera Cherry",
      location: "Bremen, Germany",
      avatar: "https://i.pravatar.cc/150?img=15",
    },
    {
      name: "Josh e-Sport",
      location: "Elk Grove, California",
      avatar: "https://i.pravatar.cc/150?img=16",
    },
  ];

  return (
    <div className="w-80 space-y-2">
      {/* Profile Card */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="w-16 h-16 ring-2 ring-blue-400/50">
              <AvatarImage src="https://i.pravatar.cc/150?img=7" />
              <AvatarFallback>LT</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-white">Masudur Rahman</h3>
              <p className="text-sm text-zinc-400">Bremen, Germany</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-center mb-4">
            <div>
              <p className="font-bold text-white">28.5k</p>
              <p className="text-xs text-zinc-400">Likes</p>
            </div>
            <div>
              <p className="font-bold text-white">33</p>
              <p className="text-xs text-zinc-400">Comment</p>
            </div>
            <div>
              <p className="font-bold text-white">134</p>
              <p className="text-xs text-zinc-400">Share</p>
            </div>
          </div>

          <Button className="w-full bg-gradient-to-br from-gray-600 to-black text-gray-200 hover:from-gray-800 hover:to-gray-400 hover:cursor-pointer">
            Edit Profile
          </Button>
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardContent className="p-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.label}
                variant="ghost"
                className={`w-full justify-start mb-2 ${
                  item.active
                    ? "bg-gray-700 text-white border-blue-500/30"
                    : "text-zinc-400 hover:text-white hover:bg-zinc-800/50"
                }`}
              >
                <Icon size={20} className="mr-3" />
                {item.label}
              </Button>
            );
          })}
        </CardContent>
      </Card>

      {/* Suggestions */}
      <Card className="bg-zinc-900/50 backdrop-blur-xl border-zinc-800/50">
        <CardHeader>
          <h3 className="font-semibold text-white">Suggestions for you</h3>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            {suggestions.map((user) => (
              <div
                key={user?.name}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user?.avatar} />
                    <AvatarFallback>{user?.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">
                      {user?.name}
                    </p>
                    <p className="text-xs text-zinc-400">{user?.location}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs border-blue-400/50 text-gray-200 bg-gray-900 hover:bg-gray-700 hover:text-white hover:cursor-pointer"
                >
                  Follow
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
