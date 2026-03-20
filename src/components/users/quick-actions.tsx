
// /src/components/users/quick-actions.tsx
'use client';

import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  userRole: string;
  onAction: (action: string) => void;
}

export function QuickActions({ userRole, onAction }: QuickActionsProps) {
  const actions = [
    { label: 'Edit Profile', icon: '✏️', action: 'edit-profile' },
    // ...(userRole === 'student' ? [{ label: 'Request Upgrade', icon: '🚀', action: 'request-upgrade' }] : []),
    { label: 'Privacy Settings', icon: '👁️', action: 'privacy-settings' },
  ];

  return (
    <div className="bg-white border rounded-lg p-4">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
      <div className="space-y-2">
        {actions.map((item) => (
          <Button
            key={item.action}
            onClick={() => onAction(item.action)}
            variant="outline"
            size="sm"
            className="w-full cursor-pointer justify-start text-sm"
          >
            <span className="mr-2">{item.icon}</span>
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}