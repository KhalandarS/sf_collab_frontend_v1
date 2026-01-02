
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { 
  Search
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

import { Input } from '../ui/input';
import { Button } from '../ui/button';
export default function FilterSidebar({ searchQuery, setSearchQuery, selectedRole, setSelectedRole, selectedStatus, setSelectedStatus, clearFilters, activeFiltersCount, roleOptions, statusOptions }) {
  return (
    <Card className="p-6 bg-transparent border-0 w-full mb-6">
      <div className="flex flex-col lg:flex-row gap-6 w-full items-end">
        {/* Search Bar */}
        <div className="flex-1">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Search</h4>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-gray-700 border-gray-600 text-white w-full"
              style={{ minWidth: '200px' }}
            />
          </div>
        </div>

        {/* Role Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Role</h4>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger style={{ width: '150px' }} className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="--" className="text-white hover:bg-gray-700">All Roles</SelectItem>
              {roleOptions.map(role => (
                <SelectItem key={role} value={role} className="text-white hover:bg-gray-700">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-300 mb-2">Status</h4>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger style={{ width: '150px' }} className="bg-gray-700 border-gray-600 text-white">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="--" className="text-white hover:bg-gray-700">All Status</SelectItem>
              {statusOptions.map(status => (
                <SelectItem key={status} value={status} className="text-white hover:bg-gray-700">
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-blue-400 hover:text-blue-300 text-xs h-8"
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}