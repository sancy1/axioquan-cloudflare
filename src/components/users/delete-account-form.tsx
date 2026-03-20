// /src/components/users/delete-account-form.tsx - FIXED VERSION

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { deleteAccountAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

export function DeleteAccountForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmationText, setConfirmationText] = useState('');

  const handleDeleteAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!showConfirmation) {
      setShowConfirmation(true);
      return;
    }

    // Final confirmation
    if (confirmationText !== 'delete my account') {
      toast.error('Confirmation text does not match', {
        description: 'Please type "delete my account" to confirm.',
      });
      return;
    }

    if (!password) {
      toast.error('Password required', {
        description: 'Please enter your password to confirm account deletion.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await deleteAccountAction(password);

      if (result.success) {
        toast.success('Account deleted successfully', {
          description: 'Your account and all associated data have been permanently deleted.',
        });
        // Redirect will happen from server action
      } else {
        toast.error('Account deletion failed', {
          description: result.errors?.[0] || result.message,
        });
        // Reset form on failure
        setShowConfirmation(false);
        setPassword('');
        setConfirmationText('');
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please try again later.',
      });
      setShowConfirmation(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setPassword('');
    setConfirmationText('');
  };

  return (
    <Card className="border-red-200 bg-red-50/50"> {/* Added transparency */}
      <CardHeader>
        {/* FIXED: Better color contrast */}
        <CardTitle className="text-red-800">Delete Account</CardTitle>
        <CardDescription className="text-red-700/90"> {/* Added opacity */}
          Permanently delete your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!showConfirmation ? (
          <div className="space-y-4">
            {/* FIXED: Better visibility */}
            <Alert variant="error" className="bg-red-100 border-red-300">
              <AlertDescription className="text-red-800">
                <strong className="text-red-900">Warning:</strong> This will permanently remove your account, profile, 
                courses, and all associated data. You will lose access to all platform features.
              </AlertDescription>
            </Alert>
            
            <Button
              type="button"
              variant="destructive"
              onClick={() => setShowConfirmation(true)}
              className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white" // Added text-white
            >
              Delete My Account
            </Button>
          </div>
        ) : (
          <form onSubmit={handleDeleteAccount} className="space-y-4">
            {/* FIXED: Better visibility */}
            <Alert variant="error" className="bg-red-100 border-red-300">
              <AlertDescription className="text-red-800">
                <strong className="text-red-900">Final Confirmation Required</strong>
                <br />
                This action is irreversible. Please confirm by entering your password and typing the confirmation text.
              </AlertDescription>
            </Alert>

            <div className="space-y-2">
              {/* FIXED: Better label color */}
              <label htmlFor="password" className="text-sm font-medium text-gray-900">
                Current Password *
              </label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your current password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="border-red-300 focus:border-red-500 bg-white" // Added bg-white
              />
            </div>

            <div className="space-y-2">
              {/* FIXED: Better label color */}
              <label htmlFor="confirmationText" className="text-sm font-medium text-gray-900">
                Type "delete my account" to confirm *
              </label>
              <Input
                id="confirmationText"
                type="text"
                placeholder="delete my account"
                value={confirmationText}
                onChange={(e) => setConfirmationText(e.target.value)}
                required
                disabled={isLoading}
                className="border-red-300 focus:border-red-500 font-mono bg-white" // Added bg-white
              />
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                variant="destructive"
                disabled={isLoading || confirmationText !== 'delete my account' || !password}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white" // Added text-white
              >
                {isLoading ? 'Deleting Account...' : 'Permanently Delete Account'}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="flex-1 border-red-300 text-red-700 hover:bg-red-100 hover:text-red-800" // Improved hover
              >
                Cancel
              </Button>
            </div>

            {/* FIXED: Better text color */}
            <p className="text-xs text-gray-600 text-center">
              By confirming, you acknowledge that this action cannot be undone.
            </p>
          </form>
        )}
      </CardContent>
    </Card>
  );
}