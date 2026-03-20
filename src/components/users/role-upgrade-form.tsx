

// // /src/components/users/role-upgrade-form.tsx
// Form to request role upgrade (student→instructor)

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { submitRoleUpgradeRequest } from '@/lib/auth/role-actions';
import { toast } from 'sonner';

interface AvailableRole {
  id: string;
  name: string;
  description: string;
  permissions: Record<string, boolean>;
}

interface RoleUpgradeFormProps {
  availableRoles: AvailableRole[];
}

export function RoleUpgradeForm({ availableRoles }: RoleUpgradeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    requestedRole: '',
    justification: '',
    qualifications: '',
    portfolioLinks: '',
    teachingExperience: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await submitRoleUpgradeRequest({
        requestedRole: formData.requestedRole,
        justification: formData.justification,
        qualifications: formData.qualifications || undefined,
        portfolioLinks: formData.portfolioLinks ? formData.portfolioLinks.split('\n').filter(link => link.trim()) : undefined,
        teachingExperience: formData.teachingExperience || undefined,
      });

      if (result.success) {
        toast.success('Role upgrade request submitted!', {
          description: 'Your request has been sent to administrators for review.',
        });
        // Reset form
        setFormData({
          requestedRole: '',
          justification: '',
          qualifications: '',
          portfolioLinks: '',
          teachingExperience: '',
        });
        
        // Reload the page after a delay to show the new request
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        toast.error('Failed to submit request', {
          description: result.errors?.[0] || result.message,
        });
      }
    } catch (error) {
      toast.error('An error occurred', {
        description: 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const selectedRole = availableRoles.find(role => role.name === formData.requestedRole);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Role Upgrade</CardTitle>
        <CardDescription>
          Submit a request to upgrade your account permissions. Administrators will review your application.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Selection */}
          <div className="space-y-2">
            <label htmlFor="requestedRole" className="text-sm font-medium">
              Requested Role *
            </label>
            <select
              id="requestedRole"
              value={formData.requestedRole}
              onChange={(e) => handleChange('requestedRole', e.target.value)}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a role...</option>
              {availableRoles.map((role) => (
                <option key={role.id} value={role.name}>
                  {role.name} - {role.description}
                </option>
              ))}
            </select>
          </div>

          {/* Role Description */}
          {selectedRole && (
            <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 mb-1">
                {selectedRole.name} Permissions
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {Object.entries(selectedRole.permissions).map(([permission, enabled]) => (
                  enabled && (
                    <li key={permission} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                      {permission.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </li>
                  )
                ))}
              </ul>
            </div>
          )}

          {/* Justification */}
          <div className="space-y-2">
            <label htmlFor="justification" className="text-sm font-medium">
              Why do you want this role? *
            </label>
            <textarea
              id="justification"
              value={formData.justification}
              onChange={(e) => handleChange('justification', e.target.value)}
              required
              rows={3}
              placeholder="Explain why you're requesting this role and how you plan to use it..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
            />
          </div>

          {/* Qualifications */}
          <div className="space-y-2">
            <label htmlFor="qualifications" className="text-sm font-medium">
              Relevant Qualifications
            </label>
            <textarea
              id="qualifications"
              value={formData.qualifications}
              onChange={(e) => handleChange('qualifications', e.target.value)}
              rows={2}
              placeholder="List your relevant qualifications, certifications, or experience..."
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px]"
            />
          </div>

          {/* Portfolio Links */}
          <div className="space-y-2">
            <label htmlFor="portfolioLinks" className="text-sm font-medium">
              Portfolio Links (one per line)
            </label>
            <textarea
              id="portfolioLinks"
              value={formData.portfolioLinks}
              onChange={(e) => handleChange('portfolioLinks', e.target.value)}
              rows={2}
              placeholder="https://github.com/yourusername&#10;https://linkedin.com/in/yourprofile&#10;https://yourportfolio.com"
              className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px] font-mono text-sm"
            />
          </div>

          {/* Teaching Experience (for instructor roles) */}
          {(formData.requestedRole === 'instructor' || formData.requestedRole === 'teaching_assistant') && (
            <div className="space-y-2">
              <label htmlFor="teachingExperience" className="text-sm font-medium">
                Teaching Experience
              </label>
              <textarea
                id="teachingExperience"
                value={formData.teachingExperience}
                onChange={(e) => handleChange('teachingExperience', e.target.value)}
                rows={2}
                placeholder="Describe your teaching, mentoring, or instructional experience..."
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[60px]"
              />
            </div>
          )}

          {/* Submit Button */}
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full cursor-pointer"
          >
            {isSubmitting ? 'Submitting Request...' : 'Submit Upgrade Request'}
          </Button>

          <p className="text-xs text-gray-500 text-center">
            Your request will be reviewed by administrators. You'll be notified of the decision.
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

