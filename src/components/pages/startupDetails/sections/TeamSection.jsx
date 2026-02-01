import { API_URL } from "@/utils/config";
import { UserPlus, X } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Team Section Component
export default function TeamSection({ members, onJoinClick, isCreator, onRemoveMember }) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Team</h2>
    {console.log(members)}
          {/* Compact avatar row */}
          <div className="flex -space-x-2">
            {members.map((member) => (
              <TooltipProvider key={member.id}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 border border-gray-900 hover:border-blue-500 transition">
                      <AvatarImage
                        src={
                          member?.profilePicture?.startsWith("http")
                            ? member.profilePicture
                            : `${API_URL}${member.profilePicture}`
                        }
                      />
                      <AvatarFallback className="bg-blue-600 text-white text-xs">
                        {member.firstName?.[0]}
                        {member.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent className="bg-gray-900 border-gray-700 text-white text-xs">
                    {member.firstName} {member.lastName}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}

            {members.length > 8 && (
              <div className="h-8 w-8 flex items-center justify-center rounded-full bg-gray-700 text-gray-300 text-xs border border-gray-600">
                +{members.length - 8}
              </div>
            )}
          </div>
        </div>

        {isCreator && (
          <Button size="sm" onClick={onJoinClick} className="h-8 bg-blue-600 hover:bg-blue-700">
            <UserPlus className="w-4 h-4 mr-1" />
            Add
          </Button>
        )}
      </div>

      {/* Dense members list */}
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        {members.map((member) => (
          <Link
            key={member.id}
            to={`/user-profile?userId=${member.userId}`}
            className="flex items-center justify-between px-4 py-2 hover:bg-gray-800/60 transition"
          >
            <div className="flex items-center gap-3 min-w-0">
              <Avatar className="h-9 w-9 shrink-0">
                <AvatarImage
                  src={
                    member?.profilePicture?.startsWith("http")
                      ? member.profilePicture
                      : `${API_URL}${member.profilePicture}`
                  }
                />
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {member.firstName?.[0]}
                  {member.lastName?.[0]}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {member.firstName} {member.lastName}
                </p>
                <p className="text-xs text-gray-400 capitalize">
                  {member.role}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-500 hidden md:block">
                {new Date(member.joinedAt).toLocaleDateString()}
              </span>

              {isCreator && member.role !== "founder" && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={(e) => onRemoveMember(e, member.id)}
                  className="h-7 w-7 text-red-400 hover:bg-red-500/10"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
