import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
  DialogFooter,
} from '../ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"; 
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { MessageSquare, X, Send } from 'lucide-react';
import { cn } from '../lib/utils';
import { FcAbout } from "react-icons/fc";

const CompactFeedbackCard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    console.log('Feedback submitted:', data);
    setIsOpen(false);
  };

  const handleDialogOpenChange = (open) => {
    setIsOpen(open);
    // Close tooltip when dialog opens
    if (open) {
      setTooltipOpen(false);
    }
  };

  return (
    <div style={{zIndex: 999999999999}} className="fixed bottom-7 right-32 z-50">
      <TooltipProvider>
        <Tooltip open={tooltipOpen} onOpenChange={setTooltipOpen}>
          <TooltipTrigger asChild>
            <div 
              className="cursor-pointer"
              onMouseEnter={() => !isOpen && setTooltipOpen(true)}
              onMouseLeave={() => setTooltipOpen(false)}
            >
              <div 
                style={{background: 'white'}} 
                className="w-13 h-13 group transition-all duration-700 hover:shadow-[0px_0px_10px_#FFFFFF] rounded-full flex items-center justify-center hover:scale-110"
              >
                <FcAbout size={25}/>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent 
            arrowColor="bg-gray-800 fill-gray-800" 
            className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white p-4"
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
          >
            <h4 className="font-medium relative text-white text-center mb-2 flex items-center justify-center">
              <img 
                src="/feedback.png" 
                className='p-2 h-12 w-12 absolute left-0 mt-1 group-hover:scale-105 transition-all duration-1000' 
                alt="" 
              /> 
              <span>Feedback</span>
            </h4>
            <p className="text-xs text-gray-400 text-center mb-4">
              Help us improve and earn more points.
            </p>
            
            <Dialog open={isOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button 
                  size="sm"
                  className={cn(
                    "w-full mb-2 cursor-pointer",
                    "transition-all duration-700",
                    "bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600",
                    "border-none",
                    "text-white text-sm"
                  )}
                  onClick={() => {
                    setIsOpen(true);
                    setTooltipOpen(false);
                  }}
                >
                  Share Thoughts
                </Button>
              </DialogTrigger>
            </Dialog>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {/* Dialog is now separate from Tooltip */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className={cn(
            "sm:max-w-[450px]",
            "bg-gray-900/95 backdrop-blur-xl",
            "border border-gray-700/50",
            "shadow-2xl shadow-black/40"
          )}
          onMouseEnter={() => setTooltipOpen(false)} // Ensure tooltip stays closed
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-white">Feedback</DialogTitle>
              <DialogDescription className="text-gray-400">
                We'd love to hear your thoughts
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="quick" className="mt-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-800/50">
                <TabsTrigger 
                  value="quick"
                  className="text-sm data-[state=active]:text-black text-gray-400 data-[state=active]:bg-white"
                >
                  Quick +10pt
                </TabsTrigger>
                <TabsTrigger 
                  value="detailed"
                  className="text-sm data-[state=active]:text-black text-gray-400 data-[state=active]:bg-white"
                >
                  Detailed +15pt
                </TabsTrigger>
              </TabsList>

              <TabsContent value="quick" className="pt-4">
                <div className="space-y-3">
                  <Label className="text-white text-sm">Your feedback</Label>
                  <Textarea 
                    name="quickFeedback"
                    placeholder="What can we improve?"
                    className="min-h-[100px] bg-gray-800/50 border-gray-700 text-white text-sm"
                    required
                  />
                </div>
              </TabsContent>

              <TabsContent value="detailed" className="pt-4">
                <div className="space-y-3">
                  <Label className="text-white text-sm">Type</Label>
                  <Select name="feedbackType">
                    <SelectTrigger className="w-full bg-gray-800/50 border-gray-700 text-white text-sm">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 border-gray-700">
                      <SelectItem className="text-white hover:text-black" value="bug">Bug</SelectItem>
                      <SelectItem className="text-white hover:text-black" value="feature">Feature</SelectItem>
                      <SelectItem className="text-white hover:text-black" value="improvement">Improvement</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Label className="text-white text-sm">Details</Label>
                  <Textarea 
                    name="detailedFeedback"
                    placeholder="Describe in detail..."
                    className="min-h-[120px] bg-gray-800/50 border-gray-700 text-white text-sm"
                    required
                  />
                </div>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <DialogClose asChild>
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  className="text-gray-400 hover:bg-white/70 cursor-pointer hover:text-black"
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button 
                type="submit"
                size="sm"
                className="bg-white text-black hover:bg-white/90 cursor-pointer hover:scale-102 hover:shadow-[0px_0px_10px_white]"
              >
                <Send className="w-3 h-3 mr-2" />
                Submit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CompactFeedbackCard;