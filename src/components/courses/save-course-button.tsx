'use client';

// /src/components/courses/save-course-button.tsx

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { toggleSaveCourseAction, getIsCourseSavedAction } from '@/lib/courses/saved-courses-actions';

interface SaveCourseButtonProps {
  courseId: string;
  initialSaved?: boolean;
  size?: 'default' | 'sm' | 'lg' | 'icon';
  showLabel?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

export function SaveCourseButton({
  courseId,
  initialSaved = false,
  size = 'default',
  showLabel = false,
  className,
  variant = 'outline',
}: SaveCourseButtonProps) {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isLoading, setIsLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const { toast } = useToast();

  // Fetch the real saved state on mount
  useEffect(() => {
    let cancelled = false;
    getIsCourseSavedAction(courseId).then((saved) => {
      if (!cancelled) {
        setIsSaved(saved);
        setHydrated(true);
      }
    });
    return () => { cancelled = true; };
  }, [courseId]);

  const handleToggle = async () => {
    if (isLoading) return;
    setIsLoading(true);

    // Optimistic update
    const previous = isSaved;
    setIsSaved(!isSaved);

    try {
      const result = await toggleSaveCourseAction(courseId);

      if (!result.success) {
        setIsSaved(previous); // revert

        if (result.requiresAuth) {
          toast({
            title: 'Sign in required',
            description: 'Please sign in to save courses',
            variant: 'destructive',
          });
          return;
        }

        toast({
          title: 'Error',
          description: result.message || 'Failed to update saved course',
          variant: 'destructive',
        });
        return;
      }

      toast({
        title: ('saved' in result && result.saved) ? 'Course saved!' : 'Course removed',
        description: ('saved' in result && result.saved)
          ? 'Added to your saved courses'
          : 'Removed from saved courses',
      });
    } catch {
      setIsSaved(previous);
      toast({ title: 'Error', description: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const iconSize = size === 'lg' ? 20 : size === 'sm' ? 14 : 16;

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggle}
      disabled={isLoading}
      aria-label={isSaved ? 'Remove from saved courses' : 'Save course'}
      title={isSaved ? 'Remove from saved courses' : 'Save for later'}
      className={cn(
        'transition-all duration-200 gap-2',
        isSaved && 'text-amber-400 border-amber-400/60 hover:text-amber-300 hover:border-amber-300/60',
        !hydrated && 'opacity-70',
        className,
      )}
    >
      {isSaved ? (
        <BookmarkCheck
          size={iconSize}
          className={cn('transition-transform duration-200', isSaved && 'scale-110 fill-amber-400')}
        />
      ) : (
        <Bookmark
          size={iconSize}
          className="transition-transform duration-200 hover:scale-110"
        />
      )}
      {showLabel && (
        <span className="text-sm font-medium">
          {isSaved ? 'Saved' : 'Save'}
        </span>
      )}
    </Button>
  );
}
