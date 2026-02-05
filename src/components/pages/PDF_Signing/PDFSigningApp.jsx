import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, Download, Trash2, MousePointer, Save, 
  FileText, Check, X, Loader, Sparkles, Camera, RefreshCw,
  Move, Maximize2, ChevronLeft, ChevronRight
} from 'lucide-react';
import { FaFilePdf } from "react-icons/fa6";
import { Button } from '../../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Alert, AlertDescription } from '../../ui/alert';
import { Label } from '../../ui/label';
import { Progress } from '../../ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Switch } from '../../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';
import { toolsAPI } from '@/utils/APIs/toolsAPI';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

const PDFSigningApp = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFileData, setUploadedFileData] = useState(null);
  const [signatureData, setSignatureData] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [signaturePosition, setSignaturePosition] = useState(null);
  const [signedDocuments, setSignedDocuments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [alert, setAlert] = useState({ message: '', type: '' });
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [outputFormat, setOutputFormat] = useState('pdf');
  const [autoPosition, setAutoPosition] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [pdfDimensions, setPdfDimensions] = useState({ width: 800, height: 1131 }); // Default A4 dimensions
  const [totalPages, setTotalPages] = useState(1);

  const canvasRef = useRef(null);
  const pdfContainerRef = useRef(null);
  const fileInputRef = useRef(null);
  const signatureRef = useRef(null);
  const iframeRef = useRef(null);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const sigStartPos = useRef({ x: 0, y: 0 });

  // Load signed documents on mount
  useEffect(() => {
    loadSignedDocuments();
  }, []);

  // Initialize signature canvas
  useEffect(() => {
    if (showSignaturePad && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }, [showSignaturePad]);

  // Handle dragging - OPTIMIZED VERSION
  useEffect(() => {
    if (!isDragging) return;
  
    let animationFrameId = null;
    let lastTimestamp = 0;
    const FRAME_RATE = 60; // 60 FPS
  
    const handleMouseMove = (e) => {
      if (!signaturePosition || !pdfContainerRef.current) return;
  
      const now = Date.now();
      if (now - lastTimestamp < 1000 / FRAME_RATE) return; // Throttle updates
      
      lastTimestamp = now;
  
      // Use requestAnimationFrame for smoother animation
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
  
      animationFrameId = requestAnimationFrame(() => {
        const container = pdfContainerRef.current;
        const rect = container.getBoundingClientRect();
        
        // Get mouse/touch position
        let clientX, clientY;
        if (e.type === 'touchmove') {
          clientX = e.touches[0].clientX;
          clientY = e.touches[0].clientY;
        } else {
          clientX = e.clientX;
          clientY = e.clientY;
        }
        
        // Calculate movement from drag start with smoothing
        const deltaX = (clientX - dragStartPos.current.x) / scale;
        const deltaY = (clientY - dragStartPos.current.y) / scale;
        
        // Apply easing for smoother movement
        const easedDeltaX = deltaX * 0.3 + (signaturePosition.x - sigStartPos.current.x) * 0.7;
        const easedDeltaY = deltaY * 0.3 + (signaturePosition.y - sigStartPos.current.y) * 0.7;
        
        // Calculate new position
        const newX = sigStartPos.current.x + easedDeltaX;
        const newY = sigStartPos.current.y + easedDeltaY;
        
        // Keep signature within bounds with buffer
        const buffer = 5;
        const maxX = pdfDimensions.width - signaturePosition.width - buffer;
        const maxY = pdfDimensions.height - signaturePosition.height - buffer;
  
        setSignaturePosition(prev => ({
          ...prev,
          x: Math.max(buffer, Math.min(newX, maxX)),
          y: Math.max(buffer, Math.min(newY, maxY)),
          page: currentPage
        }));
      });
    };
  
    const handleMouseUp = () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      setIsDragging(false);
      // Small snap effect when dropping
      if (signatureRef.current) {
        signatureRef.current.style.transition = 'transform 0.1s ease-out';
        setTimeout(() => {
          if (signatureRef.current) {
            signatureRef.current.style.transition = '';
          }
        }, 100);
      }
    };
  
    const handleTouchMove = (e) => {
      e.preventDefault();
      handleMouseMove(e);
    };
  
    // Add passive: false for better touch performance
    const options = { passive: false };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, options);
    document.addEventListener('touchend', handleMouseUp);
  
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging, signaturePosition, pdfDimensions, currentPage, scale]);


  const loadSignedDocuments = async () => {
    try {
      const data = await toolsAPI.listSignedDocuments();

      console.log("Data:", data);
      const formattedDocs = data.documents.map(doc => ({
        id: doc.id,
        name: doc.name,
        date: new Date(doc.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        size: formatFileSize(doc.size),
        downloadUrl: doc.download_url
      }));
      setSignedDocuments(formattedDocs);

    } catch (error) {
      console.error('Error loading documents:', error);
      showAlert('Failed to load documents', 'error');
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const startDrawing = (e) => {
    if (!canvasRef.current) return;
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (e) => {
    if (!isDrawing || !canvasRef.current) return;
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = e.clientX !== undefined ? e.clientX : e.touches[0].clientX;
    const clientY = e.clientY !== undefined ? e.clientY : e.touches[0].clientY;
    
    const x = (clientX - rect.left) * scaleX;
    const y = (clientY - rect.top) * scaleY;
    
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  
  const stopDrawing = () => {
    setIsDrawing(false);
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      ctx.closePath();
    }
  };

  const clearSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveSignature = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL('image/png');
    setSignatureData(dataUrl);
    setShowSignaturePad(false);
    
    // Auto-position signature if enabled
    if (autoPosition && pdfUrl) {
      const position = {
        x: pdfDimensions.width * 0.7,
        y: pdfDimensions.height * 0.8,
        width: 150,
        height: 75,
        page: currentPage
      };
      setSignaturePosition(position);
      showAlert('Signature saved and positioned!', 'success');
    } else if (pdfUrl) {
      // Default position
      const position = {
        x: pdfDimensions.width * 0.1,
        y: pdfDimensions.height * 0.8,
        width: 150,
        height: 75,
        page: currentPage
      };
      setSignaturePosition(position);
      showAlert('Signature saved! Drag it to position on the PDF.', 'success');
    } else {
      showAlert('Signature saved! Upload a PDF to position it.', 'success');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      showAlert('Please upload a valid PDF file.', 'error');
      return;
    }

    if (file.size > 16 * 1024 * 1024) {
      showAlert('File size must be less than 16MB', 'error');
      return;
    }

    setIsUploading(true);
    setProgress(0);
    setSelectedFile(file);

    try {


      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const data = await toolsAPI.uploadPDF(file);
      console.log("Document", data);
      clearInterval(progressInterval);
      setProgress(100);


      setUploadedFileData(data);
      showAlert('PDF uploaded successfully!', 'success');
      
      // Generate URL for iframe
      const blob = new Blob([file], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);

      // Set default dimensions (A4 at 96 DPI)
      setPdfDimensions({ width: 794, height: 1123 }); // A4 dimensions
      setTotalPages(data.num_pages || 1);

      setTimeout(() => setProgress(0), 1000);

    } catch (error) {
      showAlert(error.message || 'Error uploading file', 'error');
      setSelectedFile(null);
      setPdfUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const startDragging = (e) => {
    if (!signaturePosition || !pdfContainerRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    setIsDragging(true);
    
    const container = pdfContainerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Get mouse/touch position
    let clientX, clientY;
    if (e.type === 'touchstart') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }
    
    // Store starting positions
    dragStartPos.current = { x: clientX, y: clientY };
    sigStartPos.current = { x: signaturePosition.x, y: signaturePosition.y };
    
    // Remove transition during drag for immediate response
    if (signatureRef.current) {
      signatureRef.current.style.transition = 'none';
    }
  };

  const signDocument = async () => {
    if (!selectedFile || !signatureData || !signaturePosition || !uploadedFileData) {
      showAlert('Missing required data for signing.', 'error');
      return;
    }
  
    setIsProcessing(true);
    setProgress(0);
  
    try {
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);
  
      // Convert screen coordinates to PDF coordinates (72 DPI)
      // PDF uses points (1 point = 1/72 inch), screen uses pixels (96 DPI)
      const dpiRatio = 72 / 96; // PDF DPI / Screen DPI
      
      const pdfPosition = {
        x: signaturePosition.x * dpiRatio,
        y: signaturePosition.y * dpiRatio,
        width: signaturePosition.width * dpiRatio,
        height: signaturePosition.height * dpiRatio,
        page: signaturePosition.page
      };

      await toolsAPI.signPDF(
        uploadedFileData.file_id,
        uploadedFileData.filename,
        signatureData,
        pdfPosition
      );
  
      clearInterval(progressInterval);
      setProgress(100);

  

      showAlert('Document signed successfully!', 'success');
      await loadSignedDocuments();
      resetState();

  
      setTimeout(() => setProgress(0), 1000);
  
    } catch (error) {
      showAlert(error.message || 'Error signing document', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetState = () => {
    setSelectedFile(null);
    setUploadedFileData(null);
    setSignatureData(null);
    setSignaturePosition(null);
    setPdfUrl(null);
    setCurrentPage(1);
    setScale(1);
    setPdfDimensions({ width: 794, height: 1123 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: '', type: '' }), 4000);
  };

  const downloadSignedDoc = async (doc) => {
    try {
      const blob = await toolsAPI.downloadSignedPDF(doc.name);
      

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showAlert(`Downloading ${doc.name}...`, 'success');
    } catch (error) {
      showAlert('Error downloading document: ' + error.message, 'error');
    }
  };

  const deleteSignedDoc = async (doc) => {
    try {
      await toolsAPI.deleteDocument(doc.name);



      showAlert('Document deleted successfully!', 'success');
      await loadSignedDocuments();

    } catch (error) {
      showAlert('Error deleting document: ' + error.message, 'error');
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      // Update signature position for new page if needed
      if (signaturePosition) {
        setSignaturePosition(prev => ({
          ...prev,
          page: currentPage - 1
        }));
      }
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
      // Update signature position for new page if needed
      if (signaturePosition) {
        setSignaturePosition(prev => ({
          ...prev,
          page: currentPage + 1
        }));
      }
    }
  };

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3));
  };

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5));
  };

  const fitToWidth = () => {
    if (pdfContainerRef.current) {
      const containerWidth = pdfContainerRef.current.clientWidth;
      const pageWidth = pdfDimensions.width;
      setScale(containerWidth / pageWidth);
    }
  };

  // Handle iframe load
  const handleIframeLoad = () => {
    // Set iframe dimensions based on scale
    if (iframeRef.current) {
      iframeRef.current.style.transform = `scale(${scale})`;
      iframeRef.current.style.transformOrigin = 'top left';
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-8">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-2xl">
              <FaFilePdf className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                PDF Signing Tool
              </h1>
              <p className="text-gray-300 mt-2 text-lg">
                Professional document signing solution
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl h-fit sticky top-8">
              <CardHeader className="pb-4 border-b border-slate-700/30">
                <CardTitle className="flex items-center gap-3 text-xl text-white">
                  <FaFilePdf className="h-6 w-6 text-blue-400" />
                  Document Signing
                </CardTitle>
                <CardDescription className="text-gray-400 mt-1">
                  Upload PDF and add signature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* File Upload */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-white">
                    Upload PDF
                  </Label>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept="application/pdf"
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/50 transition-all"
                  >
                    {isUploading ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4 mr-2" />
                        Upload PDF
                      </>
                    )}
                  </Button>
                  
                  {selectedFile && (
                    <div className="mt-2 p-3 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-lg border border-blue-500/30">
                      <p className="text-sm text-white font-medium truncate">{selectedFile.name}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatFileSize(selectedFile.size)}
                        {uploadedFileData && ` • ${uploadedFileData.num_pages || 1} pages`}
                      </p>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                {(isUploading || isProcessing) && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-300">
                        {isUploading ? 'Uploading...' : 'Processing...'}
                      </span>
                      <span className="text-blue-400 font-semibold">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-slate-700" />
                  </div>
                )}

                {/* Signature Creation */}
                <div className="space-y-3 border-t border-slate-700/30 pt-6">
                  <Label className="text-sm font-semibold text-white">
                    Create Signature
                  </Label>
                  <Button
                    onClick={() => setShowSignaturePad(!showSignaturePad)}
                    variant="outline"
                    className="w-full border-slate-600 bg-slate-700/30 text-white hover:bg-slate-600/50 transition-all"
                  >
                    <MousePointer className="h-4 w-4 mr-2" />
                    {showSignaturePad ? 'Hide Pad' : 'Draw Signature'}
                  </Button>

                  {showSignaturePad && (
                    <div className="mt-3 space-y-3">
                      <div className="border-2 border-slate-600 rounded-xl bg-white/95 overflow-hidden shadow-lg">
                        <canvas
                          ref={canvasRef}
                          width={280}
                          height={150}
                          onMouseDown={startDrawing}
                          onMouseMove={draw}
                          onMouseUp={stopDrawing}
                          onMouseLeave={stopDrawing}
                          onTouchStart={startDrawing}
                          onTouchMove={draw}
                          onTouchEnd={stopDrawing}
                          className="w-full h-37.5 cursor-crosshair touch-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={clearSignature}
                          variant="outline"
                          className="flex-1 border-slate-600 bg-slate-700/30 text-white hover:bg-slate-600/50"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                        <Button
                          onClick={saveSignature}
                          className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white border-0 shadow-lg hover:shadow-emerald-500/50"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  )}

                  {signatureData && !showSignaturePad && (
                    <div className="mt-3 p-3 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-lg border border-emerald-400/50">
                      <div className="bg-white/95 rounded-lg overflow-hidden">
                        <img 
                          src={signatureData} 
                          alt="Signature" 
                          className="w-full h-auto border border-slate-300 rounded-lg" 
                        />
                      </div>
                      <p className="text-xs text-emerald-400 mt-2 text-center font-medium">
                        ✓ Signature ready - Drag to position on PDF
                      </p>
                    </div>
                  )}
                </div>

                {/* Auto-position Toggle */}
                <div className="space-y-3 border-t border-slate-700/30 pt-6">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-position" className="text-sm font-semibold text-white">
                      Auto-position Signature
                    </Label>
                    <Switch
                      id="auto-position"
                      checked={autoPosition}
                      onCheckedChange={setAutoPosition}
                    />
                  </div>
                  <p className="text-xs text-gray-400">
                    Automatically position signature on last page
                  </p>
                </div>

                {/* Sign Document Button */}
                {selectedFile && signatureData && signaturePosition && (
                  <Button
                    onClick={signDocument}
                    disabled={isProcessing}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/50 transition-all mt-6"
                  >
                    {isProcessing ? (
                      <>
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Sign Document
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-800/50 border border-slate-700/30 p-1 rounded-lg">
                <TabsTrigger value="preview" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600">
                  Document Preview
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600">
                  Signed Documents ({signedDocuments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <Card className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl min-h-150">
                  <CardContent className="pt-6">
                    {alert.message && (
                      <Alert className={`mb-4 border-l-4 ${
                        alert.type === 'success' 
                          ? 'bg-emerald-500/10 border-emerald-400/50 text-emerald-300'
                          : 'bg-red-500/10 border-red-400/50 text-red-300'
                      }`}>
                        <AlertDescription className="flex items-center gap-2">
                          {alert.type === 'success' ? 
                            <Check className="h-5 w-5 flex-shrink-0" /> : 
                            <X className="h-5 w-5 flex-shrink-0" />
                          }
                          {alert.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* PDF Viewer Controls */}
                    {uploadedFileData && (
                      <div className="flex flex-col sm:flex-row items-center justify-between mb-4 bg-slate-700/30 rounded-xl p-3 gap-4 border border-slate-700/50">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-white font-medium">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={zoomOut}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600"
                          >
                            −
                          </Button>
                          <span className="text-sm text-white font-medium min-w-12 text-center">{Math.round(scale * 100)}%</span>
                          <Button
                            onClick={zoomIn}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600"
                          >
                            +
                          </Button>
                          <Button
                            onClick={fitToWidth}
                            variant="outline"
                            size="sm"
                            className="border-slate-600 bg-slate-700/50 text-white hover:bg-slate-600"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* PDF Preview Area */}
                    <div className="bg-gradient-to-b from-slate-700/20 to-slate-800/20 rounded-2xl shadow-inner min-h-137.5 flex items-center justify-center relative overflow-auto border border-slate-700/50">
                      {uploadedFileData && pdfUrl ? (
                        <div className="relative w-full h-full p-4">
                          <div 
                            ref={pdfContainerRef}
                            className="w-full h-full min-h-125 border-2 border-slate-600/50 rounded-xl bg-white/5 flex items-center justify-center overflow-auto relative shadow-inner"
                            style={{ position: 'relative', overflow: 'hidden' }}
                          >
                            {/* PDF iframe */}
                            <iframe
                              ref={iframeRef}
                              src={pdfUrl}
                              title="PDF Preview"
                              className="w-full h-full border-none rounded-lg"
                              style={{
                                transform: `scale(${scale})`,
                                transformOrigin: 'top left',
                                width: `${pdfDimensions.width}px`,
                                height: `${pdfDimensions.height}px`,
                              }}
                              onLoad={handleIframeLoad}
                            />
                            
                            {/* Signature overlay */}
                            {signatureData && signaturePosition && signaturePosition.page === currentPage && (
                              <div
                                ref={signatureRef}
                                className="absolute border-2 border-dashed border-blue-400/60 bg-blue-500/5 cursor-move transition-all duration-150 ease-out hover:border-blue-300 hover:bg-blue-500/15 active:border-blue-400 active:bg-blue-500/25 shadow-lg shrink-0"
                                style={{
                                  left: `${signaturePosition.x}px`,
                                  top: `${signaturePosition.y}px`,
                                  width: `${signaturePosition.width}px`,
                                  height: `${signaturePosition.height}px`,
                                  transform: `scale(${scale})`,
                                  transformOrigin: 'top left',
                                  willChange: 'transform, left, top',
                                }}
                                onMouseDown={startDragging}
                                onTouchStart={startDragging}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <img 
                                    src={signatureData} 
                                    alt="Signature" 
                                    className="w-full h-full object-contain pointer-events-none shrink-0"
                                    draggable="false"
                                  />
                                  <div className="absolute -top-3 -right-3 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-1.5 shadow-lg">
                                    <Move className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-3 text-center">
                            {signatureData && signaturePosition ? 
                              "Drag the signature to position it on the page" : 
                              "Draw a signature above to place it on the document"}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 p-12">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center mb-6 mx-auto">
                            <Upload className="h-12 w-12 text-blue-400/80" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            No Document Uploaded
                          </h3>
                          <p className="text-gray-400 text-center mb-6 max-w-sm mx-auto">
                            Upload a PDF document to add your signature. Supports PDF format up to 16MB.
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/50"
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Upload PDF
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <Card className="bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-xl border-slate-700/50 shadow-2xl">
                  <CardContent className="pt-6">
                    {signedDocuments.length === 0 ? (
                      <div className="text-center py-16 text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-40" />
                        <p className="text-lg text-white font-medium">No signed documents yet</p>
                        <p className="text-sm text-gray-400 mt-2">Sign your first document to see it here</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-150 overflow-y-auto pr-2">
                        {signedDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="bg-gradient-to-r from-slate-700/30 to-slate-800/30 backdrop-blur rounded-xl p-4 flex items-center justify-between hover:from-slate-700/50 hover:to-slate-800/50 transition-all border border-slate-600/30 hover:border-slate-600/60"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-2 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-lg shrink-0">
                                <FileText className="w-6 h-6 text-blue-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate">{doc.name}</p>
                                <p className="text-xs text-gray-400">
                                  {doc.date} • {doc.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                              <Button
                                onClick={() => downloadSignedDoc(doc)}
                                variant="outline"
                                size="sm"
                                className="border-emerald-500/50 text-white bg-emerald-600 hover:text-emerald-500 hover:bg-white transition-all"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                onClick={() => deleteSignedDoc(doc)}
                                variant="outline"
                                size="sm"
                                className="border-red-500/50 text-white bg-red-600 hover:text-red-500 hover:bg-white transition-all"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PDFSigningApp;