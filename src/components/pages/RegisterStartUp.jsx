"use client";

import { useState, useRef, useEffect } from "react";
import { Upload, Plus, X, ChevronRight, Minus,ChevronLeft, FileText, Building2, MapPin, Globe, Users, Rocket, CheckCircle, Image, AlertCircle, User, Mail, Eye, Star, Target, Trophy, Zap, Lightbulb, TrendingUp, DollarSign, PieChart, Target as TargetIcon, Calendar, BarChart3, InfoIcon, Code } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { Progress } from "../ui/progress";
import { Alert, AlertDescription } from "../ui/alert";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { useDispatch, useSelector } from "react-redux";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"; 
export default function RegisterStartUp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    industry: "",
    location: "",
    description: "",
    stage: "",
    positions: 0,
    roles: {},
    creator_first_name: "",
    creator_last_name: "",
    creator_email: "",
    
    revenue: 0,
    funding_amount: 0,
    funding_round: "pre-seed",
    burn_rate: 0,
    runway_months: 0,
    valuation: 0,
    financial_notes: "",
    
    tech_stack: []
  });

  const [roles, setRoles] = useState([{ title: "", roleType: "Full Time" }]);
  const [logoFile, setLogoFile] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [xpPoints, setXpPoints] = useState(0);
  const [techStack, setTechStack] = useState([]);
  const [techInput, setTechInput] = useState("");
  const { user, access_token } = useSelector((state) => state.auth);

  const [uploadedDocuments, setUploadedDocuments] = useState([]);

  const logoInputRef = useRef(null);
  const bannerInputRef = useRef(null);

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", 
    "Retail", "Manufacturing", "Entertainment", "Real Estate",
    "Transportation", "Energy", "Agriculture", "Other"
  ];

  const fundingRounds = [
    { value: "pre-seed", label: "Pre-Seed", description: "Idea stage, friends & family" },
    { value: "seed", label: "Seed", description: "Product development" },
    { value: "series-a", label: "Series A", description: "Scaling operations" },
    { value: "series-b", label: "Series B", description: "Market expansion" },
    { value: "series-c", label: "Series C+", description: "Growth & acquisitions" },
    { value: "bootstrapped", label: "Bootstrapped", description: "Self-funded" }
  ];

  const roleTypes = ["Full Time", "Part Time", "Contract", "Intern", "Volunteer"];
  
  const startupStages = [
    { 
      value: "idea", 
      icon: <img src="/idea.png" className="w-14" alt="Concept phase"/>, 
      label: "Idea", 
      description: "Concept phase",
      tooltip: "Just an idea on paper. No product built yet. Looking for co-founders and initial validation."
    },
    { 
      value: "seed", 
      icon: <img src="/seed.png" className="w-14" alt="Initial funding"/>, 
      label: "Seed", 
      description: "Initial funding",
      tooltip: "Secured initial funding. Building MVP. Small team forming. Early customer validation."
    },
    { 
      value: "early", 
      icon: <img src="/rocket.png" className="w-14" alt="Product development"/>, 
      label: "Early", 
      description: "Product development",
      tooltip: "MVP launched. First customers onboarded. Product-market fit exploration. Growing team."
    },
    { 
      value: "growth", 
      icon: <img src="/progress.png" className="w-14" alt="Scaling operations"/>, 
      label: "Growth", 
      description: "Scaling operations",
      tooltip: "Strong product-market fit. Rapid user growth. Scaling team and operations. Series A/B funding."
    },
    { 
      value: "scale", 
      icon: <img src="/thounder.png" className="w-14" alt="Market expansion"/>, 
      label: "Scale", 
      description: "Market expansion",
      tooltip: "Established market position. Expanding to new markets. Large team. Focus on optimization and growth."
    }
  ];
  
  const popularTechnologies = [
    "JavaScript", "TypeScript", "Python", "Java", "C#", "PHP", "Ruby", "Go", "Rust",
    "React", "Vue", "Angular", "Next.js", "Nuxt.js", "Svelte",
    "Node.js", "Express", "Django", "Flask", "Spring", "Laravel", "Ruby on Rails",
    "PostgreSQL", "MySQL", "MongoDB", "Redis", "Elasticsearch",
    "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "Terraform",
    "GraphQL", "REST API", "WebSocket", "gRPC",
    "React Native", "Flutter", "Swift", "Kotlin",
    "Machine Learning", "AI", "Blockchain", "IoT"
  ];
  
  //! TECH STACK
  const addTech = (tech) => {
    if (tech && !techStack.includes(tech) && techStack.length < 15) {
      setTechStack([...techStack, tech]);
      setTechInput("");
    }
  };
  
  const removeTech = (techToRemove) => {
    setTechStack(techStack.filter(tech => tech !== techToRemove));
  };
  
  const handleTechInputChange = (e) => {
    setTechInput(e.target.value);
  };
  
  const handleTechInputKeyDown = (e) => {
    if (e.key === 'Enter' && techInput.trim()) {
      e.preventDefault();
      addTech(techInput.trim());
    }
  };
  
  //! DOCUMENTS
  const handleDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedDocuments(prev => [...prev, ...files]);
  };
  
  const removeDocument = (index) => {
    setUploadedDocuments(prev => prev.filter((_, i) => i !== index));
  };
  
  //! Show notification
  const showNotification = (type, message) => {
    setNotification({ show: true, type, message });
    setTimeout(() => setNotification({ show: false, type: '', message: '' }), 5000);
  };

  //! Get current user data from localStorage
  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setFormData(prev => ({
        ...prev,
        creator_first_name: user.first_name || user.firstName || "",
        creator_last_name: user.last_name || user.lastName || "",
        creator_email: user.email || ""
      }));
    }
  }, []);

  //! Add XP points when completing steps
  useEffect(() => {
    if (currentStep > 1) {
      setXpPoints(prev => prev + 150);
    }
  }, [currentStep]);

  //! Step validation
  const validateStep = (step) => {
    switch (step) {
      case 1:
        if (!formData.name.trim()) {
          showNotification('error', 'Please enter a startup name');
          return false;
        }
        if (!formData.industry) {
          showNotification('error', 'Please select an industry');
          return false;
        }
        if (!formData.location.trim()) {
          showNotification('error', 'Please enter a location');
          return false;
        }
        return true;
      case 2:
        if (!formData.creator_first_name.trim()) {
          showNotification('error', 'Please enter your first name');
          return false;
        }
        if (!formData.creator_last_name.trim()) {
          showNotification('error', 'Please enter your last name');
          return false;
        }
        if (!formData.creator_email.trim()) {
          showNotification('error', 'Please enter your email');
          return false;
        }
        return true;
      case 3:
        if (!formData.description.trim()) {
          showNotification('error', 'Please enter a startup description');
          return false;
        }
        if (!formData.stage) {
          showNotification('error', 'Please select a startup stage');
          return false;
        }
        return true;
      case 4:
        // Financial step - all fields are optional but should be validated
        if (formData.burn_rate < 0) {
          showNotification('error', 'Burn rate cannot be negative');
          return false;
        }
        if (formData.runway_months < 0) {
          showNotification('error', 'Runway months cannot be negative');
          return false;
        }
        return true;
      case 5:
        if (!logoFile) {
          showNotification('error', 'Please upload a company logo');
          return false;
        }
        return true;
      case 6:
        // Documents step - all fields are optional, no validation needed
        return true;
      case 7:
        const invalidRoles = roles.filter(role => !role.title.trim() || !role.roleType);
        if (invalidRoles.length > 0) {
          showNotification('error', 'Please fill in all role titles and types');
          return false;
        }
        
        if (techStack.length === 0) {
          showNotification('warning', 'Consider adding your tech stack to attract relevant developers');
          // Don't return false - let them proceed without tech stack
        }
        
        return true;
      default:
        return true;
    }
  };
  

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFinancialChange = (field, value) => {
    // Convert to number for financial fields
    const numValue = field.includes('notes') ? value : parseFloat(value) || 0;
    handleInputChange(field, numValue);
  };

  const addRole = () => {
    if (roles.length < 10) {
      setRoles([...roles, { title: "", roleType: "Full Time" }]);
    } else {
      showNotification('warning', 'You can add up to 10 roles maximum');
    }
  };

  const removeRole = (index) => {
    if (roles.length > 1) {
      setRoles(roles.filter((_, i) => i !== index));
    }
  };

  const updateRole = (index, field, value) => {
    const newRoles = [...roles];
    newRoles[index][field] = value;
    setRoles(newRoles);
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      if (type === "logo") setLogoFile(file);
      else setBannerFile(file);
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 9));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(8)) return;
    const token = access_token;
    if (!token) return;

    setIsSubmitting(true);
    
    try {
      // Get current user ID from localStorage
      const userData = localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      const creator_id = user?.id || user?.userId || 11;

      if (!creator_id) {
        throw new Error('User not authenticated');
      }

      // Convert roles array to the format expected by backend
      const rolesObject = roles.reduce((acc, role, index) => {
        acc[role.title] = {
          roleType: role.roleType,
          positionsNumber: role.positionsNumber || 0
        };
        return acc;
      }, {});

      // Calculate total positions from all roles
      const totalPositions = roles.reduce((total, role) => total + (parseInt(role.positionsNumber) || 0), 0);

      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("industry", formData.industry);
      submitData.append("location", formData.location);
      submitData.append("description", formData.description);
      submitData.append("stage", formData.stage);
      submitData.append("positions", totalPositions.toString());
      submitData.append("roles", JSON.stringify(rolesObject));
      submitData.append("creator_id", creator_id);
      submitData.append("creator_first_name", formData.creator_first_name);
      submitData.append("creator_last_name", formData.creator_last_name);
      
      // Append financial data
      submitData.append("revenue", formData.revenue.toString());
      submitData.append("funding_amount", formData.funding_amount.toString());
      submitData.append("funding_round", formData.funding_round);
      submitData.append("burn_rate", formData.burn_rate.toString());
      submitData.append("runway_months", formData.runway_months.toString());
      submitData.append("valuation", formData.valuation.toString());
      submitData.append("financial_notes", formData.financial_notes);
      
      submitData.append("tech_stack", JSON.stringify(techStack));
      
      if (logoFile) submitData.append("logo", logoFile);
      if (bannerFile) submitData.append("banner", bannerFile);

      // Append uploaded documents
      uploadedDocuments.forEach((doc, index) => {
        submitData.append("documents", doc);
      });

      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/startups/register`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`,
          // 'Content-Type': 'application/json',
        },
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        showNotification('success', 'Your startup has been registered successfully!');
        setXpPoints(1200); // Complete all XP
        setCurrentStep(9); // Move to completion step
        setFormData({
          name: "",
          industry: "",
          location: "",
          description: "",
          stage: "",
          positions: 0,
          roles: {},
          creator_first_name: "",
          creator_last_name: "",
          creator_email: "",
          
          revenue: 0,
          funding_amount: 0,
          funding_round: "pre-seed",
          burn_rate: 0,
          runway_months: 0,
          valuation: 0,
          financial_notes: "",
          
          tech_stack: []
        })
      } else {
        throw new Error(data.error || data.message || "Registration failed");
      }
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  //! Sidebar content for each step 
  const SidebarContent = () => {
    switch(currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Why This Matters</h3>
            </div>
            <p className="text-gray-300 text-sm">
              A clear company identity helps attract the right talent and investors. 
              Startups with complete profiles get <span className="text-blue-400 font-medium">3x more applications</span>.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Pro Tip</span>
              </div>
              <p className="text-gray-300 text-sm">
                Choose an industry that accurately represents your core business. This helps our algorithm match you with relevant talent.
              </p>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Founder Credibility</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Complete founder profiles build trust with potential team members. 
              Verified founders see <span className="text-blue-400 font-medium">47% higher response rates</span> from applicants.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Best Practice</span>
              </div>
              <p className="text-gray-300 text-sm">
                Use a professional email address that matches your startup domain when possible. This enhances credibility.
              </p>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Rocket className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Stage Selection</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Accurately defining your stage helps match you with candidates who are looking for opportunities at your specific growth phase.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Growth Insight</span>
              </div>
              <p className="text-gray-300 text-sm">
                Early-stage startups typically hire for versatility, while growth-stage companies look for specialized roles.
              </p>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Financial Transparency</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Startups that share financial metrics attract <span className="text-blue-400 font-medium">62% more serious candidates</span> and build investor confidence.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Financial Best Practices</span>
              </div>
              <p className="text-gray-300 text-sm">
                Be transparent about your runway. Candidates appreciate knowing the company's financial health and stability.
              </p>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Image className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Brand Impact</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Startups with professional branding receive <span className="text-blue-400 font-medium">2.8x more engagement</span> from potential hires.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Design Tip</span>
              </div>
              <p className="text-gray-300 text-sm">
                Use high-contrast logos that look good in both light and dark modes. Square aspect ratios work best for profile pictures.
              </p>
            </div>
          </div>
        );
      case 6:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Documentation</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Startups with proper documentation onboard team members <span className="text-blue-400 font-medium">40% faster</span> and build credibility with investors.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Document Strategy</span>
              </div>
              <p className="text-gray-300 text-sm">
                Upload your business plan, pitch deck, or other important documents to showcase your startup's professionalism and preparation.
              </p>
            </div>
          </div>
        );
      case 7:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Team Building</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Clearly defined roles help attract qualified candidates. Startups with detailed role descriptions fill positions <span className="text-blue-400 font-medium">40% faster</span>.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Recruitment Strategy</span>
              </div>
              <p className="text-gray-300 text-sm">
                Mix technical and business roles to show balanced growth. Consider remote positions to access global talent pools.
              </p>
            </div>
          </div>
        );
      case 8:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Final Review</h3>
            </div>
            <p className="text-gray-300 text-sm">
              Take a moment to review all details. Complete and accurate profiles perform significantly better in our matching algorithms.
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-blue-400" />
                <span className="text-white text-sm font-medium">Quality Check</span>
              </div>
              <p className="text-gray-300 text-sm">
                Ensure all information is consistent and professional. This is your chance to make a great first impression on potential team members.
              </p>
            </div>
          </div>
        );
      default:
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-blue-400" />
              <h3 className="font-semibold text-white">Ready to Launch</h3>
            </div>
            <p className="text-gray-300 text-sm">
              You're all set! Your startup profile is now active and visible to potential team members.
            </p>
          </div>
        );
    }
  };
  
  
  //! StepIndicator
  const StepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((step) => (
        <div key={step} className="flex items-center">
          <div className={`flex flex-col items-center ${step < currentStep ? 'text-blue-400' : step === currentStep ? 'text-white' : 'text-gray-500'}`}>
            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
              step < currentStep 
                ? 'bg-blue-400 border-blue-400 text-white shadow-lg shadow-blue-400/30' 
                : step === currentStep 
                ? 'bg-white border-blue-400 text-blue-400 shadow-lg shadow-blue-400/30 animate-pulse' 
                : 'bg-gray-800 border-gray-500 text-gray-500'
            }`}>
              {step < currentStep ? (
                <CheckCircle size={20} className="text-white" />
              ) : (
                <span className="font-bold">{step}</span>
              )}
            </div>
            <span className="text-xs mt-2 font-medium capitalize">
              {step === 1 && 'Company'}
              {step === 2 && 'Founder'}
              {step === 3 && 'Details'}
              {step === 4 && 'Financial'}
              {step === 5 && 'Branding'}
              {step === 6 && 'Documents'}
              {step === 7 && 'Team'}
              {step === 8 && 'Review'}
              {step === 9 && 'Complete'}
            </span>
          </div>
          {step < 9 && (
            <div className={`w-12 h-1 mx-2 transition-all duration-300 rounded-full ${
              step < currentStep ? 'bg-blue-400' : 'bg-gray-700'
            }`} />
          )}
        </div>
      ))}
    </div>
  );
  

  // Format currency for display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const Notification = () => {
    if (!notification.show) return null;

    const styles = {
      error: 'border-red-400/30 bg-red-500/10 text-red-200 backdrop-blur-sm',
      success: 'border-green-400/30 bg-green-500/10 text-green-200 backdrop-blur-sm',
      warning: 'border-yellow-400/30 bg-yellow-500/10 text-yellow-200 backdrop-blur-sm'
    };

    const icons = {
      error: <AlertCircle size={20} />,
      success: <CheckCircle size={20} />,
      warning: <AlertCircle size={20} />
    };

    return (
      <div style={{zIndex:9999999}} className={`w-1/2 fixed top-20 right-4 z-50 ${styles[notification.type]}`}>
        <Alert className="w-full border-none bg-transparent">
          <div className="w-full flex items-center gap-3">
            {icons[notification.type]}
            <AlertDescription className="font-medium w-full">{notification.message}</AlertDescription>
            <button 
              onClick={() => setNotification({ show: false, type: '', message: '' })}
              className="ml-2 hover:opacity-70 transition-opacity"
            >
              <X size={16} />
            </button>
          </div>
        </Alert>
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      <Notification />

      <div className="container mx-auto px-0 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-blue-400/10 border border-blue-400/30 rounded-full px-4 py-2 mb-4">
            <Rocket className="w-4 h-4 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Launch Your Venture</span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Build Your <span className="bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">Dream Team</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Join thousands of founders who've built successful teams on our platform. 
            <span className="text-white font-semibold"> Average time to first hire: 2.3 weeks.</span>
          </p>
        </div>

        <StepIndicator />

        {/* Three-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
          {/* Left Sidebar - Context & Benefits */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-400" />
                  Guide & Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <SidebarContent />
                
                {/* Milestone Tracker */}
                <div className="mt-8 pt-6 border-t border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-white text-sm font-medium">Profile Completion</span>
                    <span className="text-blue-400 text-sm font-bold">{Math.round(((currentStep - 1) / 8) * 100)}%</span>
                  </div>
                  <Progress value={((currentStep - 1) / 8) * 100} className="h-2 bg-gray-700  *:data-[slot=progress-indicator]:bg-blue-500 [&>div]:bg-blue-500/20" />
                  
                  <div className="flex items-center gap-2 mt-4">
                    <Trophy className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">XP Earned: {xpPoints}/1200</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Center - Main Form */}
          <div className="lg:col-span-6">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm">
              {/* Progress Bar */}
              <div className="px-6 pt-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-400 text-sm">Step {currentStep} of 8</span>
                  <span className="text-blue-400 text-sm font-medium">+{currentStep > 1 ? (currentStep - 1) * 150 : 0} XP</span>
                </div>
                <Progress value={((currentStep - 1) / 8) * 100} className="h-2 bg-gray-700  *:data-[slot=progress-indicator]:bg-blue-500 [&>div]:bg-blue-500/20" />
                <div  className="h-2  transition-all duration-1000 ease-out rounded-full"
                  style={{ width: `${((currentStep - 1) / 8) * 100}%`, marginTop: '-8px', background:'linear-linear(90deg,rgba(13, 91, 181, 1) 0%, rgba(78, 225, 245, 1) 100%)' }}
                ></div>
              </div>

              <CardContent className="p-6">
                {/* Step 1: Company Information */}
                {currentStep === 1 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <Building2 className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Company Information</CardTitle>
                      <CardDescription className="text-gray-300">Let's start with the basics of your startup</CardDescription>
                    </div>
                
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="name" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          <span>Startup Name <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge></span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Your official startup name. This will be visible to all users and should match your legal business name.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <Building2 className="absolute left-4 top-4 text-gray-400" size={20} />
                          <Input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange("name", e.target.value)}
                            className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            placeholder="Enter your startup name"
                          />
                        </div>
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="industry" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          <span>
                            Industry <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Select the primary industry your startup operates in. This helps match you with relevant talent and investors.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-3 text-gray-400 z-10" size={20} />
                          <Select value={formData.industry} onValueChange={(value) => handleInputChange("industry", value)}>
                            <SelectTrigger style={{height:'45px'}} className="w-full pl-14 border-gray-600 bg-gray-700/50 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all">
                              <SelectValue placeholder="Select Industry" className="text-white" />
                            </SelectTrigger>
                            <SelectContent position="bottom" className="w-full bg-gray-800 border-gray-600 text-white">
                              {industries.map(industry => (
                                <SelectItem key={industry} value={industry} className="text-white hover:bg-gray-700 focus:bg-gray-700 "><span className="text-white w-full h-full hover:text-blue-400">{industry}</span></SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="location" className="text-sm font-medium text-white  items-center gap-2 flex justify-between w-full">
                          <span>Location <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge></span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Your primary operating location. Include city and country. This helps local talent find your startup and indicates if you support remote work.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-4 text-gray-400" size={20} />
                          <Input
                            id="location"
                            type="text"
                            value={formData.location}
                            onChange={(e) => handleInputChange("location", e.target.value)}
                            className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            placeholder="City, Country"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Founder Details */}
                {currentStep === 2 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Founder Information</CardTitle>
                      <CardDescription className="text-gray-300">Tell us about yourself as the founder</CardDescription>
                    </div>
                
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="firstName" className="text-sm font-medium text-white  items-center gap-2 flex justify-between w-full">
                          <span>
                            First Name <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Your legal first name as the founder. This builds credibility with potential team members and investors.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 text-gray-400" size={20} />
                          <Input
                            id="firstName"
                            type="text"
                            value={formData.creator_first_name}
                            onChange={(e) => handleInputChange("creator_first_name", e.target.value)}
                            className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            placeholder="Your first name"
                          />
                        </div>
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="lastName" className="text-sm font-medium text-white  items-center gap-2 flex justify-between w-full">
                          <span>
                            Last Name <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Your legal last name. Complete founder profiles receive 47% more applications from qualified candidates.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <User className="absolute left-4 top-4 text-gray-400" size={20} />
                          <Input
                            id="lastName"
                            type="text"
                            value={formData.creator_last_name}
                            onChange={(e) => handleInputChange("creator_last_name", e.target.value)}
                            className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            placeholder="Your last name"
                          />
                        </div>
                      </div>
                
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="email" className="text-sm font-medium text-white  items-center gap-2 flex justify-between w-full">
                          <span>
                            Email <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Your professional email address. Using a company domain email enhances credibility and trust with potential team members.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-4 text-gray-400" size={20} />
                          <Input
                            id="email"
                            type="email"
                            value={formData.creator_email}
                            onChange={(e) => handleInputChange("creator_email", e.target.value)}
                            className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                            placeholder="your.email@company.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Startup Details */}
                {currentStep === 3 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <Rocket className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Startup Details</CardTitle>
                      <CardDescription className="text-gray-300">Tell us more about your vision and stage</CardDescription>
                    </div>

                    <div className="space-y-5">
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium mb-3 block text-white flex items-center gap-2">
                          <span>
                            Description <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                          </span>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Describe your startup's mission, vision, and what makes it unique. A compelling description attracts 3x more qualified applicants and helps candidates understand your company culture.</p>
                            </TooltipContent>
                          </Tooltip>
                          <span className="text-gray-400 text-xs ml-auto">{formData.description.length}/500</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={formData.description}
                          onChange={(e) => handleInputChange("description", e.target.value)}
                          rows={5}
                          className="border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                          placeholder="Describe your startup's mission, vision, and what makes it unique..."
                          maxLength={500}
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-3 block text-white flex items-center gap-2">
                          Current Stage <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                        </Label>
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
                          {startupStages.map((stage) => (
                            <TooltipProvider key={stage.value}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Card
                                    onClick={() => handleInputChange("stage", stage.value)}
                                    className={`p-4 cursor-pointer transition-all duration-200 border backdrop-blur-sm hover:scale-105 ${
                                      formData.stage === stage.value
                                        ? 'border-blue-400 bg-blue-400/20 text-white shadow-lg shadow-blue-400/20'
                                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-blue-400 hover:text-white'
                                    }`}
                                  >
                                    <CardContent className="p-0 text-center">
                                      <div className={`flex justify-center mb-2 ${formData.stage === stage.value ? 'text-blue-400' : 'text-gray-400'}`}>
                                        {stage.icon}
                                      </div>
                                      <div className={`font-semibold text-sm ${formData.stage === stage.value ? 'text-white' : 'text-gray-300'}`}>
                                        {stage.label}
                                      </div>
                                      <div className={`text-xs mt-2 ${formData.stage === stage.value ? 'text-blue-300' : 'text-gray-500'}`}>
                                        {stage.description}
                                      </div>
                                    </CardContent>
                                  </Card>
                                </TooltipTrigger>
                                <TooltipContent arrowColor="bg-gray-800 fill-gray-800" side="top" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                                  <p className="text-sm">{stage.tooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 4: Financial Foundation */}
                {currentStep === 4 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <DollarSign className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Financial Foundation</CardTitle>
                      <CardDescription className="text-gray-300">Share your financial metrics to attract the right talent</CardDescription>
                    </div>
                
                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="space-y-3">
                        <Label htmlFor="fundingRound" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Funding Round
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Current funding stage. Transparency about funding helps candidates assess company stability and growth potential.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Select value={formData.funding_round} onValueChange={(value) => handleInputChange("funding_round", value)}>
                          <SelectTrigger style={{height:'45px'}} className="w-full pl-14 border-gray-600 bg-gray-700/50 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all">
                            <SelectValue placeholder="Select funding round" />
                          </SelectTrigger>
                          <SelectContent style={{width:'100%'}} className="bg-gray-800 border-gray-600 text-white">
                            {fundingRounds.map(round => (
                              <SelectItem key={round.value} value={round.value} className="text-white hover:bg-gray-700  focus:bg-gray-700">
                                <div className="flex flex-col">
                                  <span className='text-white hover:text-blue-400'>{round.label}</span>
                                  <span className="text-xs text-gray-400">{round.description}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="fundingAmount" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Total Funding Raised
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Cumulative amount raised from all funding rounds. Shows investor confidence and financial backing.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <DollarSign className="absolute left-14 top-3.5 text-gray-400" size={20} />
                          <div className="relative">
                            <DollarSign className="absolute left-14 top-3.5 text-gray-400" size={20} />
                            <div className="flex items-center gap-2">
                              <Button
                                onClick={() => handleFinancialChange("funding_amount", Math.max(0, formData.funding_amount - 1000))}
                                size="icon"
                                type="button"
                                // variant=""
                                style={{zIndex:99999,cursor:'pointer'}}
                                className="rounded-full bg-gray-700/70 border border-gray-600 "
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                              <Input
                                id="fundingAmount"
                                type="number"
                                value={formData.funding_amount}
                                onChange={(e) => handleFinancialChange("funding_amount", e.target.value)}
                                className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                placeholder="0"
                                min="0"
                                step="1000"
                              />
                              <Button
                                onClick={() => handleFinancialChange("funding_amount", formData.funding_amount + 1000)}
                                size="icon"
                                type="button"
                                // variant=""
                                style={{zIndex:99999,cursor:'pointer'}}
                                className="rounded-full bg-gray-700/70 border border-gray-600 "
                              >
                                <Plus className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                        {formData.funding_amount > 0 && (
                          <p className="text-xs text-blue-400">{formatCurrency(formData.funding_amount)}</p>
                        )}
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="revenue" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Annual Revenue
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Total annual revenue generated. Important for revenue-stage startups to show traction and market validation.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <BarChart3 className="absolute left-14 top-3.5 text-gray-400" size={20} />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleFinancialChange("revenue", Math.max(0, formData.revenue - 1000))}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="revenue"
                              type="number"
                              value={formData.revenue}
                              onChange={(e) => handleFinancialChange("revenue", e.target.value)}
                              className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                              placeholder="0"
                              min="0"
                              step="1000"
                            />
                            <Button
                              onClick={() => handleFinancialChange("revenue", formData.revenue + 1000)}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {formData.revenue > 0 && (
                          <p className="text-xs text-blue-400">{formatCurrency(formData.revenue)}</p>
                        )}
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="valuation" className="flex justify-between w-full text-sm font-medium text-white  items-center gap-2">
                          Company Valuation
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Current company valuation from your latest funding round. Indicates market potential and growth expectations.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <TargetIcon className="absolute left-14 top-3.5 text-gray-400" size={20} />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleFinancialChange("valuation", Math.max(0, formData.valuation - 1000))}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="valuation"
                              type="number"
                              value={formData.valuation}
                              onChange={(e) => handleFinancialChange("valuation", e.target.value)}
                              className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                              placeholder="0"
                              min="0"
                              step="1000"
                            />
                            <Button
                              onClick={() => handleFinancialChange("valuation", formData.valuation + 1000)}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {formData.valuation > 0 && (
                          <p className="text-xs text-blue-400">{formatCurrency(formData.valuation)}</p>
                        )}
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="burnRate" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Monthly Burn Rate
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Average monthly cash expenditure. Helps candidates understand your financial discipline and operational efficiency.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <TrendingUp className="absolute left-14 top-3.5 text-gray-400" size={20} />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleFinancialChange("burn_rate", Math.max(0, formData.burn_rate - 1000))}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="burnRate"
                              type="number"
                              value={formData.burn_rate}
                              onChange={(e) => handleFinancialChange("burn_rate", e.target.value)}
                              className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                              placeholder="0"
                              min="0"
                              step="1000"
                            />
                            <Button
                              onClick={() => handleFinancialChange("burn_rate", formData.burn_rate + 1000)}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {formData.burn_rate > 0 && (
                          <p className="text-xs text-blue-400">{formatCurrency(formData.burn_rate)}/month</p>
                        )}
                      </div>
                
                      <div className="space-y-3">
                        <Label htmlFor="runwayMonths" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Runway (Months)
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Months until you run out of cash at current burn rate. Companies with 12+ months runway see 60% more applications.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <div className="relative">
                          <Calendar className="absolute left-14 top-3.5 text-gray-400" size={20} />
                          <div className="flex items-center gap-2">
                            <Button
                              onClick={() => handleFinancialChange("runway_months", Math.max(0, formData.runway_months - 1))}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <Input
                              id="runwayMonths"
                              type="number"
                              value={formData.runway_months}
                              onChange={(e) => handleFinancialChange("runway_months", e.target.value)}
                              className="pl-12 h-11.5 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                              placeholder="0"
                              min="0"
                            />
                            <Button
                              onClick={() => handleFinancialChange("runway_months", formData.runway_months + 1)}
                              size="icon"
                              type="button"
                              // variant="outline"
                              className="rounded-full bg-gray-700/70 border border-gray-600 "
                              style={{zIndex:99999,cursor:'pointer'}}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        {formData.runway_months > 0 && (
                          <p className="text-xs text-blue-400">{formData.runway_months} months remaining</p>
                        )}
                      </div>
                
                      <div className="space-y-3 md:col-span-2">
                        <Label htmlFor="financialNotes" className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Financial Notes & Context
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Additional context about revenue models, growth metrics, funding strategy, or financial milestones.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Textarea
                          id="financialNotes"
                          value={formData.financial_notes}
                          onChange={(e) => handleInputChange("financial_notes", e.target.value)}
                          rows={3}
                          className="border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all resize-none"
                          placeholder="Additional context about your financial situation, growth plans, or funding strategy..."
                          maxLength={500}
                        />
                        <p className="text-xs text-gray-400">
                          This helps candidates understand your financial health and growth trajectory.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 5: Branding */}
                {currentStep === 5 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <Image className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Brand Identity</CardTitle>
                      <CardDescription className="text-gray-300">Upload your logo and banner to stand out</CardDescription>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Logo Upload */}
                      <div className="space-y-3">
                      <Label className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                        Company Logo <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30 text-xs">Required</Badge>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                            <p>Your company logo should be high-quality and recognizable. Square images work best. This will be displayed throughout the platform.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                        <Card 
                          onClick={() => logoInputRef.current?.click()}
                          className="border-2 bg-blue-400/5 border-dashed border-gray-600 p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-400/10 backdrop-blur-sm hover:scale-105"
                        >
                          <CardContent className="p-0">
                            {logoFile ? (
                              <div className="space-y-3">
                                <div className="w-24 h-24 rounded-2xl border-4 border-blue-400/30 mx-auto overflow-hidden">
                                  <img
                                    src={URL.createObjectURL(logoFile)}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                                  Logo uploaded
                                </Badge>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                                <div className="text-gray-300 font-medium mb-1">Upload Logo</div>
                                <div className="text-gray-500 text-xs">PNG, JPG up to 2MB</div>
                              </>
                            )}
                            <input
                              type="file"
                              ref={logoInputRef}
                              onChange={(e) => handleFileChange(e, "logo")}
                              className="hidden"
                              accept="image/*"
                            />
                          </CardContent>
                        </Card>
                      </div>

                      {/* Banner Upload */}
                      <div className="space-y-3">
                      <Label className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                        Cover Banner
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                            <p>A cover banner helps your startup stand out. Use an image that represents your brand. Recommended size: 1200x300 pixels.</p>
                          </TooltipContent>
                        </Tooltip>
                      </Label>
                        <Card 
                          onClick={() => bannerInputRef.current?.click()}
                          className="border-2 bg-blue-400/5 border-dashed border-gray-600 p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-400/10 backdrop-blur-sm hover:scale-105"
                        >
                          <CardContent className="p-0">
                            {bannerFile ? (
                              <div className="space-y-3">
                                <img
                                  src={URL.createObjectURL(bannerFile)}
                                  alt="Banner preview"
                                  className="w-full h-20 rounded-lg object-cover"
                                />
                                <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                                  Banner uploaded
                                </Badge>
                              </div>
                            ) : (
                              <>
                                <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                                <div className="text-gray-300 font-medium mb-1">Upload Banner</div>
                                <div className="text-gray-500 text-xs">Optional - PNG, JPG up to 5MB</div>
                              </>
                            )}
                            <input
                              type="file"
                              ref={bannerInputRef}
                              onChange={(e) => handleFileChange(e, "banner")}
                              className="hidden"
                              accept="image/*"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 6: Documents Upload */}
                {currentStep === 6 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Company Documents</CardTitle>
                      <CardDescription className="text-gray-300">Upload important documents for your startup</CardDescription>
                    </div>
                
                    <div className="space-y-6">
                      <div className="space-y-3">
                        <Label className="text-sm font-medium text-white flex items-center gap-2  justify-between w-full">
                          Business Plan & Documents
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                              <p>Upload your business plan, pitch deck, or other important documents. PDF, DOC, DOCX files up to 10MB.</p>
                            </TooltipContent>
                          </Tooltip>
                        </Label>
                        <Card className="border-2 bg-blue-400/5 hover:scale-101 border-dashed border-gray-600 p-6 text-center cursor-pointer transition-all duration-200 hover:border-blue-400 hover:bg-blue-400/10 backdrop-blur-sm">
                          <CardContent className="p-0">
                            <Upload className="w-10 h-10 text-blue-400 mx-auto mb-3" />
                            <div className="text-gray-300 font-medium mb-1">Upload Documents</div>
                            <div className="text-gray-500 text-xs">PDF, DOC, DOCX up to 10MB each</div>
                            <input
                              type="file"
                              multiple
                              accept=".pdf,.doc,.docx,.txt"
                              className="hidden"
                              id="document-upload"
                              onChange={(e) => handleDocumentUpload(e)}
                            />
                            <Button
                              onClick={() => document.getElementById('document-upload')?.click()}
                              className="mt-4 bg-blue-400 hover:bg-blue-500 text-white"
                            >
                              <Upload className="w-4 h-4 mr-2" />
                              Select Files
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                
                      {/* Uploaded documents list */}
                      {uploadedDocuments.length > 0 && (
                        <div className="space-y-3">
                          <Label className="text-sm font-medium text-white">Uploaded Documents</Label>
                          <div className="space-y-2">
                            {uploadedDocuments.map((doc, index) => (
                              <div key={index} className="flex items-center justify-between p-3 border border-gray-600 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <FileText className="w-4 h-4 text-blue-400" />
                                  <span className="text-white text-sm">{doc.name}</span>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeDocument(index)}
                                  className="text-red-400 hover:text-red-500 hover:bg-red-500/10"
                                >
                                  <X size={16} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 7: Team & Roles */}
                {currentStep === 7 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <Users className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Build Your Team</CardTitle>
                      <CardDescription className="text-gray-300">Define roles and positions needed</CardDescription>
                    </div>

                    <div className="space-y-5">
                      <div className="space-y-6">
                        {/* Tech Stack Input */}
                        <div className="space-y-3">
                          <Label htmlFor="techStack" className="text-sm font-medium text-white flex items-center gap-2">
                            Technology Stack
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                  <InfoIcon className="size-4 text-gray-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                                <p>List the technologies your startup uses. This helps match you with developers who have relevant skills.</p>
                              </TooltipContent>
                            </Tooltip>
                            <span className="text-gray-400 text-xs ml-auto">{techStack.length}/15</span>
                          </Label>
                          
                          <div className="space-y-3">
                            <div className="flex gap-2">
                              <Input
                                id="techStack"
                                type="text"
                                value={techInput}
                                onChange={handleTechInputChange}
                                onKeyDown={handleTechInputKeyDown}
                                className="flex-1 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                placeholder="Add technology (e.g., React, Node.js, Python...)"
                                list="tech-suggestions"
                              />
                              <Button
                                onClick={() => addTech(techInput.trim())}
                                disabled={!techInput.trim() || techStack.length >= 15}
                                className="bg-blue-400 hover:bg-blue-500 text-white border-0 transition-all hover:scale-105"
                              >
                                <Plus size={18} />
                              </Button>
                            </div>
                            
                            <datalist id="tech-suggestions">
                              {popularTechnologies.map(tech => (
                                <option key={tech} value={tech} />
                              ))}
                            </datalist>
                          </div>
                  
                          {/* Popular Technologies */}
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Popular Technologies</Label>
                            <div className="flex flex-wrap gap-2">
                              {popularTechnologies.slice(0, 12).map(tech => (
                                <Badge
                                  key={tech}
                                  variant="outline"
                                  onClick={() => addTech(tech)}
                                  className={`cursor-pointer transition-all hover:scale-105 ${
                                    techStack.includes(tech) 
                                      ? 'bg-blue-400/20 text-blue-400 border-blue-400/50' 
                                      : 'bg-gray-700/50 text-gray-300 border-gray-600 hover:bg-gray-600'
                                  }`}
                                >
                                  {tech}
                                  {techStack.includes(tech) && <CheckCircle className="w-3 h-3 ml-1" />}
                                </Badge>
                              ))}
                            </div>
                          </div>
                  
                          {/* Selected Technologies */}
                          {techStack.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Selected Technologies ({techStack.length})</Label>
                              <div className="flex flex-wrap gap-2">
                                {techStack.map(tech => (
                                  <Badge
                                    key={tech}
                                    variant="secondary"
                                    className="bg-blue-400/20 text-blue-400 border-blue-400/30 flex items-center gap-1 group transition-all hover:scale-105"
                                  >
                                    {tech}
                                    <button
                                      onClick={() => removeTech(tech)}
                                      className="ml-1 hover:text-blue-300 transition-colors rounded-full hover:bg-blue-400/20 p-0.5"
                                    >
                                      <X size={14} />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                  
                        {/* Benefits */}
                        <Card className="border-blue-400/20 bg-blue-400/10 backdrop-blur-sm">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <Lightbulb className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                              <div className="space-y-2">
                                <p className="text-blue-300 text-sm font-medium">Why specify your tech stack?</p>
                                <ul className="text-blue-200 text-sm space-y-1">
                                  <li>• Attracts developers with relevant skills (62% more applications)</li>
                                  <li>• Shows technical direction and company culture</li>
                                  <li>• Helps candidates assess if they're a good fit</li>
                                  <li>• Increases matching accuracy with our algorithm</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      {/* Roles */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="text-sm font-medium text-white flex items-center gap-2   w-full">
                            Open Roles ({roles.length}/10)
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                  <InfoIcon className="size-4 text-gray-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                                <p>Define specific roles you're hiring for. Clear role descriptions attract more qualified candidates and reduce time-to-hire.</p>
                              </TooltipContent>
                            </Tooltip>
                          </Label>
                          <Button
                            onClick={addRole}
                            disabled={roles.length >= 10}
                            className="bg-blue-400 hover:bg-blue-500 text-white border-0 transition-all hover:scale-105 shadow-lg shadow-blue-400/20"
                          >
                            <Plus size={18} className="mr-2" />
                            Add Role
                          </Button>
                        </div>

                        <div className="space-y-4  max-h-80 overflow-y-auto p-2 custom-scrollbar">
                          {roles.map((role, index) => (
                            <Card  key={index} className="p-4 border bg-blue-300/5 border-gray-600 hover:border-blue-400/50 transition-all duration-200 backdrop-blur-sm hover:scale-102">
                              <CardContent className="p-0">
                                <div className="grid md:grid-cols-3  gap-4">
                                  <div className="space-y-2">
                                    <Label className="text-xs text-gray-400 uppercase font-medium flex items-center justify-between gap-2 w-full">
                                      Role Title
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                            <InfoIcon className="size-3 text-gray-400" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                                          <p>Enter the specific job title you're hiring for. Be clear and descriptive (e.g., "Senior Frontend Developer" instead of just "Developer").</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <Input
                                      type="text"
                                      value={role.title}
                                      onChange={(e) => updateRole(index, "title", e.target.value)}
                                      className="border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                      placeholder="e.g., Frontend Developer"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs text-gray-400 uppercase font-medium flex items-center justify-between gap-2 w-full">
                                      Role Type
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                            <InfoIcon className="size-3 text-gray-400" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                                          <p>Select the employment type. Full Time roles attract 65% more applicants, while Contract roles fill 40% faster.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <Select value={role.roleType} onValueChange={(value) => updateRole(index, "roleType", value)}>
                                      <SelectTrigger className="w-full border-gray-600 bg-gray-700/50 text-white focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all">
                                        <SelectValue placeholder="Select role type" />
                                      </SelectTrigger>
                                      <SelectContent className="bg-gray-800 border-gray-600 text-white">
                                        {roleTypes.map(type => (
                                          <SelectItem key={type} value={type} className=" hover:bg-gray-700 focus:bg-gray-700">
                                            <span className='text-white hover:text-blue-400'>
                                              {type}
                                            </span>
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2 relative">
                                    {/* <Users className="absolute left-2 bottom-1 text-gray-400" size={16} /> */}
                                    
                                    <Label  className="text-xs text-gray-400 uppercase font-medium flex items-center justify-between gap-2 w-full">
                                      Available Positions
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <button type="button" className="rounded-full p-1 hover:bg-gray-600 transition-colors">
                                            <InfoIcon className="size-3 text-gray-400" />
                                          </button>
                                        </TooltipTrigger>
                                        <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 fill-gray-800 border-gray-600 text-white">
                                          <p>Total number of open positions across all roles. This helps candidates understand your hiring scale and growth trajectory.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <Button
                                        onClick={() => updateRole(index, "positionsNumber", Math.max(0, (role.positionsNumber || 0) - 1))}
                                        size="icon"
                                        type="button"
                                        className="rounded-full w-8 h-8 bg-gray-700/70 border border-gray-600"
                                        style={{zIndex:99999,cursor:'pointer'}}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                      <Input
                                        id="positionsNumber"
                                        type="number"
                                        value={role.positionsNumber || 0}
                                        onChange={(e) => updateRole(index, "positionsNumber", parseInt(e.target.value) || 0)}
                                        min="0"
                                        className="w-full pl-8 border-gray-600 bg-gray-700/50 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 transition-all"
                                        placeholder="Number of positions"
                                      />
                                      <Button
                                        onClick={() => updateRole(index, "positionsNumber", (role.positionsNumber || 0) + 1)}
                                        size="icon"
                                        type="button"
                                        className="rounded-full w-8 h-8 bg-gray-700/70 border border-gray-600"
                                        style={{zIndex:99999,cursor:'pointer'}}
                                      >
                                        <Plus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="absolute right-0 top-0 flex items-center justify-between">
                                      {/* <Label className="text-xs text-gray-400 uppercase font-medium">Role Type</Label> */}
                                      {roles.length > 1 && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeRole(index)}
                                          className="text-red-400 hover:text-red-500 hover:bg-red-500/10 transition-colors h-6 w-6 p-0 rounded-full"
                                        >
                                          <X size={16} />
                                        </Button>
                                      )}
                                    </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 8: Review */}
                {currentStep === 8 && (
                  <div className="space-y-6 animate-fadeIn">
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 rounded-2xl bg-blue-400/10 border border-blue-400/30 flex items-center justify-center mx-auto mb-4">
                        <Eye className="w-8 h-8 text-blue-400" />
                      </div>
                      <CardTitle className="text-2xl mb-2 text-white">Review Your Startup</CardTitle>
                      <CardDescription className="text-gray-300">Review all the details before launching</CardDescription>
                    </div>
                
                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Company Details */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-blue-400" />
                            Company Details
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Startup Name</Label>
                            <p className="text-white font-medium text-lg">{formData.name || <span className="text-gray-500 italic">Not provided</span>}</p>
                          </div>
                          <Separator className="bg-gray-600" />
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Industry</Label>
                            <Badge variant="outline" className="bg-blue-400/10 text-blue-400 border-blue-400/30">
                              {formData.industry || "Not provided"}
                            </Badge>
                          </div>
                          <Separator className="bg-gray-600" />
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Location</Label>
                            <div className="flex items-center gap-2 text-white font-medium">
                              <MapPin className="w-4 h-4 text-gray-400" />
                              {formData.location || <span className="text-gray-500 italic">Not provided</span>}
                            </div>
                          </div>
                          <Separator className="bg-gray-600" />
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Stage</Label>
                            <Badge variant="outline" className="bg-purple-400/10 text-purple-400 border-purple-400/30 capitalize">
                              {formData.stage || "Not provided"}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                
                      {/* Financial Details */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <DollarSign className="w-5 h-5 text-blue-400" />
                            Financial Foundation
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Funding Round</Label>
                              <Badge variant="outline" className="bg-green-400/10 text-green-400 border-green-400/30 capitalize">
                                {formData.funding_round?.replace('-', ' ') || "Not provided"}
                              </Badge>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Runway</Label>
                              <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <p className="text-white font-medium">{formData.runway_months || 0} months</p>
                              </div>
                            </div>
                          </div>
                          <Separator className="bg-gray-600" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Total Funding</Label>
                              <p className="text-white font-medium text-lg">{formatCurrency(formData.funding_amount)}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Valuation</Label>
                              <p className="text-white font-medium text-lg">{formatCurrency(formData.valuation)}</p>
                            </div>
                          </div>
                          <Separator className="bg-gray-600" />
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Annual Revenue</Label>
                              <p className="text-white font-medium">{formatCurrency(formData.revenue)}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-sm text-gray-400">Monthly Burn</Label>
                              <p className="text-white font-medium">{formatCurrency(formData.burn_rate)}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                
                      {/* Founder Details */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <User className="w-5 h-5 text-blue-400" />
                            Founder Information
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Full Name</Label>
                            <div className="flex items-center gap-2 text-white font-medium text-lg">
                              <User className="w-4 h-4 text-gray-400" />
                              {formData.creator_first_name} {formData.creator_last_name}
                            </div>
                          </div>
                          <Separator className="bg-gray-600" />
                          <div className="space-y-2">
                            <Label className="text-sm text-gray-400">Email</Label>
                            <div className="flex items-center gap-2 text-white font-medium">
                              <Mail className="w-4 h-4 text-gray-400" />
                              {formData.creator_email}
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                
                      {/* Branding & Documents */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Image className="w-5 h-5 text-blue-400" />
                            Branding & Documents
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                          {/* Logo & Banner */}
                          <div className="grid grid-cols-2 gap-4">
                            <div className="text-center">
                              <Label className="text-sm text-gray-400 block mb-2">Logo</Label>
                              {logoFile ? (
                                <div className="w-16 h-16 rounded-xl border-2 border-blue-400/50 mx-auto overflow-hidden bg-gray-600">
                                  <img
                                    src={URL.createObjectURL(logoFile)}
                                    alt="Logo preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-16 h-16 rounded-xl border-2 border-dashed border-gray-500 flex items-center justify-center mx-auto bg-gray-600/50">
                                  <Image className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div className="text-center">
                              <Label className="text-sm text-gray-400 block mb-2">Banner</Label>
                              {bannerFile ? (
                                <div className="w-full h-16 rounded-lg border-2 border-blue-400/50 overflow-hidden bg-gray-600">
                                  <img
                                    src={URL.createObjectURL(bannerFile)}
                                    alt="Banner preview"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-full h-16 rounded-lg border-2 border-dashed border-gray-500 flex items-center justify-center bg-gray-600/50">
                                  <Image className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </div>
                
                          {/* Documents */}
                          <div>
                            <Label className="text-sm text-gray-400 mb-2 block">Documents ({uploadedDocuments.length})</Label>
                            {uploadedDocuments.length > 0 ? (
                              <div className="space-y-2 max-h-32 overflow-y-auto custom-scrollbar">
                                {uploadedDocuments.map((doc, index) => (
                                  <div key={index} className="flex items-center justify-between p-2 border border-gray-600 rounded-lg bg-gray-600/30">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-4 h-4 text-blue-400" />
                                      <span className="text-white text-sm truncate max-w-[180px]">{doc.name}</span>
                                    </div>
                                    <Badge variant="outline" className="bg-gray-500/30 text-gray-300 border-gray-500 text-xs">
                                      {(doc.size / 1024 / 1024).toFixed(2)} MB
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-4 border-2 border-dashed border-gray-600 rounded-lg bg-gray-600/30">
                                <FileText className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                                <p className="text-gray-400 text-sm">No documents uploaded</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                      
                                            
                      {/* Tech Stack */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm md:col-span-2 hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Code className="w-5 h-5 text-blue-400" />
                            Technology Stack
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          {techStack.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {techStack.map(tech => (
                                <Badge
                                  key={tech}
                                  variant="outline"
                                  className="bg-blue-400/20 text-blue-400 border-blue-400/30"
                                >
                                  {tech}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-500 italic">No technologies specified</p>
                          )}
                        </CardContent>
                      </Card>
                      
                      {/* Team & Roles */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm md:col-span-2 hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Users className="w-5 h-5 text-blue-400" />
                            Team & Roles
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                              <div>
                                <Label className="text-sm text-gray-400 mb-2 block">Available Positions</Label>
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-full bg-blue-400/10 border border-blue-400/30 flex items-center justify-center">
                                    <Users className="w-6 h-6 text-blue-400" />
                                  </div>
                                  <div>
                                    <p className="text-white font-bold text-2xl">{roles.reduce((total, role) => total + (role.positionsNumber || 0), 0)}</p>
                                    <p className="text-gray-400 text-sm">Total positions</p>
                                  </div>
                                </div>
                              </div>
                              <Separator className="bg-gray-600" />
                              <div>
                                <Label className="text-sm text-gray-400 mb-2 block">Roles Breakdown</Label>
                                <div className="space-y-2">
                                  {roleTypes.map(type => {
                                    const count = roles.filter(role => role.roleType === type).length;
                                    if (count === 0) return null;
                                    return (
                                      <div key={type} className="flex justify-between items-center">
                                        <span className="text-gray-300 text-sm">{type}</span>
                                        <Badge variant="outline" className="bg-gray-500/30 text-gray-300 border-gray-500">
                                          {count}
                                        </Badge>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                
                            <div>
                              <Label className="text-sm text-gray-400 mb-3 block">Defined Roles ({roles.length})</Label>
                              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                                {roles.map((role, index) => (
                                  <Card key={index} className="p-3 border border-gray-600 bg-gray-600/30 hover:border-blue-400/50 transition-colors">
                                    <CardContent className="p-0">
                                      <div className="flex justify-between items-start mb-2">
                                        <span className="text-white font-medium text-sm">{role.title || "Untitled Role"}</span>
                                        <Badge variant="outline" className="bg-blue-400/20 text-blue-400 border-blue-400/30 text-xs">
                                          {role.roleType}
                                        </Badge>
                                      </div>
                                      <div className="flex justify-between items-center">
                                        <span className="text-gray-400 text-xs">Positions</span>
                                        <Badge variant="secondary" className="bg-green-400/20 text-green-400 border-green-400/30">
                                          {role.positionsNumber || 0}
                                        </Badge>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                
                      {/* Description */}
                      <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm md:col-span-2 hover:border-blue-400/50 transition-all duration-300">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-white text-lg flex items-center gap-2">
                            <Rocket className="w-5 h-5 text-blue-400" />
                            Description
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-4 border border-gray-600 rounded-lg bg-gray-600/30">
                            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                              {formData.description || <span className="text-gray-500 italic">No description provided</span>}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                
                      {/* Financial Notes */}
                      {formData.financial_notes && (
                        <Card className="border-gray-600 bg-gray-700/50 backdrop-blur-sm md:col-span-2 hover:border-blue-400/50 transition-all duration-300">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-white text-lg flex items-center gap-2">
                              <BarChart3 className="w-5 h-5 text-blue-400" />
                              Financial Context
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="p-4 border border-gray-600 rounded-lg bg-gray-600/30">
                              <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{formData.financial_notes}</p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 9: Completion */}
                {currentStep === 9 && (
                  <div className="text-center py-8 animate-fadeIn">
                    <div className="w-24 h-24 bg-linear-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm animate-bounce">
                      <CheckCircle size={40} className="text-white" />
                    </div>
                    <CardTitle className="text-3xl mb-3 text-white">Launch Complete! 🚀</CardTitle>
                    <CardDescription className="text-lg mb-6 max-w-md mx-auto text-gray-300">
                      Your startup <span className="text-white font-semibold">{formData.name}</span> is now ready to change the world.
                    </CardDescription>
                    <div className="grid md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-2xl text-white font-bold">{roles.reduce((total, role) => total + (role.positionsNumber || 0), 0)}</div>
                          <div className="text-gray-400 text-sm">Open Positions</div>
                        </CardContent>
                      </Card>
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-2xl text-white font-bold">{roles.length}</div>
                          <div className="text-gray-400 text-sm">Roles Defined</div>
                        </CardContent>
                      </Card>
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-2xl text-white font-bold capitalize">{formData.stage}</div>
                          <div className="text-gray-400 text-sm">Current Stage</div>
                        </CardContent>
                      </Card>
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-2xl text-white font-bold">1200</div>
                          <div className="text-gray-400 text-sm">XP Earned</div>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-8">
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-lg text-white font-bold">{formatCurrency(formData.funding_amount)}</div>
                          <div className="text-gray-400 text-sm">Total Funding</div>
                        </CardContent>
                      </Card>
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-lg text-white font-bold">{formatCurrency(formData.valuation)}</div>
                          <div className="text-gray-400 text-sm">Valuation</div>
                        </CardContent>
                      </Card>
                      <Card className="p-4 border border-gray-600 bg-gray-700/50 backdrop-blur-sm">
                        <CardContent className="p-0 text-center">
                          <div className="text-lg text-white font-bold">{formData.runway_months}m</div>
                          <div className="text-gray-400 text-sm">Runway</div>
                        </CardContent>
                      </Card>
                    </div>
                    <Button
                      onClick={() => window.location.href = '/dashboard'}
                      className="bg-blue-400 hover:bg-blue-500 text-white border-0 px-8 py-3 text-base transition-all hover:scale-105 shadow-lg shadow-blue-400/20"
                    >
                      Go to Dashboard
                    </Button>
                  </div>
                )}

                {/* Navigation Buttons */}
                {currentStep < 9 && (
                  <div className="flex justify-between items-center pt-8 mt-6 border-t border-gray-700">
                    <Button
                      onClick={prevStep}
                      disabled={currentStep === 1}
                      variant="outline"
                      className="border-gray-600 text-gray-900 hover:text-gray-700 cursor-pointer hover:border-blue-400 transition-all hover:scale-105 backdrop-blur-sm"
                    >
                      <ChevronLeft size={18} className="mr-2" />
                      Previous
                    </Button>

                    {currentStep === 8 ? (
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="bg-blue-400 hover:bg-blue-500 text-white border-0 px-8 py-3 text-base transition-all hover:scale-105 shadow-lg shadow-blue-400/20"
                      >
                        {isSubmitting ? (
                          <>Launching...</>
                        ) : (
                          <>
                            Launch Startup
                            <Rocket size={18} className="ml-2" />
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        onClick={nextStep}
                        className="bg-blue-400 hover:bg-blue-500 text-white cursor-pointer border-0 px-8 py-3 text-base transition-all hover:scale-105 shadow-lg shadow-blue-400/20"
                      >
                        Continue
                        <ChevronRight size={18} className="ml-2" />
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar - Stats & Metrics */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm h-full">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-400" />
                  Quick Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Profile Strength</span>
                    <span className="text-blue-400 font-bold">{Math.round(((currentStep - 1) / 8) * 100)}%</span>
                  </div>
                  <Progress value={((currentStep - 1) / 8) * 100} className="h-2 bg-gray-700  *:data-[slot=progress-indicator]:bg-blue-500 [&>div]:bg-blue-500/20" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 text-sm">Time to Complete</span>
                    <span className="text-white font-medium">~{9 - currentStep} min</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">Your Progress</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Steps Completed</span>
                      <span className="text-white">{currentStep - 1}/7</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">XP Earned</span>
                      <span className="text-blue-400 font-bold">{xpPoints}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-400">Success Rate</span>
                      <span className="text-green-400">98%</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-700">
                  <div className="flex items-center gap-2 mb-3">
                    <Star className="w-4 h-4 text-blue-400" />
                    <span className="text-white text-sm font-medium">Did You Know?</span>
                  </div>
                  <p className="text-gray-300 text-sm">
                    Startups that complete their profiles within 24 hours are <span className="text-blue-400 font-medium">3x more likely</span> to secure their first hire within two weeks.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(75, 85, 99, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.7);
        }
      `}</style>
    </div>
  );
}