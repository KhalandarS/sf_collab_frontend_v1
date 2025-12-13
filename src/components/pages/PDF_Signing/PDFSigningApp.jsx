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

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const response = await fetch(`${API_BASE_URL}/pdf/documents`);
      const data = await response.json();
      
      if (data.success) {
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
      }
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
      const formData = new FormData();
      formData.append('file', file);

      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch(`${API_BASE_URL}/pdf/upload`, {
        method: 'POST',
        body: formData
      });

      clearInterval(progressInterval);
      setProgress(100);

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

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
  
      const response = await fetch(`${API_BASE_URL}/pdf/sign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          file_id: uploadedFileData.file_id,
          filename: uploadedFileData.filename,
          original_filename: uploadedFileData.original_filename,
          signature: signatureData,
          position: pdfPosition // Use converted position
        })
      });
  
      clearInterval(progressInterval);
      setProgress(100);
  
      const data = await response.json();
  
      if (!response.ok) {
        throw new Error(data.error || 'Signing failed');
      }
  
      if (data.success) {
        showAlert('Document signed successfully!', 'success');
        await loadSignedDocuments();
        resetState();
      }
  
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
      const response = await fetch(`${API_BASE_URL}/pdf/download/${doc.id}`);
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
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
      const response = await fetch(`${API_BASE_URL}/pdf/delete/${doc.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        showAlert('Document deleted successfully!', 'success');
        await loadSignedDocuments();
      } else {
        showAlert(data.error || 'Delete failed', 'error');
      }
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
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div  className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-linear-to-r from-blue-400 to-blue-600 rounded-2xl shadow-lg">
              <FaFilePdf className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl py-3 font-bold bg-linear-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
                PDF Signing Tool
              </h1>
              <p style={{fontFamily: "Trade Winds"}} className="text-gray-300 mt-1">
                Professional document signing solution
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Left Panel - Controls */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg h-fit sticky top-8">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg text-white">
                  <FaFilePdf className="h-5 w-5 text-blue-400" />
                  Document Signing
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Upload PDF and add signature
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
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
                    className="w-full bg-linear-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-0"
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
                    <div className="mt-2 p-3 bg-gray-700/30 rounded-lg">
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
                      <span className="text-blue-400">{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-gray-700" />
                  </div>
                )}

                {/* Signature Creation */}
                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-white">
                    Create Signature
                  </Label>
                  <Button
                    onClick={() => setShowSignaturePad(!showSignaturePad)}
                    variant="outline"
                    className="w-full border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600"
                  >
                    <MousePointer className="h-4 w-4 mr-2" />
                    {showSignaturePad ? 'Hide Pad' : 'Draw Signature'}
                  </Button>

                  {showSignaturePad && (
                    <div className="mt-3 space-y-3">
                      <div className="border-2 border-gray-600 rounded-lg bg-white/90 overflow-hidden">
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
                          className="w-full h-[150px] cursor-crosshair touch-none"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={clearSignature}
                          variant="outline"
                          className="flex-1 border-gray-600 bg-gray-700/50 text-white hover:bg-gray-600"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Clear
                        </Button>
                        <Button
                          onClick={saveSignature}
                          className="flex-1 bg-linear-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white border-0"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                      </div>
                    </div>
                  )}

                  {signatureData && !showSignaturePad && (
                    <div className="mt-3 p-3 bg-gray-700/30 rounded-lg border border-green-400/30">
                      <div className="bg-white/90 rounded">
                        <img 
                          src={signatureData} 
                          alt="Signature" 
                          className="w-full h-auto border border-gray-600 rounded" 
                        />
                      </div>
                      <p className="text-xs text-green-400 mt-2 text-center font-medium">
                        ✓ Signature ready - Drag to position on PDF
                      </p>
                    </div>
                  )}
                </div>

                {/* Auto-position Toggle */}
                <div className="space-y-3">
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
                    className="w-full bg-linear-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-0"
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
              <TabsList className="grid w-full grid-cols-2 bg-gray-700/50">
                <TabsTrigger value="preview" className="text-white data-[state=active]:bg-blue-500">
                  Document Preview
                </TabsTrigger>
                <TabsTrigger value="documents" className="text-white data-[state=active]:bg-blue-500">
                  Signed Documents ({signedDocuments.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview">
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg min-h-[600px]">
                  <CardContent className="pt-6">
                    {alert.message && (
                      <Alert className={`mb-4 ${
                        alert.type === 'success' 
                          ? 'bg-green-400/10 border-green-400/30 text-green-300'
                          : 'bg-red-400/10 border-red-400/30 text-red-300'
                      }`}>
                        <AlertDescription className="flex items-center gap-2">
                          {alert.type === 'success' ? 
                            <Check className="h-4 w-4" /> : 
                            <X className="h-4 w-4" />
                          }
                          {alert.message}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* PDF Viewer Controls */}
                    {uploadedFileData && (
                      <div className="flex items-center justify-between mb-4 bg-gray-700/30 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={goToPrevPage}
                            disabled={currentPage === 1}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 bg-gray-700/50 text-white"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-sm text-white">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            onClick={goToNextPage}
                            disabled={currentPage === totalPages}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 bg-gray-700/50 text-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={zoomOut}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 bg-gray-700/50 text-white"
                          >
                            -
                          </Button>
                          <span className="text-sm text-white">{Math.round(scale * 100)}%</span>
                          <Button
                            onClick={zoomIn}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 bg-gray-700/50 text-white"
                          >
                            +
                          </Button>
                          <Button
                            onClick={fitToWidth}
                            variant="outline"
                            size="sm"
                            className="border-gray-600 bg-gray-700/50 text-white"
                          >
                            <Maximize2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* PDF Preview Area */}
                    <div className="bg-gray-700/30 rounded-xl shadow-inner min-h-[550px] flex items-center justify-center relative overflow-auto">
                      {uploadedFileData && pdfUrl ? (
                        <div className="relative w-full h-full p-4">
                          <div 
                            ref={pdfContainerRef}
                            className="w-full h-full min-h-[500px] border-2 border-gray-600 rounded-lg bg-white flex items-center justify-center overflow-auto relative"
                            style={{ position: 'relative', overflow: 'hidden' }}
                          >
                            {/* PDF iframe */}
                            <iframe
                              ref={iframeRef}
                              src={pdfUrl}
                              title="PDF Preview"
                              className="w-full h-full border-none"
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
                                className="absolute border-2 border-dashed border-blue-400 bg-blue-400/10 cursor-move transition-transform duration-150 ease-out hover:border-blue-300 hover:bg-blue-400/20 active:border-blue-500 active:bg-blue-400/30"
                                style={{
                                  left: `${signaturePosition.x}px`,
                                  top: `${signaturePosition.y}px`,
                                  width: `${signaturePosition.width}px`,
                                  height: `${signaturePosition.height}px`,
                                  transform: `scale(${scale})`,
                                  transformOrigin: 'top left',
                                  willChange: 'transform, left, top', // Hint to browser for smoother animations
                                }}
                                onMouseDown={startDragging}
                                onTouchStart={startDragging}
                              >
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <img 
                                    src={signatureData} 
                                    alt="Signature" 
                                    className="w-full h-full object-contain pointer-events-none select-none"
                                    draggable="false"
                                  />
                                  <div className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full p-1 shadow-lg">
                                    <Move className="h-3 w-3" />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-400 mt-2 text-center">
                            {signatureData && signaturePosition ? 
                              "Drag the signature to position it on the page" : 
                              "Draw a signature above to place it on the document"}
                          </p>
                        </div>
                      ) : (
                        <div className="text-center text-gray-400 p-8">
                          <div className="w-24 h-24 rounded-full bg-linear-to-r from-blue-400/10 to-blue-600/10 flex items-center justify-center mb-4 mx-auto">
                            <Upload className="h-12 w-12 text-blue-400" />
                          </div>
                          <h3 className="text-lg font-semibold text-white mb-2">
                            No Document Uploaded
                          </h3>
                          <p className="text-gray-400 text-center mb-6 max-w-sm">
                            Upload a PDF document to add your signature. Supports PDF format up to 16MB.
                          </p>
                          <Button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-linear-to-r from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white border-0"
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
                <Card className="bg-gray-800/50 backdrop-blur-sm border-gray-700 shadow-lg">
                  <CardContent className="pt-6">
                    {signedDocuments.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg text-white">No signed documents yet</p>
                        <p className="text-sm text-gray-400 mt-2">Sign your first document to see it here</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[600px] overflow-y-auto">
                        {signedDocuments.map((doc) => (
                          <div
                            key={doc.id}
                            className="bg-gray-700/30 backdrop-blur rounded-xl p-4 flex items-center justify-between hover:bg-gray-700/50 transition-all border border-gray-600"
                          >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <div className="p-2 bg-blue-400/10 rounded-lg">
                                <FileText className="w-6 h-6 text-blue-400" />
                              </div>
                              <div className="min-w-0">
                                <p className="font-semibold text-white truncate">{doc.name}</p>
                                <p className="text-xs text-gray-400">
                                  {doc.date} • {doc.size}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                onClick={() => downloadSignedDoc(doc)}
                                variant="outline"
                                size="sm"
                                className="border-green-400/50 text-green-400 hover:bg-green-400/10"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                onClick={() => deleteSignedDoc(doc)}
                                variant="outline"
                                size="sm"
                                className="border-red-400/50 text-red-400 hover:bg-red-400/10"
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