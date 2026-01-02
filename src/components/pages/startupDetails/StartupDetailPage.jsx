import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, MapPin, Users, Calendar, TrendingUp, Globe, 
  Code, Briefcase, Heart, Share2, ExternalLink, Mail,
  Github, Linkedin, X, Check, ChevronRight, Home,
  Download, Trash2, Plus, UserPlus, Building2, BarChart3,
  FileText, Eye, DollarSign, Rocket, Target, Clock,
  CheckCircle, PlayCircle, PauseCircle, AlertCircle,
  FileSpreadsheet, MessageSquare, Settings, Search,CheckCircle2Icon,XIcon
} from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "../../ui/alert"
  
// shadcn/ui components
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '../../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '../../ui/avatar';
import { AvatarGroup,AvatarGroupTooltip } from '../../ui/shadcn-io/avatar-group/index';
import { Separator } from '../../ui/separator';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../ui/accordion';
import ShinyText from '../../ui/ShinyText';

import { useSelector } from 'react-redux';
import { startupAPI } from './startUpAPI';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StartupDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [members, setMembers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isDeleteStartupModalOpen, setIsDeleteStartupModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  
  const [showAlert, setShowAlert] = useState(false);
  
  // Mock data for new tabs
  const [projectGoals, setProjectGoals] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  const [isCreator, setIsCreator] = useState(false);
  
  const {user,access_token,refreshToken} = useSelector((state) => state.auth);

  // Form states
  const [joinForm, setJoinForm] = useState({
    name: '',
    email: '',
    message: '',
    portfolio: '',
    linkedin: '',
    github: ''
  });

  const [memberForm, setMemberForm] = useState({
    user_id: '',
    first_name: '',
    last_name: '',
    role: 'member'
  });

  const [documentForm, setDocumentForm] = useState({
    document: null,
    document_type: 'general'
  });

   // Fetch startup data
  const fetchStartupData = async () => {
    try {
      setLoading(true);
      const token = access_token;
      if (!token) {
        console.error('No access token found');
        return;
      }
  
      const args = {
        startup_id: id,
        user_id: user?.id
      }
      const startupResult = await startupAPI.getStartup(id, token).catch(err => ({ success: false, error: err }));
      const membersResult = await startupAPI.getMembers(token, args).catch(err => ({ success: false, error: err }));
      const documentsResult = await startupAPI.getDocuments(id, token).catch(err => ({ success: false, error: err }));
      const statsResult = await startupAPI.getStats(id, token).catch(err => ({ success: false, error: err }));

      const startupData = startupResult.success ? startupResult : { success: false, data: null };
      const membersData = membersResult.success ? membersResult : { success: false, data: { members: [] } };
      const documentsData = documentsResult.success ? documentsResult : { success: false, data: { documents: [] } };
      const statsData = statsResult.success ? statsResult : { success: false, data: { stats: null } };
      console.log(startupData);

      console.log(membersData);
      console.log(documentsData);
      console.log(statsData);
      if (startupData.success) setStartup(startupData.data.startup);
      if (membersData.success) setMembers(membersData.data.members);
      if (documentsData.success) setDocuments(documentsData.data.documents);
      if (statsData.success) setStats(statsData.data.stats || {});
      
    } catch (error) {
      console.error('Error fetching startup data:', error);
      toast.error('Error loading startup data');

    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (id) {
      fetchStartupData();

    }
  }, [id]);



  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const getStageBadgeVariant = (stage) => {
    const variants = {
      idea: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
      seed: 'bg-green-500/20 text-green-400 border-green-400/30',
      early: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
      growth: 'bg-orange-500/20 text-orange-400 border-orange-400/30',
      scale: 'bg-purple-500/20 text-purple-400 border-purple-400/30'
    };
    return variants[stage] || 'bg-gray-500/20 text-gray-400 border-gray-400/30';
  };

  // Document handlers
  const handleDocumentUpload = async (e) => {
    e.preventDefault();
    if (!documentForm.document) return;

    const formData = new FormData();
    formData.append('document', documentForm.document);
    formData.append('document_type', documentForm.document_type);

    try {
      const response = await fetch(`${API_URL}/startups/${id}/documents`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (response.ok) {
        toast.success('Document uploaded successfully');
        setIsUploadDocModalOpen(false);
        setDocumentForm({ document: null, document_type: 'general' });
        fetchStartupData();
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading document');
    }
  };

  const handleDocumentDelete = async (documentId) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;

    try {
      const response = await startupAPI.deleteDocument(id, documentId, access_token);


      
      if (response.success) {
        toast.success('Document deleted successfully');
        fetchStartupData();
      } else {
        throw new Error('Delete failed');
      }
    } catch (error) {
      toast.error('Error deleting document');
    }
  };

  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await fetch(`${API_URL}/startups/${id}/documents/${documentId}/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        throw new Error('Download failed');
      }
    } catch (error) {
      toast.error('Error downloading document');
    }
  };

  // Member handlers
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await startupAPI.addMember(id, memberForm, access_token);


      
      if (response.success) {
        toast.success('Member added successfully');
        setIsAddMemberModalOpen(false);
        setMemberForm({ user_id: '', first_name: '', last_name: '', role: 'member' });
        fetchStartupData();
      } else {
        throw new Error('Failed to add member');
      }
    } catch (error) {
      toast.error('Error adding member');
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm('Are you sure you want to remove this member?')) return;

    try {
      const response = await startupAPI.removeMember(id, memberId, access_token);

      
      if (response.success) {
        toast.success('Member removed successfully');
        fetchStartupData();
      } else {
        throw new Error('Failed to remove member');
      }
    } catch (error) {
      toast.error('Error removing member');
    }
  };
  useEffect(() => {

    if (user && members.length > 0) {
      console.log(members);
      setIsCreator(members.find(m => m.userId === user?.id && ['creator', 'founder'].includes(m.role)) !== undefined);
    }
  }, [members, user]);
  // Delete startup
  const handleDeleteStartup = async () => {
    try {
      const response = await startupAPI.deleteStartup(id, access_token);

      
      if (response.success) {
        toast.success('Startup deleted successfully');
        navigate('/discover');
      } 
    } catch (error) {
      toast.error('Error deleting startup');
      console.error('Error deleting startup:', error);
    }
  };

  if (loading) {
    return <StartupDetailSkeleton />;
  }

  if (!startup) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 bg-gray-800 border-gray-700 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Startup Not Found</h2>
          <p className="text-gray-400 mb-4">The startup you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/discover-startups')}>Back to Discover</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="z-50  w-full"
      >
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/discover-startups')}
                className="text-gray-300 hover:text-white cursor-pointer bg-transparent hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Button>
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span className="text-white font-medium">{startup.name}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {isCreator && (
                <>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsAddMemberModalOpen(true)}
                    className="text-gray-300 hover:text-black"
                  >
                    <UserPlus className="w-4 h-4 mr-1" />
                    Add Member
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setIsUploadDocModalOpen(true)}
                    className="text-gray-300 hover:text-black"
                  >
                    <FileText className="w-4 h-4 mr-1" />
                    Upload Doc
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => setIsDeleteStartupModalOpen(true)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setIsFavorited(!isFavorited)}
                className="text-gray-300 hover:text-red-500"
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-300 hover:text-blue-500">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <HeroSection 
        startup={startup} 
        onJoinClick={() => setIsJoinModalOpen(true)}
        formatCurrency={formatCurrency}
        getStageBadgeVariant={getStageBadgeVariant}
        setAlertDescription={setAlertDescription}
        setShowAlert={setShowAlert}
        setAlertTitle={setAlertTitle}
        setAlertVariant={setAlertVariant}
      />

      {/* Main Content with Tabs */}
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-5 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm">
            <TabsTrigger value="overview" className="rounded-lg text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              <ShinyText 
                  text="Overview" 
                  disabled={false} 
                  speed={3} 
                //   className='custom-title' 
                />
            </TabsTrigger>
            <TabsTrigger value="members" className="rounded-lg text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Users className="w-4 h-4 mr-2" />
              <ShinyText 
                  text="Members" 
                  disabled={false} 
                  speed={3} 
                //   className='custom-title' 
                />
            </TabsTrigger>
            <TabsTrigger value="documents" className="rounded-lg text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <FileText className="w-4 h-4 mr-2" />
              <ShinyText 
                  text="Documents" 
                  disabled={false} 
                  speed={3} 
                //   className='custom-title' 
                />
            </TabsTrigger>
            <TabsTrigger value="goals" className="rounded-lg text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Target className="w-4 h-4 mr-2" />
              <ShinyText 
                  text=" Project Goals" 
                  disabled={false} 
                  speed={3} 
                //   className='custom-title' 
                />
             
            </TabsTrigger>
            <TabsTrigger value="calendar" className="rounded-lg text-gray-400 data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Calendar className="w-4 h-4 mr-2" />
              <ShinyText 
                  text="Calendar" 
                  disabled={false} 
                  speed={3} 
                //   className='custom-title' 
                />
              
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-8">
            <GamifiedStatsOverview startup={startup} stats={stats} formatCurrency={formatCurrency} />
            <DescriptionSection startup={startup} formatCurrency={formatCurrency} />
            
            <TechStackSection startup={startup} />
          </TabsContent>

          {/* Members Tab */}
          <TabsContent value="members">
            <TeamSection 
              members={members} 
              isCreator={isCreator}
              onRemoveMember={handleRemoveMember}
              onJoinClick={() => setIsAddMemberModalOpen(true)}
            />
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <DocumentsSection 
              documents={documents}
              isCreator={isCreator}
              onDownload={downloadDocument}
              onDelete={handleDocumentDelete}
              onJoinClick={() => setIsUploadDocModalOpen(true)}

            />
          </TabsContent>

          {/* Project Goals Tab */}
          <TabsContent value="goals">
            <ProjectGoalsSection 
              goals={projectGoals}
              isCreator={isCreator}
            />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarSection 
              events={calendarEvents}
              isCreator={isCreator}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}
      <JoinRequestModal 
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        startupName={startup.name}
      />
      {isCreator &&
        <>
      <AddMemberModal
        isOpen={isAddMemberModalOpen}
        onClose={() => setIsAddMemberModalOpen(false)}
        onSubmit={handleAddMember}
        formData={memberForm}
        onFormChange={setMemberForm}
      />

      <UploadDocumentModal
        isOpen={isUploadDocModalOpen}
        onClose={() => setIsUploadDocModalOpen(false)}
        onSubmit={handleDocumentUpload}
        formData={documentForm}
        onFormChange={setDocumentForm}
        onJoinClick={() => setIsUploadDocModalOpen(true)}
        
      />

      <DeleteStartupModal
        isOpen={isDeleteStartupModalOpen}
        onClose={() => setIsDeleteStartupModalOpen(false)}
        onConfirm={handleDeleteStartup}
        startupName={startup.name}
      />
      </>
      }
        {
            showAlert&&(
                <div className="w-full max-w-lg fixed top-46 right-6">
                <Alert className={'relative '}>
                    
                  <CheckCircle2Icon />
                  <AlertTitle>{alertTitle}</AlertTitle>
                  <AlertDescription>
                    {alertDescription}
                  </AlertDescription>
                  <button className='cursor-pointer absolute right-2 top-1' onClick={() => setShowAlert(false)}>
                    <XIcon className='size-5' />
                    <span className='sr-only'>Close</span>
                  </button>
                </Alert>
              </div>
            )
        }

    </div>
  );
};

// Updated Hero Section - Facebook-like profile layout
const HeroSection = ({ startup, onJoinClick, formatCurrency, getStageBadgeVariant,setAlertDescription,setShowAlert,setAlertTitle,setAlertVariant }) => (
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
                src={`${API_URL}${startup.logo_url}`}
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
);

// Description Section Component
const DescriptionSection = ({ startup, formatCurrency }) => (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="grid lg:grid-cols-2 gap-8"
    >
      {/* Company Description */}
      <Card className="bg-gray-800 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            About Us
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-300 leading-relaxed">
            {startup.description || "No description provided yet."}
          </p>
        </CardContent>
      </Card>
  
      {/* Financial Overview */}
      <Card className="bg-gray-800 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-400" />
            Financial Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Funding Round</p>
              <p className="text-white font-semibold capitalize">{startup.funding_round?.replace('-', ' ') || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Runway</p>
              <p className="text-white font-semibold">{startup.runway_months || 0} months</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Total Funding</p>
              <p className="text-white font-semibold text-lg">{formatCurrency(startup.funding_amount)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Valuation</p>
              <p className="text-white font-semibold text-lg">{formatCurrency(startup.valuation)}</p>
            </div>
          </div>
  
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Annual Revenue</p>
              <p className="text-white font-semibold">{formatCurrency(startup.revenue)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Monthly Burn</p>
              <p className="text-white font-semibold">{formatCurrency(startup.burn_rate)}</p>
            </div>
          </div>
  
          {startup.financial_notes && (
            <div>
              <p className="text-sm text-gray-400 mb-2">Financial Notes</p>
              <p className="text-gray-300 text-sm">{startup.financial_notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
  
  
// Gamified Stats Overview
const GamifiedStatsOverview = ({ startup, stats, formatCurrency }) => {
  const gamifiedStats = [
    {
      label: "Team Level",
      value: Math.floor((stats?.member_count || 1) / 2) + 1,
      icon: Users,
      progress: ((stats?.member_count || 1) % 2) * 50,
      color: "from-blue-500 to-cyan-500",
      description: "Growth Stage"
    },
    {
      label: "Engagement XP",
      value: (stats?.views || 0) * 10,
      icon: TrendingUp,
      progress: Math.min(((stats?.views || 0) * 10) % 1000, 100),
      color: "from-green-500 to-emerald-500",
      description: "Active Community"
    },
    {
      label: "Progress Score",
      value: Math.floor((startup.valuation / 1000000) * 100),
      icon: Target,
      progress: Math.min((startup.valuation / 1000000) * 10, 100),
      color: "from-purple-500 to-violet-500",
      description: "Milestone Tracker"
    },
    {
      label: "Achievements",
      value: Math.floor((stats?.member_count || 0) / 3) + (startup.funding_amount > 0 ? 1 : 0),
      icon: Trophy,
      progress: 100,
      color: "from-orange-500 to-red-500",
      description: "Badges Unlocked"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {gamifiedStats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 backdrop-blur-sm overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-black/20 text-gray-300 border-gray-600">
                  Lvl {stat.value}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-white">{stat.value}</span>
                  <span className="text-sm text-gray-400">{stat.label}</span>
                </div>
                <Progress value={stat.progress} className="h-2 bg-gray-700" />
                <p className="text-xs text-gray-400">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};

// Project Goals Section
const ProjectGoalsSection = ({ goals, isCreator }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Project Goals & Milestones</h2>
      {isCreator && (
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Goal
        </Button>
      )}
    </div>

    <div className="grid gap-6">
      {goals.map((goal, index) => (
        <Card key={goal.id} className="bg-gray-800 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                {goal.title}
              </CardTitle>
              <Badge className={
                goal.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                goal.is_on_track ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'
              }>
                {goal.status === 'completed' ? 'Completed' : goal.is_on_track ? 'On Track' : 'Needs Attention'}
              </Badge>
            </div>
            <CardDescription className="text-gray-400">
              {goal.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400">Progress</span>
                <span className="text-white font-medium">{goal.progress_percentage}%</span>
              </div>
              <Progress value={goal.progress_percentage} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Milestones: </span>
                <span className="text-white">{goal.milestones_completed}/{goal.milestones_total}</span>
              </div>
              <div>
                <span className="text-gray-400">Next: </span>
                <span className="text-white">{goal.next_milestone}</span>
              </div>
            </div>

            {/* Milestones Accordion */}
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="milestones">
                <AccordionTrigger className="text-gray-400 hover:text-white">
                  View Milestones ({goal.milestones.length})
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {goal.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-700/50">
                        {milestone.is_completed ? (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        ) : (
                          <Clock className="w-4 h-4 text-yellow-400" />
                        )}
                        <span className={`flex-1 ${milestone.is_completed ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {milestone.title}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          #{milestone.order}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
          <CardFooter className="flex justify-between">
            <div className="text-sm text-gray-400">
              Due: {goal.target_date.toLocaleDateString()}
            </div>
            {isCreator && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <Settings className="w-3 h-3 mr-1" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                  <PlayCircle className="w-3 h-3 mr-1" />
                  Update
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  </div>
);

// Calendar Section
const CalendarSection = ({ events, isCreator }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Upcoming Events</h2>
      {isCreator && (
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Event
        </Button>
      )}
    </div>

    <div className="grid gap-4">
      {events.map((event, index) => (
        <Card key={event.id} className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-start gap-4">
              <div 
                className="w-3 h-16 rounded-full"
                style={{ backgroundColor: event.color }}
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-white font-semibold">{event.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{event.description}</p>
                  </div>
                  <Badge className="bg-gray-700 text-gray-300">
                    {event.category}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                  <Clock className="w-4 h-4" />
                  <span>{event.start_date.toLocaleDateString()} • {event.start_date.toLocaleTimeString()}</span>
                  {event.end_date && (
                    <>
                      <span>→</span>
                      <span>{event.end_date.toLocaleTimeString()}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Updated Team Section with Avatar Group
const TeamSection = ({ members,onJoinClick, isCreator, onRemoveMember }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Team Members</h2>
      {isCreator && (
        <Button onClick={onJoinClick} className="bg-blue-600 hover:bg-blue-700">
          <UserPlus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      )}
    </div>

    {/* Avatar Group */}
    {members.length > 0 && (
  <Card className="bg-gray-800 border-gray-700">
    <CardHeader>
      <CardTitle className="text-white text-lg">Team Overview</CardTitle>
    </CardHeader>
    <CardContent>
      <AvatarGroup variant="stack" size={48} animate={true} className="justify-start">
        {members.slice(0, 6).map((member) => (
          <TooltipProvider key={member.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="border-2 border-gray-700 hover:border-blue-500 transition-colors cursor-pointer">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-semibold">
                    {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top" arrowColor="bg-gray-500 fill-gray-500"  className="bg-gray-500 border-gray-700 text-white">
                <p className="font-semibold">{member.firstName} {member.lastName}</p>
                <p className="text-gray-300 text-sm">{member.role}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        {members.length > 6 && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="border-2 border-gray-700 cursor-pointer">
                  <AvatarFallback className="bg-gray-600 text-gray-300 font-semibold">
                    +{members.length - 6}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="top" className="bg-gray-800 border-gray-700 text-white">
                <p>{members.length - 6} more members</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </AvatarGroup>
    </CardContent>
  </Card>
)}

    {/* Members Grid */}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {members.map((member, index) => (
        <Card key={member.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {member.firstName?.charAt(0)}{member.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-white font-semibold">
                    {member.firstName} {member.lastName}
                  </h3>
                  <Badge variant="outline" className="text-xs bg-blue-500/10 text-blue-400 border-blue-500/30">
                    {member.role}
                  </Badge>
                </div>
              </div>
              {isCreator && member.role !== 'founder' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveMember(member.id)}
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>
            <div className="text-xs text-gray-400 mt-2">
              Joined {new Date(member.joinedAt).toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Updated Documents Section
const DocumentsSection = ({onJoinClick, documents, isCreator, onDownload, onDelete }) => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold text-white">Documents</h2>
      {isCreator && (
        <Button onClick={onJoinClick} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Upload Document
        </Button>
      )}
    </div>

    <div className="grid gap-4">
      {documents.map((doc, index) => (
        <Card key={doc.id} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-white font-medium">{doc.filename}</h3>
                  <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                    <span className="capitalize">{doc.document_type}</span>
                    <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                    <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownload(doc.id, doc.filename)}
                  className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                >
                  <Download className="w-4 h-4" />
                </Button>
                {isCreator && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(doc.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

// Add the Trophy icon component
const Trophy = (props) => (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
  

// Tech Stack Section Component
const TechStackSection = ({ startup }) => (
    <motion.section
      initial={{ y: 30, opacity: 0 }}
      whileInView={{ y: 0, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      <Card className="bg-gray-800 border-gray-700 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Code className="w-5 h-5 text-blue-400" />
            Technology Stack
          </CardTitle>
        </CardHeader>
        <CardContent>
          {startup.tech_stack && startup.tech_stack.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {startup.tech_stack.map((tech, index) => (
                <motion.div
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                >
                  <Badge 
                    variant="outline" 
                    className="px-4 py-2 text-sm border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all"
                  >
                    <Code className="w-4 h-4 mr-2" />
                    {tech}
                  </Badge>
                </motion.div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 italic">No technologies specified yet.</p>
          )}
        </CardContent>
      </Card>
    </motion.section>
  );
  
// CTA Section Component
const CTASection = ({ onJoinClick }) => (
  <motion.section
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 rounded-3xl p-12 text-center"
  >
    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIi8+PC9nPjwvc3ZnPg==')] opacity-20" />
    
    <div className="relative">
      <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
        Ready to Join the Journey?
      </h2>
      <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
        Be part of an innovative team that's shaping the future.
      </p>
      <Button 
        onClick={onJoinClick}
        size="lg"
        className="bg-white text-blue-700 hover:bg-white/90 shadow-xl"
      >
        <Mail className="w-5 h-5 mr-2" />
        Send Join Request
      </Button>
    </div>
  </motion.section>
);

// Modal Components
const JoinRequestModal = ({ isOpen, onClose, startupName }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    portfolio: "",
    linkedin: "",
    github: ""
  });

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onClose();
    // Here you would typically send the join request to your backend
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent style={{zIndex:99999999999999}} className="max-w-2xl bg-gray-800 border-gray-700 mt-3">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Join {startupName}</DialogTitle>
          <DialogDescription className="text-gray-400">
            Tell us about yourself and why you'd like to join our team.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-5 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Full Name *
              </label>
              <Input
                required
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="John Doe"
                className="h-11 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 block">
                Email *
              </label>
              <Input
                required
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="john@example.com"
                className="h-11 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Why do you want to join us? *
            </label>
            <Textarea
              required
              value={formData.message}
              onChange={(e) => handleChange('message', e.target.value)}
              className="w-full min-h-[120px] bg-gray-700 border-gray-600 text-white resize-none"
              placeholder="Tell us about your interest in our company and what you'd bring to the team..."
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-300 mb-2 block">
              Portfolio / Website
            </label>
            <Input
              value={formData.portfolio}
              onChange={(e) => handleChange('portfolio', e.target.value)}
              placeholder="https://yourportfolio.com"
              className="h-11 bg-gray-700 border-gray-600 text-white"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Linkedin className="w-4 h-4" />
                LinkedIn Profile
              </label>
              <Input
                value={formData.linkedin}
                onChange={(e) => handleChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
                className="h-11 bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-300 mb-2 flex items-center gap-2">
                <Github className="w-4 h-4" />
                GitHub Profile
              </label>
              <Input
                value={formData.github}
                onChange={(e) => handleChange('github', e.target.value)}
                placeholder="github.com/johndoe"
                className="h-11 bg-gray-700 border-gray-600 text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-gray-600 text-black"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              <Mail className="w-4 h-4 mr-2" />
              Send Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const AddMemberModal = ({ isOpen, onClose, onSubmit, formData, onFormChange }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md bg-gray-800 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Add Team Member</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm text-gray-300 mb-2 block">First Name</label>
            <Input
              required
              value={formData.first_name}
              onChange={(e) => onFormChange({ ...formData, first_name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Last Name</label>
            <Input
              required
              value={formData.last_name}
              onChange={(e) => onFormChange({ ...formData, last_name: e.target.value })}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">User ID</label>
          <Input
            required
            type="number"
            value={formData.user_id}
            onChange={(e) => onFormChange({ ...formData, user_id: e.target.value })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Role</label>
          <Select value={formData.role} onValueChange={(value) => onFormChange({ ...formData, role: value })}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="member" className="text-white">Member</SelectItem>
              <SelectItem value="founder" className="text-white">Founder</SelectItem>
              <SelectItem value="advisor" className="text-white">Advisor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-black">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Add Member
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

const UploadDocumentModal = ({ isOpen, onClose, onSubmit, formData, onFormChange }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md bg-gray-800 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white">Upload Document</DialogTitle>
      </DialogHeader>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Document</label>
          <Input
            type="file"
            onChange={(e) => onFormChange({ ...formData, document: e.target.files[0] })}
            className="bg-gray-700 border-gray-600 text-white"
          />
        </div>
        <div>
          <label className="text-sm text-gray-300 mb-2 block">Document Type</label>
          <Select value={formData.document_type} onValueChange={(value) => onFormChange({ ...formData, document_type: value })}>
            <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="general" className="text-white">General</SelectItem>
              <SelectItem value="business_plan" className="text-white">Business Plan</SelectItem>
              <SelectItem value="pitch_deck" className="text-white">Pitch Deck</SelectItem>
              <SelectItem value="financial" className="text-white">Financial</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-black">
            Cancel
          </Button>
          <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
            Upload
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
);

const DeleteStartupModal = ({ isOpen, onClose, onConfirm, startupName }) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent className="max-w-md bg-gray-800 border-gray-700">
      <DialogHeader>
        <DialogTitle className="text-white text-red-400">Delete Startup</DialogTitle>
        <DialogDescription className="text-gray-400">
          Are you sure you want to delete "{startupName}"? This action cannot be undone and will permanently remove all associated data.
        </DialogDescription>
      </DialogHeader>
      <div className="flex gap-3 pt-4">
        <Button variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-black">
          Cancel
        </Button>
        <Button variant="destructive" onClick={onConfirm} className="flex-1">
          Delete Startup
        </Button>
      </div>
    </DialogContent>
  </Dialog>
);

// Skeleton Loading Component
const StartupDetailSkeleton = () => (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 animate-pulse">
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-gray-800/80 border-b border-gray-700 h-16"></nav>
      
      {/* Hero Skeleton */}
      <div className="bg-gray-800 h-64"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-5 gap-2 mb-8">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-700 rounded-xl"></div>
          ))}
        </div>
        
        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="h-12 w-12 bg-gray-700 rounded-xl mb-3"></div>
              <div className="h-8 bg-gray-700 rounded w-3/4 mb-2"></div>
              <div className="h-2 bg-gray-700 rounded w-full mb-1"></div>
              <div className="h-4 bg-gray-700 rounded w-1/2"></div>
            </div>
          ))}
        </div>
  
        {/* Content Skeleton */}
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="p-6 bg-gray-800 rounded-xl border border-gray-700">
              <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-700 rounded w-5/6"></div>
                <div className="h-4 bg-gray-700 rounded w-4/6"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

export default StartupDetailPage;