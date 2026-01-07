import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Label } from '../../ui/label';
import { Loader2, Upload, X, Sparkles, ImageIcon, Building2, Palette, Brush, Tag, Download, InfoIcon, ArrowRight } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
        
const StartupLogoGenerator = () => {
  const [formData, setFormData] = useState({
    company_name: '',
    subtitle: '',
    industry: 'Technology',
    style_preference: 'Modern and Minimalist',
    color_palette: 'Blue and White',
    additional_notes: ''
  });
  
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { user, access_token } = useSelector((state) => state.auth);

  // Predefined options
  const industryOptions = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce',
    'Food & Beverage', 'Fashion', 'Real Estate', 'Entertainment', 'Sports',
    'Travel', 'Automotive', 'Energy', 'Manufacturing', 'Other'
  ];

  const styleOptions = [
    'Modern and Minimalist',
    'Vintage and Classic',
    'Playful and Colorful',
    'Professional and Corporate',
    'Elegant and Luxury',
    'Tech and Futuristic',
    'Organic and Natural',
    'Bold and Geometric'
  ];

  const colorOptions = [
    'Blue and White',
    'Black and White',
    'Blue and Orange',
    'Green and White',
    'Purple and Yellow',
    'Red and Black',
    'Multi-color Bright',
    'Pastel Colors',
    'Earth Tones',
    'Monochrome'  // Fixed
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.company_name.trim()) {
      setError('Company name is required');
      return;
    }
    
    const token = access_token;
    if (!token) {
      setError('Please log in to generate logos');
      return;
    }
    
    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const response = await fetch(`${API_URL}/generation/generate-logo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Logo generation failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
      console.error('Logo generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setFormData({
      company_name: '',
      subtitle: '',
      industry: 'Technology',
      style_preference: 'Modern and Minimalist',
      color_palette: 'Blue and White',
      additional_notes: ''
    });
    setResponse(null);
    setError('');
  };

  const downloadLogo = () => {
    if (response?.generated_image) {
      const link = document.createElement('a');
      link.href = `data:image/png;base64,${response.generated_image}`;
      link.download = `${formData.company_name.replace(/\s+/g, '_')}_logo.png`;
      link.click();
    }
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-linear-to-br from-white via-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-black rounded-2xl shadow-lg">
                <Building2 className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-linear-to-r from-black to-gray-800 bg-clip-text text-transparent">
                Startup Logo Generator
              </h1>
            </div>
            <p className="text-gray-600 text-lg mb-6">
              Create professional logos for your startup with FREE AI
            </p>
          </div>

          {/* Steps Header */}
          <Card className="mb-8 bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    1
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Fill Company Details</h3>
                    <p className="text-blue-700 text-sm">Provide information about your business</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    2
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">AI Generates Logo</h3>
                    <p className="text-blue-700 text-sm">Our AI creates a custom logo design</p>
                  </div>
                </div>
                <ArrowRight className="h-5 w-5 text-blue-600" />
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                    3
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">Download & Use</h3>
                    <p className="text-blue-700 text-sm">Download your professional logo</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Brush className="h-6 w-6" />
                    Company Details
                  </CardTitle>
                  <CardDescription>
                    Tell us about your startup to create the perfect logo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Company Name */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="company-name" className="text-base font-semibold flex items-center gap-2">
                          <Building2 className="h-4 w-4" />
                          Company Name *
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-200 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                            <p>Your official startup name. This will be the primary text in your logo and should be memorable and brandable.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="company-name"
                        value={formData.company_name}
                        onChange={(e) => handleInputChange('company_name', e.target.value)}
                        placeholder="Enter your company name..."
                        className="border-gray-300 focus:border-black transition-colors bg-white/50"
                        required
                      />
                    </div>

                    {/* Subtitle/Tagline */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="subtitle" className="text-base font-semibold flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          Tagline / Subtitle
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-200 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                            <p>A short, catchy phrase that describes your business. This can be included below your company name in the logo.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input
                        id="subtitle"
                        value={formData.subtitle}
                        onChange={(e) => handleInputChange('subtitle', e.target.value)}
                        placeholder="Brief tagline that describes your company..."
                        className="border-gray-300 focus:border-black transition-colors bg-white/50"
                      />
                    </div>

                    {/* Industry */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="industry" className="text-base font-semibold">
                          Industry
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-200 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                            <p>Select your business industry to help the AI create a relevant logo that represents your field appropriately.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select 
                        value={formData.industry} 
                        onValueChange={(value) => handleInputChange('industry', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-black transition-colors bg-white/50">
                          <SelectValue placeholder="Select industry" />
                        </SelectTrigger>
                        <SelectContent>
                          {industryOptions.map(industry => (
                            <SelectItem key={industry} value={industry}>
                              {industry}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Style Preference */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="style" className="text-base font-semibold">
                          Design Style
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-200 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                            <p>Choose the visual style that best represents your brand personality and target audience.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select 
                        value={formData.style_preference} 
                        onValueChange={(value) => handleInputChange('style_preference', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-black transition-colors bg-white/50">
                          <SelectValue placeholder="Select style" />
                        </SelectTrigger>
                        <SelectContent>
                          {styleOptions.map(style => (
                            <SelectItem key={style} value={style}>
                              {style}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Color Palette */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="colors" className="text-base font-semibold flex items-center gap-2">
                          <Palette className="h-4 w-4" />
                          Color Palette
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-200 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                            <p>Select your preferred color combination. These colors will be used as the primary scheme for your logo design.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select 
                        value={formData.color_palette} 
                        onValueChange={(value) => handleInputChange('color_palette', value)}
                      >
                        <SelectTrigger className="border-gray-300 focus:border-black transition-colors bg-white/50">
                          <SelectValue placeholder="Select colors" />
                        </SelectTrigger>
                        <SelectContent>
                          {colorOptions.map(color => (
                            <SelectItem key={color} value={color}>
                              {color}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Additional Notes */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label htmlFor="additional-notes" className="text-base font-semibold">
                          Additional Notes & Requirements
                        </Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button type="button" className="rounded-full p-1 hover:bg-gray-200 transition-colors">
                              <InfoIcon className="size-4 text-gray-400" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                            <p>Add any specific elements, symbols, icons, or special requirements you want included in your logo design.</p>
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Textarea
                        id="additional-notes"
                        value={formData.additional_notes}
                        onChange={(e) => handleInputChange('additional_notes', e.target.value)}
                        placeholder="Any specific elements, symbols, or requirements for your logo (e.g., include a mountain icon, use circular shape, etc.)"
                        rows={3}
                        className="resize-none border-gray-300 focus:border-black transition-colors bg-white/50"
                      />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-black hover:bg-gray-800 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Generating Logo...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            Generate Logo
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearForm}
                        className="h-12 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-colors"
                      >
                        Clear Form
                      </Button>
                    </div>
                  </form>

                  {error && (
                    <Alert variant="destructive" className="mt-6 bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800 font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-1">
              <Card className="bg-white/80 backdrop-blur-sm border-gray-200 shadow-xl h-fit sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <ImageIcon className="h-6 w-6" />
                    Your Logo
                  </CardTitle>
                  <CardDescription>
                    AI-generated logo will appear here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {response ? (
                    <>
                      {/* Company Info */}
                      <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h3 className="font-bold text-xl text-gray-900">{response.company_name}</h3>
                        {response.subtitle && (
                          <p className="text-gray-600 text-sm mt-1">{response.subtitle}</p>
                        )}
                      </div>

                      {/* Logo Image */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          Generated Logo
                        </Label>
                        {response.generated_image ? (
                          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white p-4 shadow-inner">
                            <img 
                              src={`data:image/png;base64,${response.generated_image}`}
                              alt={`${response.company_name} logo`}
                              className="w-full h-auto rounded-md"
                            />
                            <Button
                              onClick={downloadLogo}
                              className="w-full mt-3 bg-black hover:bg-gray-800 text-white"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Logo
                            </Button>
                          </div>
                        ) : (
                          <div className="p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-gray-600 font-medium">
                              Logo image generating...
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              This may take a few moments
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Logo Description */}
                      <div className="space-y-3">
                        <Label className="text-base font-semibold">
                          Design Description
                        </Label>
                        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-40 overflow-y-auto">
                          <p className="text-gray-800 whitespace-pre-wrap text-sm leading-relaxed">
                            {response.logo_description || 'Generating description...'}
                          </p>
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-12">
                      <div className="p-4 bg-gray-100 rounded-2xl inline-flex mb-4">
                        <Building2 className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        No Logo Generated
                      </h3>
                      <p className="text-gray-500 text-sm">
                        Fill out the form to create your custom startup logo
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StartupLogoGenerator;