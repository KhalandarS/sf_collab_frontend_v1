import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function UploadDocumentModal({ isOpen, onClose, onSubmit, formData, onFormChange }) {
  return (
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
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Visibility</label>
            <Select value={formData.visible_by || 'private'} onValueChange={(value) => onFormChange({ ...formData, visible_by: value })}>
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="bg-gray-800 border-gray-600"
              >
                <SelectItem value="private" className="text-white">Just Me</SelectItem>
                <SelectItem value="team" className="text-white">Team Only</SelectItem>
                <SelectItem value="public" className="text-white">Public</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 border-gray-600 text-black">
              Cancel
            </Button>
            <Button type="submit" className={`flex-1 bg-blue-600 hover:bg-blue-700 ${!formData.document ? 'opacity-50 cursor-not-allowed' : ''}`} disabled={!formData.document}>
              Upload
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}