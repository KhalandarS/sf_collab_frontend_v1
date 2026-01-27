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
import { Send, AlertCircle } from 'lucide-react';
import { cn } from '../lib/utils';
import { FcAbout } from "react-icons/fc";
import { useSelector } from 'react-redux';
import { waitlistAPI } from '../../utils/APIs/waitlistAPI';
import { toast } from 'react-toastify';
import axios from 'axios';
import { API_BASE_URL } from '@/utils/config';
import { SiAboutdotme } from 'react-icons/si';
import { RiFeedbackLine } from 'react-icons/ri';

const SidebarFeedbackCard = ({ callback = () => {} }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [feedbackContent, setFeedbackContent] = useState('');
  const { access_token, user } = useSelector((state) => state.auth);
  
  const MIN_FEEDBACK_LENGTH = 20;
  const isValidFeedback = feedbackContent.trim().length >= MIN_FEEDBACK_LENGTH;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isValidFeedback) {
      toast.warn(`Feedback must be at least ${MIN_FEEDBACK_LENGTH} characters long.`);
      return;
    }

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const response = await axios.post(`${API_BASE_URL}/feedback`, {
      userId: user.id,
      content: data.feedback,
    }, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    console.log(response);
    if (response.status === 201) {
      toast.success('Thank you for your feedback!');
      // waitlistAPI.addPoints({ userId: user.id, category: 'contribution' }, access_token);
      setFeedbackContent('');
      e.target.reset();
      setIsOpen(false);
    } else {
      toast.error('Failed to submit feedback. Please try again later.');
      return;
    }
  };

  const handleDialogOpenChange = (open) => {
    setIsOpen(open);
    if (open) {
      setTooltipOpen(false);
    }
  };

  return (
    <div style={{ zIndex: 999999999999 }} className=" option-a option">
      <TooltipProvider>
        <Tooltip
        // open={tooltipOpen} onOpenChange={setTooltipOpen}
        >
          <TooltipTrigger asChild>
            <div
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(true);
              }}
            >
              <div
                className=""
              >
                <RiFeedbackLine size={20} className='text-white' />
              </div>
            </div>
          </TooltipTrigger>

        </Tooltip>
      </TooltipProvider>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent
          className={cn(
            "sm:max-w-[450px]",
            "bg-gray-900/95 backdrop-blur-xl",
            "border border-gray-700/50",
            "shadow-2xl shadow-black/40 w-full"
          )}
          onMouseEnter={() => setTooltipOpen(false)}
        >
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="text-white">Feedback</DialogTitle>
              <DialogDescription className="text-gray-400">
                We'd love to hear your thoughts
              </DialogDescription>
            </DialogHeader>
            {/* Points Info Banner */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-blue-900/20 border border-blue-700/30 rounded-lg">
              <FcAbout className="w-5 h-5 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-400">
                You can earn 10-50 points for helpful feedback that helps us improve!
              </p>
            </div>
            {/* Warning Banner */}
            <div className="mt-4 flex items-start gap-3 p-3 bg-red-900/20 border border-red-700/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <p className="text-xs text-red-400">
                Please provide genuine feedback only. Spam or nonsense suggestions may result in account suspension or ban.
              </p>
            </div>

            <div className="mt-4 space-y-3">
              <Label className="text-white text-sm">Your feedback</Label>
              <textarea
                name="feedback"
                placeholder="What can we improve?"
                className="w-full min-h-[120px] bg-gray-800/50 border-gray-700 text-white text-sm"
                value={feedbackContent}
                onChange={(e) => setFeedbackContent(e.target.value)}
                required
              />
              <p className={cn(
                "text-xs",
                feedbackContent.length >= MIN_FEEDBACK_LENGTH ? "text-green-400" : "text-gray-500"
              )}>
                {feedbackContent.length}/{MIN_FEEDBACK_LENGTH} characters
              </p>
            </div>

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
                disabled={!isValidFeedback}
                className="bg-white text-black hover:bg-white/90 cursor-pointer hover:scale-102 hover:shadow-[0px_0px_10px_white] disabled:opacity-50 disabled:cursor-not-allowed"
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

export default SidebarFeedbackCard;
