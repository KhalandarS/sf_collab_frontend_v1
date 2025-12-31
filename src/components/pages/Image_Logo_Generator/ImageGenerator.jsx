import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Textarea } from '../../ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Label } from '../../ui/label';
import { Loader2, Upload, X, Sparkles, ImageIcon, TextIcon, Download, InfoIcon, ArrowRight, FileImage, Type, Image as ImageLucide } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { useSelector } from "react-redux";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs'; // Make sure you have this component

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const ImageGenerator = () => {
  const [activeTab, setActiveTab] = useState('text-to-text');
  const [inputText, setInputText] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { user, access_token } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const token = access_token;
    if (!token) {
      setError('Please log in to generate content');
      return;
    }

    // Validation based on active tab
    if (activeTab === 'text-to-text' || activeTab === 'text-to-image') {
      if (!inputText.trim()) {
        setError('Text prompt is required');
        return;
      }
    }

    if (activeTab === 'image-to-image' && !selectedFile && !imageUrl) {
      setError('Please upload an image or provide an image URL');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      let endpoint = `${API_URL}/generation/generate`;
      let body = {};
      
      if (activeTab === 'text-to-text' || activeTab === 'text-to-image') {
        // For text-based generation
        body = JSON.stringify({ 
          text: inputText,
          generate_image: activeTab === 'text-to-image'
        });
      } else if (activeTab === 'image-to-image') {
        // For image-to-image, we need FormData
        const formData = new FormData();
        formData.append('text', inputText || 'Transform this image');
        if (selectedFile) formData.append('image_file', selectedFile);
        if (imageUrl) formData.append('image_url', imageUrl);
        
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
          body: formData,
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Generation failed');
        }
        
        if (!data.success) {
          throw new Error(data.error || 'Unknown error occurred');
        }
        
        setResponse(data);
        setLoading(false);
        return;
      }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: body,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Generation failed');
      }

      if (!data.success) {
        throw new Error(data.error || 'Unknown error occurred');
      }

      setResponse(data);
    } catch (err) {
      setError(err.message);
      console.error('Generation error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('File size should be less than 10MB');
        return;
      }
      setSelectedFile(file);
      setError('');
    }
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const clearAll = () => {
    setInputText('');
    setImageUrl('');
    setSelectedFile(null);
    setResponse(null);
    setError('');
  };

  const downloadImage = () => {
    if (response?.generated_image) {
      const link = document.createElement('a');
      link.href = `data:image/jpeg;base64,${response.generated_image}`;
      link.download = `ai_generated_${Date.now()}.jpg`;
      link.click();
    }
  };

  const handleTabChange = (value) => {
    setActiveTab(value);
    clearAll(); // Clear form when changing tabs
  };

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-gray-800 rounded-2xl shadow-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                AI Content Generator
              </h1>
            </div>
            <p className="text-gray-400 text-lg mb-6">
              Generate text, images, or transform images with FREE AI models
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-8">
            <Tabs defaultValue="text-to-text" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800 p-1 rounded-xl">
                <TabsTrigger value="text-to-text" className="data-[state=active]:bg-gray-700 text-white data-[state=active]:shadow-sm">
                  <Type className="h-4 w-4 mr-2 text-white" />
                  Text to Text
                </TabsTrigger>
                <TabsTrigger value="text-to-image" className="data-[state=active]:bg-gray-700 text-white data-[state=active]:shadow-sm">
                  <ImageLucide className="h-4 w-4 mr-2 text-white" />
                  Text to Image
                </TabsTrigger>
                <TabsTrigger value="image-to-image" className="data-[state=active]:bg-gray-700 text-white data-[state=active]:shadow-sm">
                  <FileImage className="h-4 w-4 mr-2 text-white" />
                  Image to Image
                </TabsTrigger>
              </TabsList>

              {/* Text to Text Tab */}
              <TabsContent value="text-to-text" className="mt-0">
                <Card className="mb-8 bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Enter Text Prompt</h3>
                          <p className="text-gray-300 text-sm">Ask questions or request content</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">AI Generates Text</h3>
                          <p className="text-gray-300 text-sm">Get detailed written responses</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-blue-600 text-white rounded-full text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Use Generated Text</h3>
                          <p className="text-gray-300 text-sm">Copy, edit, or save the response</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Text to Image Tab */}
              <TabsContent value="text-to-image" className="mt-0">
                <Card className="mb-8 bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Describe Your Image</h3>
                          <p className="text-gray-300 text-sm">Be specific about what you want</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">AI Creates Image</h3>
                          <p className="text-gray-300 text-sm">Generates unique artwork</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-purple-600" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-purple-600 text-white rounded-full text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Download Image</h3>
                          <p className="text-gray-300 text-sm">Save and use your creation</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Image to Image Tab */}
              <TabsContent value="image-to-image" className="mt-0">
                <Card className="mb-8 bg-gray-800 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                          1
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Upload Image</h3>
                          <p className="text-gray-300 text-sm">Provide a source image</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-green-600" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                          2
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Add Instructions</h3>
                          <p className="text-gray-300 text-sm">Describe desired transformation</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-green-600" />
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-green-600 text-white rounded-full text-sm font-bold">
                          3
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">Get Transformed Image</h3>
                          <p className="text-gray-300 text-sm">Download transformed version</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Input Section */}
            <div className="lg:col-span-2">
              <Card className="bg-gray-800 border-gray-700 shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    {activeTab === 'text-to-text' && <Type className="h-6 w-6" />}
                    {activeTab === 'text-to-image' && <ImageLucide className="h-6 w-6" />}
                    {activeTab === 'image-to-image' && <FileImage className="h-6 w-6" />}
                    {activeTab === 'text-to-text' && 'Text Generation'}
                    {activeTab === 'text-to-image' && 'Image Generation'}
                    {activeTab === 'image-to-image' && 'Image Transformation'}
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    {activeTab === 'text-to-text' && 'Enter text prompt to generate AI-written content'}
                    {activeTab === 'text-to-image' && 'Describe the image you want to create'}
                    {activeTab === 'image-to-image' && 'Upload an image and describe how to transform it'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Text Input - Show for all tabs */}
                    {(activeTab === 'text-to-text' || activeTab === 'text-to-image' || activeTab === 'image-to-image') && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="text-input" className="text-base font-semibold text-white">
                            {activeTab === 'image-to-image' ? 'Transformation Instructions *' : 'Text Prompt *'}
                          </Label>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button type="button" className="rounded-full p-1 hover:bg-gray-700 transition-colors">
                                <InfoIcon className="size-4 text-gray-400" />
                              </button>
                            </TooltipTrigger>
                            <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                              {activeTab === 'text-to-text' && <p>Ask questions, request content creation, or describe what you want written.</p>}
                              {activeTab === 'text-to-image' && <p>Be specific! Include style, colors, composition, and mood. Example: "A futuristic city at night with neon lights, cyberpunk style, 4k detailed"</p>}
                              {activeTab === 'image-to-image' && <p>Describe how you want to transform the image. Example: "Make it look like a watercolor painting" or "Convert to black and white with blue highlights"</p>}
                            </TooltipContent>
                          </Tooltip>
                        </div>
                        <Textarea
                          id="text-input"
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          placeholder={
                            activeTab === 'text-to-text' 
                              ? "What would you like me to write? (e.g., 'Write a short story about a space adventure', 'Explain quantum computing in simple terms', 'Create marketing copy for a new product')"
                              : activeTab === 'text-to-image'
                              ? "Describe the image you want to generate... (e.g., 'A futuristic cityscape at night with neon lights and flying cars, cyberpunk style, cinematic lighting' or 'A minimalist logo for a coffee shop with a cat silhouette')"
                              : "How would you like to transform the image? (e.g., 'Make it look like a Picasso painting', 'Convert to black and white', 'Add fantasy elements like magic sparkles')"
                          }
                          rows={activeTab === 'image-to-image' ? 3 : 4}
                          className="resize-none border-gray-600 focus:border-white transition-colors bg-gray-700 text-white"
                        />
                      </div>
                    )}

                    {/* Image Upload/URL - Show for image-to-image tab */}
                    {activeTab === 'image-to-image' && (
                      <>
                        {/* File Upload */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="file-upload" className="text-base font-semibold text-white">
                              Upload Image *
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="rounded-full p-1 hover:bg-gray-700 transition-colors">
                                  <InfoIcon className="size-4 text-gray-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                                <p>Upload the image you want to transform. Supported formats: JPG, PNG, WebP. Max file size: 10MB.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <div className="space-y-3">
                            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                              <Input
                                id="file-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                              <Label htmlFor="file-upload" className="cursor-pointer text-white">
                                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-sm font-medium text-gray-300">Click to upload image</p>
                                <p className="text-xs text-gray-500 mt-1">PNG, JPG, WebP up to 10MB</p>
                              </Label>
                            </div>
                            
                            {selectedFile && (
                              <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg border border-gray-600">
                                <div className="flex items-center gap-3">
                                  <ImageIcon className="h-5 w-5 text-gray-300" />
                                  <div>
                                    <span className="text-sm font-medium text-gray-200 block">
                                      {selectedFile.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                    </span>
                                  </div>
                                </div>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={removeSelectedFile}
                                  className="h-8 w-8 p-0 hover:bg-gray-600"
                                >
                                  <X className="h-4 w-4 text-gray-300" />
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* OR Separator */}
                        <div className="relative">
                          <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-600"></div>
                          </div>
                          <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-800 text-gray-500">OR</span>
                          </div>
                        </div>

                        {/* Image URL Input */}
                        <div className="space-y-3">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="image-url" className="text-base font-semibold text-white">
                              Image URL
                            </Label>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button type="button" className="rounded-full p-1 hover:bg-gray-700 transition-colors">
                                  <InfoIcon className="size-4 text-gray-400" />
                                </button>
                              </TooltipTrigger>
                              <TooltipContent arrowColor="bg-gray-800 fill-gray-800" className="max-w-xs bg-gray-800 border-gray-600 text-white">
                                <p>Instead of uploading, provide a URL to an image on the web.</p>
                              </TooltipContent>
                            </Tooltip>
                          </div>
                          <Input
                            id="image-url"
                            type="url"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            placeholder="https://example.com/your-image.jpg"
                            className="border-gray-600 focus:border-white transition-colors bg-gray-700 text-white"
                          />
                        </div>
                      </>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-blue-600 hover:bg-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-200 h-12 text-base font-semibold"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            {activeTab === 'text-to-text' && 'Generating Text...'}
                            {activeTab === 'text-to-image' && 'Generating Image...'}
                            {activeTab === 'image-to-image' && 'Transforming Image...'}
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 mr-2" />
                            {activeTab === 'text-to-text' && 'Generate Text'}
                            {activeTab === 'text-to-image' && 'Generate Image'}
                            {activeTab === 'image-to-image' && 'Transform Image'}
                          </>
                        )}
                      </Button>
                      
                      <Button
                        type="button"
                        variant="outline"
                        onClick={clearAll}
                        className="h-12 border-gray-600 hover:bg-gray-700 hover:border-gray-500 transition-colors"
                      >
                        Clear All
                      </Button>
                    </div>
                  </form>

                  {error && (
                    <Alert variant="destructive" className="mt-6 bg-red-600 border-red-500">
                      <AlertDescription className="text-red-200 font-medium">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Tips Section */}
                  <div className="mt-8 pt-6 border-t border-gray-600">
                    <h4 className="font-semibold text-gray-300 mb-3 flex items-center gap-2">
                      <InfoIcon className="h-4 w-4" />
                      Tips for Better Results:
                    </h4>
                    <ul className="space-y-2 text-sm text-gray-400">
                      {activeTab === 'text-to-text' && (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Be specific about what you want - include details and context</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Use clear language and proper formatting</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Specify tone if needed (professional, casual, creative, etc.)</span>
                          </li>
                        </>
                      )}
                      {activeTab === 'text-to-image' && (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Include style references: "in the style of Van Gogh", "anime style", "photorealistic"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Specify colors, lighting, and composition</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Add quality terms: "4k", "detailed", "high resolution", "cinematic"</span>
                          </li>
                        </>
                      )}
                      {activeTab === 'image-to-image' && (
                        <>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Use high-quality source images for best results</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>Be specific about the transformation: "make it look like oil painting"</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-1.5"></div>
                            <span>You can combine styles: "make it look like a watercolor painting with fantasy elements"</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Output Section */}
            <div className="lg:col-span-1">
              <Card className="bg-slate-800 backdrop-blur-sm border-white shadow-xl h-fit sticky top-8">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-2xl text-white">
                    {activeTab === 'text-to-text' && <TextIcon className="h-6 w-6" />}
                    {activeTab === 'text-to-image' && <ImageIcon className="h-6 w-6" />}
                    {activeTab === 'image-to-image' && <FileImage className="h-6 w-6" />}
                    {activeTab === 'text-to-text' && 'Generated Text'}
                    {activeTab === 'text-to-image' && 'Generated Image'}
                    {activeTab === 'image-to-image' && 'Transformed Image'}
                  </CardTitle>
                  <CardDescription>
                    {activeTab === 'text-to-text' && 'Your AI-generated text will appear here'}
                    {activeTab === 'text-to-image' && 'Your AI-generated image will appear here'}
                    {activeTab === 'image-to-image' && 'Your transformed image will appear here'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {response ? (
                    <>
                      {/* Text Response - Show for text-to-text and also for image-to-image */}
                      {(activeTab === 'text-to-text' || (response.answer && response.answer.trim())) && (
                        <div className="space-y-3">
                          <Label className="text-base font-semibold flex items-center gap-2">
                            <TextIcon className="h-4 w-4" />
                            Text Response
                          </Label>
                          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
                            <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                              {response.answer || 'No text generated'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Image Response */}
                      {response.generated_image && (
                        <div className="space-y-3">
                          <Label className="text-base font-semibold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" />
                            {activeTab === 'image-to-image' ? 'Transformed Image' : 'Generated Image'}
                          </Label>
                          <div className="border-2 border-gray-200 rounded-lg overflow-hidden bg-white p-2 shadow-inner">
                            <img 
                              src={`data:image/jpeg;base64,${response.generated_image}`}
                              alt={activeTab === 'image-to-image' ? "Transformed image" : "Generated by AI"}
                              className="w-full h-auto rounded-md shadow-sm"
                            />
                            <Button
                              onClick={downloadImage}
                              className="w-full mt-2 bg-black hover:bg-gray-800 text-white"
                              size="sm"
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Image
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* Empty image state */}
                      {!response.generated_image && (activeTab === 'text-to-image' || activeTab === 'image-to-image') && (
                        <div className="p-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                          <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600 text-sm">
                            No image generated yet
                          </p>
                        </div>
                      )}
                    </>
                  ) : (
                    /* Empty State */
                    <div className="text-center py-8">
                      <div className="p-3 bg-gray-100 rounded-2xl inline-flex mb-3">
                        {activeTab === 'text-to-text' && <TextIcon className="h-6 w-6 text-gray-400" />}
                        {activeTab === 'text-to-image' && <ImageIcon className="h-6 w-6 text-gray-400" />}
                        {activeTab === 'image-to-image' && <FileImage className="h-6 w-6 text-gray-400" />}
                      </div>
                      <h3 className="font-semibold text-gray-700 mb-1 text-sm">
                        No Content Generated
                      </h3>
                      <p className="text-gray-500 text-xs">
                        {activeTab === 'text-to-text' && 'Enter a text prompt and click Generate'}
                        {activeTab === 'text-to-image' && 'Describe an image and click Generate'}
                        {activeTab === 'image-to-image' && 'Upload an image and add instructions'}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Footer Info */}
          <div className="text-center mt-8">
            <p className="text-gray-500 text-sm">
              Powered by Qwen 2.5 & Stable Diffusion XL • 100% FREE AI Generation
            </p>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default ImageGenerator;