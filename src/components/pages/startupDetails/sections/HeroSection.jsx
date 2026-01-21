import { API_URL } from "@/utils/config";
import { Building2, DollarSign, MapPin, Mail, Rocket, Share2 } from "lucide-react";
import { Badge } from "../../../ui/badge";
import { Button } from "@/components/ui/button";

// Hero Section Component
export default function HeroSection({ startup, onJoinClick, formatCurrency, getStageBadgeVariant, setAlertDescription, setShowAlert, setAlertTitle, setAlertVariant }) {
  return (
    <div className="relative ">
      {/* Banner */}
      <div className="h-64 rounded-lg mx-auto w-full object-fit bg-gradient-to-r from-blue-600/40 via-purple-600/40 to-blue-800/40 relative overflow-hidden">
        {startup.banner_url && (
          <img
            src={`${API_URL}${startup.banner_url}`}
            alt={startup.name}
            className="w-full  h-full object-cover opacity-40"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative  w-full shadow-2xl mx-auto px-4 sm:px-6 lg:px-8 pb-8 ">

        
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between -mt-20 relative z-10">
          {/* Logo and Basic Info */}
          <div className="flex flex-col lg:flex-row lg:items-end gap-6">
            {/* Logo */}
            <div className="w-32 h-32 mt-3 bg-white rounded-full border-4 border-gray-800 shadow-2xl flex items-center justify-center">
              {startup.logo_url ? (
                <img
                  src={startup.logo_url.startsWith("http") ? startup.logo_url : `${API_URL}${startup.logo_url}`}
                  alt={startup.name}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <span className="text-2xl font-bold text-blue-600">
                  {startup.name.charAt(0)}
                </span>
              )}
            </div>

            {/* Startup Info */}
            <div className="text-white space-y-3 ">
              <h1 className="text-3xl font-bold bg-gray-500/5 backdrop-blur-sm w-fit p-2 rounded-full flex items-center">{startup.name}</h1>
              <div className="flex flex-wrap items-center gap-3">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-400/30">
                  <Building2 className="w-3 h-3 mr-1" />
                  {startup.industry}
                </Badge>
                <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                  <MapPin className="w-3 h-3 mr-1" />
                  {startup.location || 'Remote'}
                </Badge>
                <Badge className={`${getStageBadgeVariant(startup.stage)}`}>
                  <Rocket className="w-3 h-3 mr-1" />
                  {startup.stage.charAt(0).toUpperCase() + startup.stage.slice(1)}
                </Badge>
              </div>
              <p className="text-gray-300 max-w-2xl">
                {startup.description || "Innovative startup making waves in their industry"}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 lg:mt-0">
            <Button
              onClick={onJoinClick}
              className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white"
            >
              <Mail className="w-4 h-4 mr-2" />
              Join Team
            </Button>
            <Button
              onClick={() => {
                const url = `${window.location.origin}/startups/${startup.id}`;
                navigator.clipboard.writeText(url);
                setShowAlert(true);
                setAlertTitle("Link Copied!");
                setAlertDescription("Startup link has been copied to clipboard.");
                setAlertVariant("success");
              }}
              variant="outline" className="border-gray-600 text-black hover:bg-black/30 cursor-pointer hover:text-white">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            {startup.funding_amount > 0 && (
              <Button variant="outline" className="border-gray-600 text-black hover:bg-black/30 hover:text-white">
                <DollarSign className="w-4 h-4 mr-2" />
                {formatCurrency(startup.funding_amount)} raised
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
