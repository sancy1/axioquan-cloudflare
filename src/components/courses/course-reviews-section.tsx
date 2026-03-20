
// // /src/components/courses/course-reviews-section.tsx

// 'use client';

// import { useState, useEffect } from 'react';
// import { CourseReview, ReviewStats } from '@/types/reviews';
// import { ReviewForm } from '@/components/reviews/review-form';
// import { ReviewReactions } from '@/components/reviews/review-reactions';
// import { ReviewReplies } from '@/components/reviews/review-replies';
// import { StarRating } from '@/components/reviews/star-rating';
// import { Card, CardContent } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Star, MessageCircle, Calendar, RefreshCw } from 'lucide-react';

// interface CourseReviewsSectionProps {
//   courseId: string;
//   courseSlug: string;
//   className?: string;
// }

// export function CourseReviewsSection({ courseId, courseSlug, className }: CourseReviewsSectionProps) {
//   const [reviews, setReviews] = useState<CourseReview[]>([]);
//   const [stats, setStats] = useState<ReviewStats | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [showReviewForm, setShowReviewForm] = useState(false);
//   const [refreshing, setRefreshing] = useState(false);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [currentUserId, setCurrentUserId] = useState<string | undefined>();

//   // Check authentication status on component mount
//   useEffect(() => {
//     checkAuthStatus();
//     fetchReviews();
//   }, [courseId]);

//   const checkAuthStatus = async () => {
//     try {
//       const response = await fetch('/api/auth/status');
//       const data = await response.json();
//       setIsAuthenticated(data.isAuthenticated);
//       setCurrentUserId(data.user?.id);
//     } catch (error) {
//       console.error('Error checking auth status:', error);
//       setIsAuthenticated(false);
//     }
//   };

//   const fetchReviews = async () => {
//     try {
//       console.log('🔄 Fetching reviews for course:', courseId);
//       setRefreshing(true);
      
//       const response = await fetch(`/api/courses/${courseId}/reviews`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const contentType = response.headers.get('content-type');
//       if (!contentType || !contentType.includes('application/json')) {
//         throw new Error('Received non-JSON response from server');
//       }

//       const data = await response.json();
      
//       console.log('📥 Reviews API response:', {
//         success: data.success,
//         reviewsCount: data.reviews?.length,
//         stats: data.stats
//       });

//       if (data.success) {
//         setReviews(data.reviews || []);
//         setStats(data.stats);
//       } else {
//         throw new Error(data.error || 'Failed to fetch reviews');
//       }
//     } catch (error: any) {
//       console.error('❌ Error fetching reviews:', error);
      
//       // Set empty state on error
//       setReviews([]);
//       setStats({
//         average_rating: 0,
//         total_reviews: 0,
//         rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
//       });
//     } finally {
//       setLoading(false);
//       setRefreshing(false);
//     }
//   };

//   const handleReviewSubmitted = async () => {
//     console.log('✅ Review submitted, refreshing reviews...');
//     setShowReviewForm(false);
    
//     // Small delay to ensure the API has processed the new review
//     setTimeout(() => {
//       fetchReviews();
//     }, 500);
//   };

//   const handleWriteReviewClick = () => {
//     if (!isAuthenticated) {
//       // Redirect to login or show login modal
//       window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
//       return;
//     }
//     setShowReviewForm(true);
//   };

//   if (loading) {
//     return (
//       <div className="animate-pulse">
//         <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
//         <div className="space-y-4">
//           {[1, 2, 3].map(i => (
//             <div key={i} className="h-24 bg-gray-200 rounded"></div>
//           ))}
//         </div>
//       </div>
//     );
//   }

//   return (
//     <section className={className}>
//       {/* Reviews Header */}
//       <div className="flex justify-between items-center mb-6">
//         <div>
//           <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
//           {stats && (
//             <div className="flex items-center gap-4 mt-2">
//               <div className="flex items-center gap-2">
//                 <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
//                 <span className="text-xl font-bold text-gray-900">
//                   {stats.average_rating.toFixed(1)}
//                 </span>
//                 <span className="text-gray-600">({stats.total_reviews} reviews)</span>
//               </div>
//               {refreshing && (
//                 <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
//               )}
//             </div>
//           )}
//         </div>
        
//         <div className="flex gap-2">
//           <Button 
//             onClick={fetchReviews}
//             variant="outline"
//             disabled={refreshing}
//             className="flex items-center gap-2"
//           >
//             <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
//             Refresh
//           </Button>
//           <Button 
//             onClick={handleWriteReviewClick}
//             className="bg-blue-600 hover:bg-blue-700 text-white"
//             disabled={!isAuthenticated}
//           >
//             {isAuthenticated ? 'Write a Review' : 'Login to Review'}
//           </Button>
//         </div>
//       </div>

//       {/* Authentication Required Message */}
//       {!isAuthenticated && (
//         <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
//           <p className="text-yellow-800 text-sm">
//             <strong>Authentication required:</strong> You must be logged in to write a review.
//           </p>
//         </div>
//       )}

//       {/* Review Form */}
//       {showReviewForm && isAuthenticated && (
//         <div className="mb-8">
//           <ReviewForm 
//             courseId={courseId} 
//             onReviewSubmitted={handleReviewSubmitted}
//           />
//         </div>
//       )}

//       {/* Reviews List */}
//       <div className="space-y-6">
//         {reviews.length === 0 ? (
//           <Card>
//             <CardContent className="py-8 text-center">
//               <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
//               <p className="text-gray-600 mb-4">
//                 {isAuthenticated 
//                   ? 'Be the first to share your experience with this course!'
//                   : 'Login to be the first to review this course!'
//                 }
//               </p>
//               <Button 
//                 onClick={handleWriteReviewClick}
//                 className="bg-blue-600 hover:bg-blue-700 text-white"
//               >
//                 {isAuthenticated ? 'Write First Review' : 'Login to Review'}
//               </Button>
//             </CardContent>
//           </Card>
//         ) : (
//           reviews.map((review) => (
//             <ReviewCard 
//               key={review.id} 
//               review={review} 
//               currentUserId={currentUserId}
//             />
//           ))
//         )}
//       </div>
//     </section>
//   );
// }

// // Individual Review Card Component with Replies
// function ReviewCard({ review, currentUserId }: { review: CourseReview; currentUserId?: string }) {
//   const [showReplies, setShowReplies] = useState(false);

//   return (
//     <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
//       <CardContent className="p-6">
//         {/* Review Header */}
//         <div className="flex justify-between items-start mb-4">
//           <div className="flex items-center gap-3">
//             {/* User Avatar */}
//             <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
//               {review.user_name?.charAt(0).toUpperCase() || 'U'}
//             </div>
            
//             <div>
//               <h4 className="font-semibold text-gray-900">
//                 {review.user_name || 'Anonymous User'}
//               </h4>
//               <div className="flex items-center gap-2 text-sm text-gray-600">
//                 <StarRating 
//                   rating={review.rating} 
//                   readonly 
//                   size="sm" 
//                   showLabel={false}
//                 />
//                 <span>•</span>
//                 <span>{new Date(review.created_at).toLocaleDateString()}</span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Review Content */}
//         {review.title && (
//           <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
//         )}
        
//         <p className="text-gray-700 mb-4 leading-relaxed">{review.content}</p>

//         {/* Review Reactions */}
//         <div className="flex justify-between items-center pt-4 border-t border-gray-100">
//           <ReviewReactions
//             reviewId={review.id}
//             initialCounts={review.reaction_counts}
//             initialUserReaction={review.user_reaction}
//             size="sm"
//           />
          
//           {/* Reply Count with Toggle */}
//           {review.reply_count > 0 && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => setShowReplies(!showReplies)}
//               className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
//             >
//               <MessageCircle size={16} className="mr-1" />
//               {review.reply_count} repl{review.reply_count === 1 ? 'y' : 'ies'}
//             </Button>
//           )}
//         </div>

//         {/* Replies Section */}
//         {showReplies && (
//           <div className="mt-4 pt-4 border-t border-gray-100">
//             <ReviewReplies 
//               reviewId={review.id}
//               currentUserId={currentUserId}
//             />
//           </div>
//         )}
//       </CardContent>
//     </Card>
//   );
// }





























// /src/components/courses/course-reviews-section.tsx

'use client';

import { useState, useEffect } from 'react';
import { CourseReview, ReviewStats } from '@/types/reviews';
import { ReviewForm } from '@/components/reviews/review-form';
import { ReviewReactions } from '@/components/reviews/review-reactions';
import { ReviewReplies } from '@/components/reviews/review-replies';
import { StarRating } from '@/components/reviews/star-rating';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, MessageCircle, RefreshCw } from 'lucide-react';

interface CourseReviewsSectionProps {
  courseId: string;
  courseSlug: string;
  className?: string;
}

export function CourseReviewsSection({ courseId, courseSlug, className }: CourseReviewsSectionProps) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>();

  useEffect(() => {
    checkAuthStatus();
    fetchReviews();
  }, [courseId]);

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status');
      const data = await response.json();
      setIsAuthenticated(data.isAuthenticated);
      setCurrentUserId(data.user?.id);
    } catch {
      setIsAuthenticated(false);
    }
  };

  const fetchReviews = async () => {
    try {
      setRefreshing(true);
      const response = await fetch(`/api/courses/${courseId}/reviews`);

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) throw new Error('Non-JSON response');

      const data = await response.json();

      if (data.success) {
        setReviews(data.reviews || []);
        setStats(data.stats);
      } else {
        throw new Error(data.error || 'Failed to fetch reviews');
      }
    } catch (error) {
      console.error('❌ Error fetching reviews:', error);
      setReviews([]);
      setStats({ average_rating: 0, total_reviews: 0, rating_distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleReviewSubmitted = async () => {
    setShowReviewForm(false);
    setTimeout(() => fetchReviews(), 500);
  };

  const handleWriteReviewClick = () => {
    if (!isAuthenticated) {
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }
    setShowReviewForm(true);
  };

  if (loading) {
    return (
      <div className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <section className={className}>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
          {stats && (
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="text-xl font-bold text-gray-900">
                  {stats.average_rating.toFixed(1)}
                </span>
                <span className="text-gray-600">({stats.total_reviews} reviews)</span>
              </div>
              {refreshing && <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button onClick={fetchReviews} variant="outline" disabled={refreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            onClick={handleWriteReviewClick}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isAuthenticated ? 'Write a Review' : 'Login to Review'}
          </Button>
        </div>
      </div>

      {!isAuthenticated && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            <strong>Login required:</strong> You must be logged in to write a review.
          </p>
        </div>
      )}

      {showReviewForm && isAuthenticated && (
        <div className="mb-8">
          <ReviewForm courseId={courseId} onReviewSubmitted={handleReviewSubmitted} />
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Star className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Reviews Yet</h3>
              <p className="text-gray-600 mb-4">
                {isAuthenticated
                  ? 'Be the first to share your experience with this course!'
                  : 'Login to be the first to review this course!'}
              </p>
              <Button onClick={handleWriteReviewClick} className="bg-blue-600 hover:bg-blue-700 text-white">
                {isAuthenticated ? 'Write First Review' : 'Login to Review'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <ReviewCard key={review.id} review={review} currentUserId={currentUserId} />
          ))
        )}
      </div>
    </section>
  );
}

// ── Review Card ──────────────────────────────────────────────────────────────

function ReviewCard({ review, currentUserId }: { review: CourseReview; currentUserId?: string }) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <Card className="border border-gray-200 hover:border-gray-300 transition-colors">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            {/* ✅ FIX 3A: Show real profile image if available, else initials */}
            {review.user_image ? (
              <img
                src={review.user_image}
                alt={review.user_name || 'User'}
                className="w-10 h-10 rounded-full object-cover border border-gray-200"
                onError={(e) => {
                  // If image fails to load, fall back to initials div
                  const target = e.currentTarget;
                  target.style.display = 'none';
                  const sibling = target.nextElementSibling as HTMLElement;
                  if (sibling) sibling.style.display = 'flex';
                }}
              />
            ) : null}
            {/* Initials fallback — hidden when image loads successfully */}
            <div
              className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-sm"
              style={{ display: review.user_image ? 'none' : 'flex' }}
            >
              {review.user_name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div>
              <h4 className="font-semibold text-gray-900">
                {review.user_name || 'Anonymous User'}
              </h4>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <StarRating rating={review.rating} readonly size="sm" showLabel={false} />
                <span>•</span>
                <span>{new Date(review.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Review title */}
        {review.title && (
          <h5 className="font-semibold text-gray-900 mb-2">{review.title}</h5>
        )}

        {/* ✅ FIX 3B: Preserve paragraphs, line breaks, and whitespace in review body */}
        <ReviewBody content={review.content} />

        {/* Reactions + Replies */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <ReviewReactions
            reviewId={review.id}
            initialCounts={review.reaction_counts}
            initialUserReaction={review.user_reaction}
            size="sm"
          />

          {review.reply_count > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowReplies(!showReplies)}
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
            >
              <MessageCircle size={16} className="mr-1" />
              {review.reply_count} repl{review.reply_count === 1 ? 'y' : 'ies'}
            </Button>
          )}
        </div>

        {showReplies && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <ReviewReplies reviewId={review.id} currentUserId={currentUserId} />
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Review Body — renders text with paragraph and formatting support ──────────

function ReviewBody({ content }: { content: string }) {
  if (!content) return null;

  // Split on double newlines for paragraphs, single newlines for line breaks
  const paragraphs = content.split(/\n{2,}/);

  return (
    <div className="mb-4 space-y-3 text-gray-700 leading-relaxed">
      {paragraphs.map((para, i) => {
        // Check if this paragraph looks like a bullet list
        const lines = para.split('\n');
        const isBulletList = lines.every(l => /^[\-\*•]\s/.test(l.trim()) || l.trim() === '');
        const isNumberedList = lines.every(l => /^\d+[\.\)]\s/.test(l.trim()) || l.trim() === '');

        if (isBulletList && lines.length > 1) {
          return (
            <ul key={i} className="list-disc list-inside space-y-1 pl-2">
              {lines.filter(l => l.trim()).map((line, j) => (
                <li key={j} className="text-gray-700">
                  {line.replace(/^[\-\*•]\s+/, '')}
                </li>
              ))}
            </ul>
          );
        }

        if (isNumberedList && lines.length > 1) {
          return (
            <ol key={i} className="list-decimal list-inside space-y-1 pl-2">
              {lines.filter(l => l.trim()).map((line, j) => (
                <li key={j} className="text-gray-700">
                  {line.replace(/^\d+[\.\)]\s+/, '')}
                </li>
              ))}
            </ol>
          );
        }

        // Regular paragraph — preserve single line breaks within it
        return (
          <p key={i}>
            {lines.map((line, j) => (
              <span key={j}>
                {line}
                {j < lines.length - 1 && <br />}
              </span>
            ))}
          </p>
        );
      })}
    </div>
  );
}
