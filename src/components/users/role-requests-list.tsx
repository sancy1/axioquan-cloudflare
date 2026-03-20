// /src/components/users/role-requests-list.tsx

'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { deleteUserRoleRequest, permanentlyRemoveRoleRequest, clearAllRoleRequests } from '@/lib/auth/role-actions';
import { toast } from 'sonner';
import { useServerEvents } from '@/hooks/use-server-events';

interface RoleRequest {
  id: string;
  requested_role_name: string;
  justification: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  rejection_reason?: string;
  admin_notes?: string;
  qualifications?: string;
  portfolio_links?: string[];
  teaching_experience?: string;
}

interface RoleRequestsListProps {
  requests: RoleRequest[];
}

export function RoleRequestsList({ requests: initialRequests }: RoleRequestsListProps) {
  const [requests, setRequests] = useState<RoleRequest[]>(initialRequests);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [clearingAll, setClearingAll] = useState(false);
  
  // Use real-time updates
  const { lastEvent, isConnected } = useServerEvents();

  useEffect(() => {
    setRequests(initialRequests);
  }, [initialRequests]);

  // Handle real-time events
  useEffect(() => {
    if (lastEvent) {
      switch (lastEvent.event) {
        case 'role_request_updated':
          console.log('🔄 Updating request status:', lastEvent.data);
          // Update the specific request
          setRequests(prev => prev.map(req => 
            req.id === lastEvent.data.requestId 
              ? { ...req, status: lastEvent.data.status, reviewed_at: lastEvent.data.timestamp }
              : req
          ));
          break;
        case 'role_request_deleted':
          console.log('🗑️ Removing deleted request:', lastEvent.data);
          // Remove the deleted request
          setRequests(prev => prev.filter(req => req.id !== lastEvent.data.requestId));
          break;
        default:
          break;
      }
    }
  }, [lastEvent]);

  const handleDeleteRequest = async (requestId: string) => {
    if (!confirm('Are you sure you want to delete this request? This action cannot be undone.')) {
      return;
    }

    setDeletingId(requestId);
    try {
      const result = await deleteUserRoleRequest(requestId);
      
      if (result.success) {
        toast.success('Request deleted successfully');
        // Remove from local state immediately
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast.error(result.message || 'Failed to delete request');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the request');
    } finally {
      setDeletingId(null);
    }
  };

  const handlePermanentlyRemove = async (requestId: string) => {
    if (!confirm('Are you sure you want to permanently remove this request from your history? This action cannot be undone.')) {
      return;
    }

    setDeletingId(requestId);
    try {
      const result = await permanentlyRemoveRoleRequest(requestId);
      
      if (result.success) {
        toast.success('Request permanently removed');
        // Remove from local state immediately
        setRequests(prev => prev.filter(req => req.id !== requestId));
      } else {
        toast.error(result.message || 'Failed to remove request');
      }
    } catch (error) {
      toast.error('An error occurred while removing the request');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Are you sure you want to clear ALL your role request history? This action cannot be undone and will remove all your requests permanently.')) {
      return;
    }

    setClearingAll(true);
    try {
      const result = await clearAllRoleRequests();
      
      if (result.success) {
        toast.success(`Cleared ${result.deletedCount} requests successfully`);
        // Clear all requests from local state
        setRequests([]);
      } else {
        toast.error(result.message || 'Failed to clear requests');
        if (result.errors) {
          result.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      toast.error('An error occurred while clearing requests');
    } finally {
      setClearingAll(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: 'Pending Review', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      approved: { label: 'Approved', variant: 'default' as const, color: 'bg-green-100 text-green-800 border-green-200' },
      rejected: { label: 'Rejected', variant: 'destructive' as const, color: 'bg-red-100 text-red-800 border-red-200' },
      under_review: { label: 'Under Review', variant: 'default' as const, color: 'bg-blue-100 text-blue-800 border-blue-200' },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || { 
      label: status, 
      variant: 'secondary' as const,
      color: 'bg-gray-100 text-gray-800 border-gray-200'
    };
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Role Requests</CardTitle>
          <CardDescription>
            Track the status of your role upgrade requests here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">No role requests found</p>
            <p className="text-sm">Submit a request above to get started.</p>
            <div className="mt-4 flex items-center justify-center text-sm">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
              {isConnected ? 'Live updates active' : 'Connecting...'}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="text-lg font-semibold">Your Requests ({requests.length})</h3>
          <div className="flex items-center text-sm mt-1">
            <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-gray-500'}`}></div>
            {isConnected ? 'Live updates' : 'Connecting...'}
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => window.location.reload()}
            className="text-sm cursor-pointer text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1 rounded"
          >
            Refresh
          </button>
          {requests.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              disabled={clearingAll}
              className="text-red-600 cursor-pointer border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              {clearingAll ? 'Clearing...' : 'Clear All'}
            </Button>
          )}
        </div>
      </div>
      
      {requests.map((request) => (
        <Card key={request.id} className="overflow-hidden border-l-4 border-l-blue-500 relative">
          {/* Action Buttons */}
          <div className="absolute top-3 right-3 flex space-x-2">
            {/* Delete Button - Only show for pending requests */}
            {request.status === 'pending' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDeleteRequest(request.id)}
                disabled={deletingId === request.id}
                className="text-red-600 cursor-pointer border-red-300 hover:bg-red-50 hover:text-red-700"
              >
                {deletingId === request.id ? 'Deleting...' : 'Delete'}
              </Button>
            )}
            
            {/* Permanent Remove Button - Show for all requests */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePermanentlyRemove(request.id)}
              disabled={deletingId === request.id}
              className="text-gray-600 cursor-pointer border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              title="Permanently remove from history"
            >
              {deletingId === request.id ? 'Removing...' : 'Remove'}
            </Button>
          </div>
          
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  {request.requested_role_name.replace('_', ' ').toUpperCase()}
                  {getStatusBadge(request.status)}
                </CardTitle>
                <CardDescription>
                  Submitted on {formatDate(request.created_at)}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <h4 className="font-medium text-sm text-gray-700 mb-1">Justification:</h4>
              <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.justification}</p>
            </div>

            {request.qualifications && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Qualifications:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.qualifications}</p>
              </div>
            )}

            {request.teaching_experience && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Teaching Experience:</h4>
                <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">{request.teaching_experience}</p>
              </div>
            )}

            {request.portfolio_links && request.portfolio_links.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-gray-700 mb-1">Portfolio Links:</h4>
                <div className="space-y-1 bg-gray-50 p-2 rounded">
                  {request.portfolio_links.map((link, index) => (
                    <a 
                      key={index}
                      href={link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:underline text-sm break-all"
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            )}

            {request.reviewed_at && (
              <div className="flex items-center text-sm">
                <span className="font-medium text-gray-700 mr-2">
                  {request.status === 'approved' ? 'Approved' : 'Rejected'} on:
                </span>
                <span className="text-gray-600">{formatDate(request.reviewed_at)}</span>
              </div>
            )}

            {request.rejection_reason && (
              <div className="bg-red-50 border border-red-200 rounded p-3">
                <h4 className="font-medium text-sm text-red-700 mb-1">Rejection Reason:</h4>
                <p className="text-sm text-red-600">{request.rejection_reason}</p>
              </div>
            )}

            {request.admin_notes && (
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <h4 className="font-medium text-sm text-blue-700 mb-1">Admin Notes:</h4>
                <p className="text-sm text-blue-600">{request.admin_notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      
      {/* Clear All Section */}
      {requests.length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <div className="flex justify-between items-center">
            <div>
              <h4 className="font-medium text-gray-900">Clear All History</h4>
              <p className="text-sm text-gray-600">
                Remove all {requests.length} role requests from your history permanently.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleClearAll}
              disabled={clearingAll}
              className="text-red-600 cursor-pointer border-red-300 hover:bg-red-50 hover:text-red-700"
            >
              {clearingAll ? 'Clearing All...' : 'Clear All History'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}