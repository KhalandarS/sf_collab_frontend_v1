import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, FileText, Download, Trash2 } from "lucide-react";
export default function DocumentsSection({ onJoinClick, documents, isCreator, onDownload, onDelete }) {
  const reduceText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  }
  const isMobile = window.matchMedia("(max-width: 768px)").matches;
  return (
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
}
