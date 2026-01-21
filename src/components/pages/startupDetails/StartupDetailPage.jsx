import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Users, Calendar, TrendingUp, Heart, Share2, ChevronRight, Home, Trash2, UserPlus, BarChart3,
  FileText, Target, MessageSquare,CheckCircle2Icon,XIcon
} from 'lucide-react';
import {
    Alert,
    AlertDescription,
    AlertTitle,
  } from "../../ui/alert"
  
// shadcn/ui components
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Card, CardContent, CardHeader} from '../../ui/card';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { Progress } from '../../ui/progress';
import ShinyText from '../../ui/ShinyText';

import { useSelector } from 'react-redux';

import { calendarEventsAPI, projectGoalsAPI, startupsAPI } from '@/utils/APIs/startupsAPI';
import { toast } from 'react-toastify';
import SendJoinRequestModal from './modals/SendJoinRequestModal';
import ManageJoinRequestsModal from './modals/ManageJoinRequestsModal';
import ProjectGoalsSection from './sections/ProjectGoalsSection';
import CalendarSection from './sections/CalendarSection';
import DeleteStartupModal from './modals/DeleteStartup';
import UploadDocumentModal from './modals/UploadDocument';
import AddMemberModal from './modals/AddMember';
import DocumentsSection from './sections/DocumentsSection';
import TeamSection from './sections/TeamSection';
import DescriptionSection from './sections/DescriptionSection';
import TechStackSection from './sections/TechStackSection';
import HeroSection from './sections/HeroSection';
import StartupDetailSkeleton from './StartupDetailsSkeleton';
import AddEventModal from './modals/AddEvent';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

/**
 * ManageJoinRequestsModal - For FOUNDERS/CREATORS to manage join requests
 * 
 * This modal displays pending join requests from users who want to join the startup.
 * The founder/creator can accept or reject each request.
 */


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
  const [isSendJoinRequestModalOpen, setIsSendJoinRequestModalOpen] = useState(false);
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [isDeleteStartupModalOpen, setIsDeleteStartupModalOpen] = useState(false);
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  
  const [alertDescription, setAlertDescription] = useState("");
  const [alertTitle, setAlertTitle] = useState("");
  const [alertVariant, setAlertVariant] = useState("success");
  
  const [showAlert, setShowAlert] = useState(false);
  
  const [projectGoals, setProjectGoals] = useState([]);
  const [calendarEvents, setCalendarEvents] = useState([]);
  
  const [isCreator, setIsCreator] = useState(false);
  
  const {user,access_token,refreshToken} = useSelector((state) => state.auth);

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

  const [joinRequests, setJoinRequests] = useState([]);
  const joinRequestCountRef = useRef(0);

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
        per_page: 100,
        page: 1,
        include_milestones: true
      }
      const [startupResult, membersResult, documentsResult, statsResult, goalsResult, eventsResult] = await Promise.all([
        startupsAPI.getById(id, token).catch(err => ({ success: false, error: err })),
        startupsAPI.getMembers(id, token, args).catch(err => ({ success: false, error: err })),
        startupsAPI.getDocuments(id, token).catch(err => ({ success: false, error: err })),
        startupsAPI.getStats(id, token).catch(err => ({ success: false, error: err })),
        projectGoalsAPI.getAll(args, token).catch(err => ({ success: false, error: err })),
        calendarEventsAPI.getAll(args, token).catch(err => ({ success: false, error: err })),
      ]);
      const startupData = startupResult.success ? startupResult : { success: false, data: null };
      const membersData = membersResult.success ? membersResult : { success: false, data: { members: [] } };
      const documentsData = documentsResult.success ? documentsResult : { success: false, data: { documents: [] } };
      const statsData = statsResult.success ? statsResult : { success: false, data: { stats: null } };
      const goalsData = goalsResult.success ? goalsResult : { success: false, data: { project_goals: [] } };
      const eventsData = eventsResult.success ? eventsResult : { success: false, data: { events: [] } };

      if (startupData.success) setStartup(startupData.data.startup);
      if (membersData.success) {
        console.log('👥 Members fetched:', membersData.data.members);
        setMembers(membersData.data.members);
      }
      if (documentsData.success) setDocuments(documentsData.data.documents);
      if (statsData.success) setStats(statsData.data.stats || {});
      if (goalsData.success) setProjectGoals(goalsData.data.project_goals || []);
      if (eventsData.success) setCalendarEvents(eventsData.data.events || []);
    } catch (error) {
      console.error('Error fetching startup data:', error);
      toast.error('Error loading startup data');

    } finally {
      setLoading(false);
    }
  };

  const fetchJoinRequests = useCallback(async () => {
    console.log('🚀 fetchJoinRequests called. Checking conditions...');
    console.log('  isCreator:', isCreator);
    console.log('  access_token:', access_token ? '✅ Present' : '❌ Missing');
    console.log('  id:', id);
    
    if (!isCreator || !access_token || !id) {
      console.log('⏭️ Skipping fetchJoinRequests:', { isCreator, hasToken: !!access_token, id });
      setJoinRequests([]);
      return;
    }
    try {
      console.log('📡 Fetching join requests for startup:', id, { isCreator, hasToken: !!access_token });
      const response = await startupsAPI.getJoinRequests(id, { status: 'pending', per_page: 20 });
      console.log('📦 Raw API response:', response);
      console.log('📦 Response type:', typeof response, 'Is array?', Array.isArray(response));
      console.log('📦 Response keys:', Object.keys(response || {}));
      
      // Handle multiple possible response structures from backend
      // The API returns response.data.data which should be { join_requests: [...], ... }
      let pending = [];
      if (Array.isArray(response)) {
        console.log('✅ Response is direct array');
        pending = response; // Direct array
      } else if (response?.join_requests && Array.isArray(response.join_requests)) {
        console.log('✅ Found join_requests key with array:', response.join_requests.length, 'items');
        pending = response.join_requests; // Wrapped in join_requests key
      } else if (response?.requests && Array.isArray(response.requests)) {
        console.log('✅ Found requests key with array:', response.requests.length, 'items');
        pending = response.requests; // Wrapped in requests key
      } else {
        console.warn('⚠️ Could not find requests in response. Full response:', JSON.stringify(response, null, 2));
      }
      console.log('✅ Join requests processed:', pending.length, 'items');
      setJoinRequests(pending);
    } catch (error) {
      console.error('❌ Failed to load join requests:', error);
      console.error('  Error message:', error.message);
      console.error('  Error response:', error.response?.data);
      setJoinRequests([]);
    }
  }, [isCreator, access_token, id]);


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
    formData.append('visible_by', documentForm.visible_by || 'private'); 
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }
    try {
      const response = await startupsAPI.uploadDocument(id, formData, access_token);
      
      if (response.success) {
        toast.success('Document uploaded successfully');
        setIsUploadDocModalOpen(false);
        setDocumentForm({ document: null, document_type: 'general' });
        fetchStartupData();
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch (error) {
      toast.error('Error uploading document');
    }
  };

  const handleDocumentDelete = async (documentId) => {

    try {
      const response = await startupsAPI.deleteDocument(id, documentId, access_token);


      
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
      const response = await startupsAPI.downloadDocument(id, documentId, access_token);
      const blob = response.data; // response.data is already a Blob
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast.error('Error downloading document');
      console.error('Error downloading document:', error);
    }
  };

  // Member handlers
  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      const response = await startupsAPI.addMember(id, memberForm, access_token);


      
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

  const handleRemoveMember = async (e, memberId) => {
    e.stopPropagation();
    e.preventDefault()
    try {
      const response = await startupsAPI.removeMember(id, memberId, access_token);
      console.log("Response:", response);
      
      if (response.success) {
        toast.success('Member removed successfully');
        setMembers(prevMembers => prevMembers.filter(m => m.id !== memberId));
      } else {
        throw new Error('Failed to remove member');
      }
    } catch (error) {
      toast.error('Error removing member');
    }
  };
  
  const handleAcceptJoinRequest = async (request) => {
    const requestId = request?.id || request?.request_id;
    if (!requestId) return;
    try {
      console.log('✅ Accepting join request:', requestId, 'from:', request?.full_name || `${request?.first_name} ${request?.last_name}`);
      await startupsAPI.acceptJoinRequest(id, requestId);
      toast.success(`${request?.full_name || `${request?.first_name ?? ''} ${request?.last_name ?? ''}`.trim() || 'Member'} has been added.`);
      // Remove from list immediately for better UX
      setJoinRequests(prev => prev.filter(r => (r.id || r.request_id) !== requestId));
      // Refresh data to ensure consistency
      fetchJoinRequests();
      fetchStartupData();
    } catch (error) {
      console.error('❌ Accept join request failed', error);
      toast.error('Unable to accept the request right now.');
    }
  };

  const handleRejectJoinRequest = async (request) => {
    const requestId = request?.id || request?.request_id;
    if (!requestId) return;
    try {
      console.log('🚫 Rejecting join request:', requestId, 'from:', request?.full_name || `${request?.first_name} ${request?.last_name}`);
      await startupsAPI.rejectJoinRequest(id, requestId);
      toast.info(`Join request from ${request?.full_name || `${request?.first_name} ${request?.last_name}`} has been rejected.`);
      // Remove from list immediately for better UX
      setJoinRequests(prev => prev.filter(r => (r.id || r.request_id) !== requestId));
      // Refresh data to ensure consistency
      fetchJoinRequests();
    } catch (error) {
      console.error('❌ Reject join request failed', error);
      toast.error('Unable to reject the request right now.');
    }
  };
  useEffect(() => {
    if (user && startup) {
      // Try to get userId from different possible fields
      const userId = user?.id || user?.userId || user?.user_id;
      
      // Check 1: Is user the startup creator?
      const isStartupCreator = startup?.creator_id === userId;
      
      // Check 2: Is user a member with creator/founder role?
      const isMemberWithRole = members.find(m => m.userId === userId && ['creator', 'founder'].includes(m.role));
    
      // User is creator if they are the startup creator OR have member founder role
      const isCreatorUser = isStartupCreator || !!isMemberWithRole;
      setIsCreator(isCreatorUser);
    } else {
      setIsCreator(false);
    }
  }, [members, user, startup]);

  useEffect(() => {
    if (isCreator) {
      fetchJoinRequests();
    } else {
      setJoinRequests([]);
    }
  }, [isCreator, fetchJoinRequests]);

  // Also fetch when modal opens
  useEffect(() => {
    if (isJoinModalOpen && isCreator && access_token) {
      fetchJoinRequests();
    }
  }, [isJoinModalOpen, access_token]);

  useEffect(() => {
    if (joinRequests.length > 0 && joinRequests.length > joinRequestCountRef.current) {
      setAlertTitle('Pending Join Requests');
      setAlertDescription(`You have ${joinRequests.length} pending team request${joinRequests.length > 1 ? 's' : ''}.`);
      setAlertVariant('warning');
      setShowAlert(true);
    }
    joinRequestCountRef.current = joinRequests.length;
  }, [joinRequests.length]);
  // Delete startup
  const handleDeleteStartup = async () => {
    try {
      const response = await startupsAPI.delete(id, access_token);

      
      if (response.success) {
        toast.success('Startup deleted successfully');
        navigate('/discover');
      } 
    } catch (error) {
      toast.error('Error deleting startup');
      console.error('Error deleting startup:', error);
    }
  };
  const handleCreateEvent = async (eventData) => {
    try {
      const body = {
        ...eventData,
        startup_id: id,
        user_id: user?.id || user?.userId || user?.user_id,
      }
      const response = await calendarEventsAPI.create(body);
      
      if (response.success || response.event) {
        toast.success('Event created successfully');
        setIsAddEventModalOpen(false);
        setCalendarEvents([...calendarEvents, response.data?.event || response.event]);
      } else {
        throw new Error(response.error || 'Failed to create event');
      }
    } catch (error) {
      toast.error('Error creating event');
      console.error('Error creating event:', error);
    }
  }
  const handleEditEvent = async (updatedData) => {
    // Implement event editing logic here
  }
  const handleDeleteEvent = async (eventId) => {
    try {
      const response = await calendarEventsAPI.delete(eventId);
      if (response.success) {
        toast.success('Event deleted successfully');
        setCalendarEvents(calendarEvents.filter(event => event.id !== eventId));
      } else {
        throw new Error('Failed to delete event');
      }
    } catch (error) {
      toast.error('Error deleting event');
      console.error('Error deleting event:', error);
    }
    // Implement event deletion logic here
  }
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
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap items-center justify-evenly gap-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/discover-startups')}
                className="text-gray-300 hover:text-white cursor-pointer bg-transparent hover:bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Discover
              </Button>
              
              <div className="hidden sm:flex flex-wrap items-center gap-2 text-sm text-gray-400">
                <Home className="w-4 h-4" />
                <ChevronRight className="w-3 h-3" />
                <span className="text-white font-medium">{startup.name}</span>
              </div>
            </div>
            
            <div className="flex flex-wrap h-auto items-center gap-2">
              {isCreator && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsJoinModalOpen(true)}
                    className="relative text-gray-300 hover:text-white"
                  >
                    <MessageSquare className="w-4 h-4 mr-1" />
                    Join Requests
                    {joinRequests.length > 0 && (
                      <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-semibold text-white bg-red-500 rounded-full">
                        {joinRequests.length}
                      </span>
                    )}
                  </Button>
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
        onJoinClick={() => isCreator ? setIsJoinModalOpen(true) : setIsSendJoinRequestModalOpen(true)}
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
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-5 bg-gray-800/50 p-1 rounded-xl backdrop-blur-sm">
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
                  text="Project Goals" 
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
            <GamifiedStatsOverview startup={startup} stats={stats} formatCurrency={formatCurrency} goals={projectGoals} />
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
              setGoals={setProjectGoals}
              startupId={id}
              teamMembers={members}
            />
          </TabsContent>

          {/* Calendar Tab */}
          <TabsContent value="calendar">
            <CalendarSection
              events={calendarEvents}
              isCreator={isCreator}
              onCreateEvent={() => setIsAddEventModalOpen(true)}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}

            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Modals */}

      {!isCreator && (
        <SendJoinRequestModal
          isOpen={isSendJoinRequestModalOpen}
          onClose={() => setIsSendJoinRequestModalOpen(false)}
          startupId={id}
          startupName={startup?.name || ''}
          onSuccess={() => {
            setIsSendJoinRequestModalOpen(false);
            toast.success('Join request sent successfully!');
          }}
        />
      )}
      
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
        <ManageJoinRequestsModal 
          isOpen={isJoinModalOpen}
          onClose={() => setIsJoinModalOpen(false)}
          startupName={startup?.name || 'Your Startup'}
          founderName={user?.first_name && user?.last_name ? `${user.first_name} ${user.last_name}` : user?.email || 'You'}
          joinRequests={joinRequests}
          loading={loading}
          onAccept={handleAcceptJoinRequest}
          onReject={handleRejectJoinRequest}
        />
        <AddEventModal
          isOpen={isAddEventModalOpen}
          onClose={() => setIsAddEventModalOpen(false)}
          onCreate={handleCreateEvent}
        />
      </>
      }
      
      {showAlert && (
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




  
// Gamified Stats Overview
const GamifiedStatsOverview = ({ goals, startup, stats, formatCurrency }) => {
  const milestoneProgress = useMemo(() => {
    console.log(goals);
    if (goals.length === 0) return 0;
    console.log("Goals:", goals);
    let progress = 0;
    const totalMilestonesCompleted = goals.reduce((count, goal) => {
      return count + goal.milestones_completed
    }, 0);
    const totalMilestones = goals.reduce((count, goal) => {
      return count + goal.milestones_total
    }, 0);
    progress = totalMilestones === 0 ? 0 : Math.floor((totalMilestonesCompleted / totalMilestones) * 100);
    console.log("Calculated milestone progress:", progress);
    return progress
  }, [goals]);
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
      value: milestoneProgress,
      icon: Target,
      progress: milestoneProgress,
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



export default StartupDetailPage;