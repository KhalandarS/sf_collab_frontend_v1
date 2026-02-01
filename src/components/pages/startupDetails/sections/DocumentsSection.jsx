import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { reduceText } from "@/utils/reduceText";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
import UploadDocumentModal from "../modals/UploadDocument";
import { useState } from "react";
import { toast } from "react-toastify";
import { startupsAPI } from "@/utils/APIs/startupsAPI";
export default function DocumentsSection({ documents, isCreator, id, fetchStartupData }) {
  const [isUploadDocModalOpen, setIsUploadDocModalOpen] = useState(false);
  const [documentForm, setDocumentForm] = useState({
      document: null,
      document_type: 'general'
    });
  const isMobile = window.matchMedia("(max-width: 768px)").matches;

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
      const response = await startupsAPI.uploadDocument(id, formData);
        
      if (response.success) {
        toast.success('Document uploaded successfully');
        setIsUploadDocModalOpen(false);
        setDocumentForm({ document: null, document_type: 'general' });
        fetchStartupData();
      } else {
        throw new Error(response.error || 'Upload failed');
      }
    } catch {
      toast.error('Error uploading document');
    }
  };
  const downloadDocument = async (documentId, filename) => {
    try {
      const response = await startupsAPI.downloadDocument(id, documentId);
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
  const handleDocumentDelete = async (documentId) => {
    try {
      const response = await startupsAPI.deleteDocument(id, documentId);

      if (response.success) {
        toast.success('Document deleted successfully');
        fetchStartupData();
      } else {
        throw new Error('Delete failed');
      }
    } catch {
      toast.error('Error deleting document');
    }
  };
  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Documents</h2>
          {isCreator && (
            <Button onClick={() => setIsUploadDocModalOpen(true)} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          )}
        </div>

        <div className="grid gap-4">
          {documents.map((doc, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {
                      !isMobile && <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-blue-400" />
                      </div>
                    }
                    <div>
                      <h3 className="text-white font-small">{reduceText(doc.filename, 20)}</h3>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mt-1">
                        <span className="capitalize">{doc.document_type}</span>
                        <span>{(doc.file_size / 1024 / 1024).toFixed(2)} MB</span>
                        <span>{new Date(doc.uploaded_at).toLocaleDateString()}</span>
                        <span>{doc.visible_by[0].toUpperCase() + doc.visible_by.slice(1)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => downloadDocument(doc.id, doc.filename)}
                      className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    {isCreator && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentDelete(doc.id)}
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
      
      <UploadDocumentModal
        isOpen={isUploadDocModalOpen}
        onClose={() => setIsUploadDocModalOpen(false)}
        onSubmit={handleDocumentUpload}
        formData={documentForm}
        onFormChange={setDocumentForm}
        onJoinClick={() => setIsUploadDocModalOpen(true)}
              
      />
    </>
  );
}
