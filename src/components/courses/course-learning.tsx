
// // /components/courses/course-learning.tsx
// 'use client'

// import { useState, useEffect, useRef } from "react"
// import Link from "next/link"
// import {
//   ChevronDown,
//   ChevronUp,
//   Play,
//   Pause,
//   Volume2,
//   Volume1,
//   VolumeX,
//   Settings,
//   Maximize,
//   Bookmark,
//   CheckCircle2,
//   BookOpen,
//   Expand,
//   Bold,
//   Italic,
//   Underline,
//   List,
//   ListOrdered,
//   Link as LinkIcon,
//   LayoutDashboard,
//   Menu,
//   X,
//   Clock,
//   FileText,
//   Video,
//   Download,
//   ZoomIn,
//   ZoomOut,
//   RotateCw,
//   Maximize2,
//   Minimize2,
//   Eye,
//   Archive,
//   Printer,
//   Music,
//   Image as ImageIcon,
//   Code,
//   Presentation,
//   Sheet,
//   ExternalLink,
//   ChevronLeft,
//   ChevronRight,
// } from "lucide-react"
// import { toast } from '@/hooks/use-toast'
// import FileViewer from '@/components/courses/file-viewer'

// // Helper function to format file size
// const formatFileSize = (bytes: number | null): string => {
//   if (!bytes) return 'Unknown size';
  
//   const sizes = ['Bytes', 'KB', 'MB', 'GB'];
//   if (bytes === 0) return '0 Bytes';
  
//   const i = Math.floor(Math.log(bytes) / Math.log(1024));
//   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
// };

// // Helper function to get file icon
// const getFileIcon = (type: string) => {
//   const lowerType = type.toLowerCase();
  
//   if (lowerType.includes('pdf')) return '📄';
//   if (lowerType.includes('word') || lowerType.includes('doc')) return '📝';
//   if (lowerType.includes('excel') || lowerType.includes('sheet') || lowerType.includes('csv')) return '📊';
//   if (lowerType.includes('powerpoint') || lowerType.includes('presentation')) return '📈';
//   if (lowerType.includes('image')) return '🖼️';
//   if (lowerType.includes('video')) return '🎬';
//   if (lowerType.includes('audio')) return '🎵';
//   if (lowerType.includes('zip') || lowerType.includes('archive') || lowerType.includes('rar')) return '🗜️';
//   if (lowerType.includes('code') || lowerType.includes('programming') || 
//       lowerType.includes('json') || lowerType.includes('xml')) return '💻';
//   return '📁';
// };

// // --- INTERFACES ---
// interface Lesson {
//   id: string
//   title: string
//   description?: string
//   duration: number
//   contentType: string
//   lessonType?: string
//   videoUrl?: string
//   videoThumbnail?: string
//   videoDuration?: number
//   isPreview: boolean
//   created_at?: string
  
//   // Progress tracking
//   watched?: number
//   completed?: boolean
//   bookmarks?: number[]
// }

// interface Module {
//   id: string
//   title: string
//   description?: string
//   order: number
//   created_at?: string
//   lessons: Lesson[]
//   // Progress tracking
//   progress?: number
// }

// // Define the UserProgress type
// interface UserProgress {
//   [lessonId: string]: {
//     completed: boolean;
//     progress: number;
//     timeSpent: number;
//     lastPosition: number;
//     lastAccessedAt: string | null;
//   };
// }

// interface CourseResource {
//   id: string;
//   name: string;
//   url: string;
//   type: string;
//   size: number | null;
//   lessonTitle: string;
//   moduleTitle: string;
//   isPdf?: boolean;
// }

// interface CourseLearningProps {
//   courseId: string
//   courseData: any
//   curriculumData: Module[]
//   enrollmentData?: any
//   userId: string
//   initialUserProgress?: UserProgress
//   courseResources?: CourseResource[]
// }

// export default function CourseLearningPage({ 
//   courseId, 
//   courseData, 
//   curriculumData, 
//   enrollmentData,
//   userId,
//   initialUserProgress = {},
//   courseResources = []
// }: CourseLearningProps) {
//   const [currentModule, setCurrentModule] = useState(0)
//   const [currentLesson, setCurrentLesson] = useState(0)
//   const [expandedModules, setExpandedModules] = useState<number[]>([0])
//   const [isPlaying, setIsPlaying] = useState(false)
//   const [isMuted, setIsMuted] = useState(false)
//   const [volume, setVolume] = useState(1)
//   const [playbackSpeed, setPlaybackSpeed] = useState(1)
//   const [bookmarkedTimes, setBookmarkedTimes] = useState<number[]>([])
//   const [activeTab, setActiveTab] = useState<"overview" | "notes" | "resources">("overview")
//   const [notes, setNotes] = useState("")
//   const [isVideoExpanded, setIsVideoExpanded] = useState(false)
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  
//   // Use proper type for userProgress
//   const [userProgress, setUserProgress] = useState<UserProgress>(initialUserProgress)
  
//   // State for PDF viewer
//   const [selectedPdf, setSelectedPdf] = useState<CourseResource | null>(
//     courseResources.filter(resource => resource.type === 'PDF Document').length > 0 
//       ? courseResources.filter(resource => resource.type === 'PDF Document')[0] 
//       : null
//   );
  
//   // State for File Viewer
//   const [selectedFile, setSelectedFile] = useState<CourseResource | null>(null);
//   const [showFileViewer, setShowFileViewer] = useState(false);
//   const [currentFileIndex, setCurrentFileIndex] = useState(0);
  
//   const [videoDuration, setVideoDuration] = useState(0)
//   const [showControls, setShowControls] = useState(true)

//   // Use refs instead of state for time tracking
//   const currentTimeRef = useRef(0)
//   const [, forceUpdate] = useState(0)

//   const videoRef = useRef<HTMLVideoElement>(null)
//   const progressBarRef = useRef<HTMLDivElement>(null)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   // Database progress saving
//   const [isSaving, setIsSaving] = useState(false)
//   const lastSaveRef = useRef(0)

//   // Group resources by type for better organization
//   const pdfResources = courseResources.filter(resource => resource.type === 'PDF Document');
//   const otherResources = courseResources.filter(resource => resource.type !== 'PDF Document');

//   // Helper functions for file viewer
//   const getFileIndex = (file: CourseResource) => {
//     return courseResources.findIndex(resource => resource.id === file.id);
//   };

//   const handleNextFile = () => {
//     if (selectedFile && currentFileIndex < courseResources.length - 1) {
//       const nextIndex = currentFileIndex + 1;
//       setSelectedFile(courseResources[nextIndex]);
//       setCurrentFileIndex(nextIndex);
//     }
//   };

//   const handlePrevFile = () => {
//     if (selectedFile && currentFileIndex > 0) {
//       const prevIndex = currentFileIndex - 1;
//       setSelectedFile(courseResources[prevIndex]);
//       setCurrentFileIndex(prevIndex);
//     }
//   };

//   // Load user progress from database on component mount
//   useEffect(() => {
//     loadUserProgress()
//   }, [courseId, userId])

//   // Enhanced loadUserProgress with user ID
//   const loadUserProgress = async () => {
//     try {
//       // Load from database with user ID
//       const response = await fetch(`/api/student/progress?courseId=${courseId}`)
//       if (response.ok) {
//         const data = await response.json()
        
//         // Transform the data to match our UserProgress type
//         const transformedProgress: UserProgress = {}
//         if (data.progress && typeof data.progress === 'object') {
//           Object.entries(data.progress).forEach(([lessonId, lessonData]: [string, any]) => {
//             transformedProgress[lessonId] = {
//               completed: lessonData.is_completed || lessonData.completed || false,
//               progress: lessonData.video_progress || lessonData.progress || 0,
//               timeSpent: lessonData.time_spent || 0,
//               lastPosition: lessonData.last_position || 0,
//               lastAccessedAt: lessonData.last_accessed_at || lessonData.last_accessed || null
//             }
//           })
//         }
//         setUserProgress(transformedProgress)
//       } else {
//         // Fallback to localStorage with user ID prefix
//         const savedProgress = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//         if (savedProgress) {
//           try {
//             const parsedProgress = JSON.parse(savedProgress) as UserProgress
//             setUserProgress(parsedProgress)
//           } catch (e) {
//             console.error('Error parsing saved progress:', e)
//           }
//         }
//       }
//     } catch (error) {
//       console.error('Error loading user progress:', error)
//       // Fallback to localStorage with user ID prefix
//       const savedProgress = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//       if (savedProgress) {
//         try {
//           const parsedProgress = JSON.parse(savedProgress) as UserProgress
//           setUserProgress(parsedProgress)
//         } catch (e) {
//           console.error('Error parsing saved progress:', e)
//         }
//       }
//     }
//   }

//   // Enhanced saveProgressToDatabase with user ID
//   const saveProgressToDatabase = async (lessonId: string, progressData: {
//     completed?: boolean
//     progress?: number
//     timeSpent?: number
//     lastPosition?: number
//   }) => {
//     try {
//       setIsSaving(true)
      
//       const response = await fetch('/api/student/progress', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           courseId,
//           lessonId,
//           userId, // ADD USER ID TO REQUEST
//           ...progressData
//         })
//       })

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
//         throw new Error(errorData.error || 'Failed to save progress')
//       }

//       return await response.json()
//     } catch (error) {
//       console.error('Error saving progress to database:', error)
//       // Save to localStorage with user ID prefix as fallback
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//       throw error
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   // Save progress to localStorage with user ID prefix
//   useEffect(() => {
//     if (Object.keys(userProgress).length > 0 && userId) {
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//     }
//   }, [userProgress, courseId, userId])

//   // Auto-save progress
//   useEffect(() => {
//     const autoSaveProgress = async () => {
//       const currentLessonData = getCurrentLessonData()
//       if (!currentLessonData || !videoRef.current) return

//       const currentTime = currentTimeRef.current
//       const now = Date.now()

//       // Calculate progress percentage for current lesson
//       const currentProgressPercentage = currentLessonData && (currentLessonData.duration || videoDuration)
//         ? (currentTime / (currentLessonData.duration || videoDuration)) * 100
//         : 0

//       // Only save if enough time has passed and we have meaningful progress
//       if (now - lastSaveRef.current > 30000 && currentTime > 10) {
//         try {
//           await saveProgressToDatabase(currentLessonData.id, {
//             progress: currentProgressPercentage,
//             timeSpent: Math.floor(currentTime),
//             lastPosition: Math.floor(currentTime)
//           })
//           lastSaveRef.current = now
//         } catch (error) {
//           console.error('Auto-save failed:', error)
//         }
//       }
//     }

//     const interval = setInterval(autoSaveProgress, 10000)
//     return () => clearInterval(interval)
//   }, [courseId, videoDuration])

//   // Calculate overall course progress
//   const calculateOverallProgress = () => {
//     if (!curriculumData.length) return 0
    
//     let totalLessons = 0
//     let completedLessons = 0
    
//     curriculumData.forEach(module => {
//       module.lessons.forEach(lesson => {
//         totalLessons++
//         if (userProgress[lesson.id]?.completed) {
//           completedLessons++
//         }
//       })
//     })
    
//     return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
//   }

//   // Calculate module progress
//   const calculateModuleProgress = (module: Module) => {
//     if (!module.lessons.length) return 0
    
//     const completedLessons = module.lessons.filter(lesson => 
//       userProgress[lesson.id]?.completed
//     ).length
    
//     return Math.round((completedLessons / module.lessons.length) * 100)
//   }

//   // Mark lesson as completed - ENHANCED with database saving
//   const completeLesson = async (lessonId?: string) => {
//     const targetLessonId = lessonId || currentLessonData?.id
//     if (!targetLessonId) return
    
//     // Update local state
//     setUserProgress(prev => ({
//       ...prev,
//       [targetLessonId]: { 
//         ...prev[targetLessonId],
//         completed: true,
//         completed_at: new Date().toISOString()
//       }
//     }))

//     // Save to database
//     try {
//       await saveProgressToDatabase(targetLessonId, {
//         completed: true,
//         progress: 100
//       })
//     } catch (error) {
//       console.error('Error saving progress:', error)
//     }
//   }

//   // Navigate to next lesson and auto-complete current if needed
//   const goToNextLesson = () => {
//     const currentLessonData = getCurrentLessonData()
    
//     // Auto-complete current lesson if not already completed
//     if (currentLessonData && !userProgress[currentLessonData.id]?.completed) {
//       completeLesson()
//     }

//     // Navigate to next lesson using the original navigation logic
//     if (currentLesson < curriculumData[currentModule].lessons.length - 1) {
//       selectLesson(currentModule, currentLesson + 1)
//     } else if (currentModule < curriculumData.length - 1) {
//       selectLesson(currentModule + 1, 0)
//     }
//   }

//   // Navigate to previous lesson
//   const goToPreviousLesson = () => {
//     if (currentLesson > 0) {
//       selectLesson(currentModule, currentLesson - 1)
//     } else if (currentModule > 0) {
//       selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
//     }
//   }

//   const toggleModule = (index: number) => {
//     setExpandedModules((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]))
//   }

//   const selectLesson = async (moduleIndex: number, lessonIndex: number) => {
//     setCurrentModule(moduleIndex)
//     setCurrentLesson(lessonIndex)
//     currentTimeRef.current = 0 // Reset time ref
//     setIsPlaying(false)
//     setIsMobileSidebarOpen(false)
//     setShowControls(true)

//     // Reset video when changing lessons
//     setTimeout(() => {
//       if (videoRef.current) {
//         videoRef.current.currentTime = 0
//         videoRef.current.pause()
//       }
//       forceUpdate(x => x + 1) // Force UI update
//     }, 100)

//     // Record lesson access in progress
//     const lesson = curriculumData[moduleIndex]?.lessons[lessonIndex]
//     if (lesson && !userProgress[lesson.id]?.completed) {
//       const updatedProgress: UserProgress = {
//         ...userProgress,
//         [lesson.id]: {
//           ...userProgress[lesson.id],
//           completed: userProgress[lesson.id]?.completed || false,
//           progress: userProgress[lesson.id]?.progress || 0,
//           timeSpent: userProgress[lesson.id]?.timeSpent || 0,
//           lastPosition: 0,
//           lastAccessedAt: new Date().toISOString()
//         }
//       }
      
//       setUserProgress(updatedProgress)

//       // Save lesson access to database
//       saveProgressToDatabase(lesson.id, {
//         progress: 0,
//         timeSpent: 0,
//         lastPosition: 0
//       }).catch(error => {
//         console.error('Error saving lesson access:', error)
//       })
//     }
//   }


//   // === YOUR EXACT ORIGINAL VIDEO CONTROL FUNCTIONS ===
//   const togglePlayPause = () => {
//     if (!videoRef.current) return; // Safely exit if video element is not mounted

//     if (isPlaying) {
//       videoRef.current.pause()
//     } else {
//       // Attempt to play, catching the promise rejection error
//       // This happens if the browser blocks play (e.g. autoplay policy)
//       videoRef.current.play().catch(error => {
//         console.error('Video Playback Failed (Autoplay/Promise):', error)
//         // We no longer attempt a complex auto-mute fallback here, 
//         // as the video element's onError and mediaError state will handle the diagnosis.
//         // A simple visual indication to the user is better than an endless loop.
//         if (videoRef.current) {
//            videoRef.current.pause();
//            setIsPlaying(false);
//         }
//       })
//     }
//   }

//   // CRITICAL FIX: New handleTimeUpdate that doesn't cause re-renders
//   const handleTimeUpdate = () => {
//     if (!videoRef.current) return;
    
//     currentTimeRef.current = videoRef.current.currentTime;

//     // Update UI only once per second to prevent excessive re-renders
//     if (Math.floor(currentTimeRef.current) % 1 === 0) {
//       forceUpdate(x => x + 1);
//     }
//   };

//   const handleLoadedMetadata = () => {
//     if (videoRef.current) {
//       const duration = videoRef.current.duration
//       setVideoDuration(duration)
//     }
//   }

//   const handleVideoEnded = () => {
//     setIsPlaying(false)
//     // Mark as completed if watched most of the video
//     if (progressPercentage >= 90) {
//       completeLesson()
//     }
//   }

//   // CRITICAL FIX: Updated handleProgressClick to use ref
//   const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
//     if (videoRef.current && progressBarRef.current) {
//       const rect = progressBarRef.current.getBoundingClientRect()
//       const percent = (e.clientX - rect.left) / rect.width
//       const currentLessonDuration = currentLessonData?.duration || videoDuration || 1
//       const newTime = percent * currentLessonDuration
//       videoRef.current.currentTime = newTime
//       currentTimeRef.current = newTime
//       forceUpdate(x => x + 1) // Force UI update after seeking
//     }
//   }

//   const toggleMute = () => {
//     if (videoRef.current) {
//       videoRef.current.muted = !isMuted
//       setIsMuted(!isMuted)
//     }
//   }

//   const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const newVolume = parseFloat(e.target.value)
//     setVolume(newVolume)
//     if (videoRef.current) {
//       videoRef.current.volume = newVolume
//       setIsMuted(newVolume === 0)
//     }
//   }

//   const toggleFullscreen = () => {
//     if (videoRef.current) {
//       if (document.fullscreenElement) {
//         document.exitFullscreen()
//       } else {
//         videoRef.current.requestFullscreen()
//       }
//     }
//   }

//   const handleBookmark = () => {
//     if (!bookmarkedTimes.includes(Math.floor(currentTimeRef.current))) {
//       setBookmarkedTimes([...bookmarkedTimes, Math.floor(currentTimeRef.current)].sort((a, b) => a - b))
//     }
//   }

//   const formatTime = (seconds: number) => {
//     if (!seconds || isNaN(seconds)) return "0:00"
//     const minutes = Math.floor(seconds / 60)
//     const secs = Math.floor(seconds % 60)
//     return `${minutes}:${secs.toString().padStart(2, "0")}`
//   }

//   // Get current lesson data with progress
//  const getCurrentLessonData = (): Lesson | null => {
//   if (!curriculumData[currentModule]?.lessons[currentLesson]) {
//     return null
//   }
  
//   const lesson = curriculumData[currentModule].lessons[currentLesson]
//   const progress = userProgress[lesson.id] || {}
  
//   return {
//     ...lesson,
//     watched: progress.timeSpent || 0,  // Map timeSpent to watched
//     completed: progress.completed || false
//   }
// }

//   const currentLessonData = getCurrentLessonData()
//   const overallProgress = calculateOverallProgress()

//   // CRITICAL FIX: Updated progressPercentage to use currentTimeRef
//   const progressPercentage = currentLessonData && (currentLessonData.duration || videoDuration)
//     ? (currentTimeRef.current / (currentLessonData.duration || videoDuration)) * 100
//     : 0

//   // Show controls on mouse move and hide after delay
//   const handleMouseMove = () => {
//     setShowControls(true)
//     if (controlsTimeoutRef.current) {
//       clearTimeout(controlsTimeoutRef.current)
//     }
//     controlsTimeoutRef.current = setTimeout(() => {
//       if (isPlaying) {
//         setShowControls(false)
//       }
//     }, 3000)
//   }

//   useEffect(() => {
//     return () => {
//       if (controlsTimeoutRef.current) {
//         clearTimeout(controlsTimeoutRef.current)
//       }
//     }
//   }, [])

//   // CRITICAL FIX: Robust Video URL Finder
//   const getVideoUrl = () => {
//     if (!currentLessonData) return null
    
//     const lesson = curriculumData[currentModule]?.lessons[currentLesson]
//     if (!lesson) return null

//     // Check primary field
//     if (lesson.videoUrl && typeof lesson.videoUrl === 'string' && lesson.videoUrl.length > 0) {
//       return lesson.videoUrl
//     }

//     // Try all possible video field names (as per previous debugging)
//     const possibleFields = [
//       'video_url', 'video', 'url', 'file', 
//       'videoURL', 'videoFile', 'video_file',
//       'contentUrl', 'content_url', 'mediaUrl', 'media_url',
//       'source', 'src', 'videoSource', 'video_source',
//       'cloudinaryUrl', 'cloudinary_url', 'cloudinary'
//     ]

//     for (const field of possibleFields) {
//       const value = (lesson as any)[field]
//       if (value && typeof value === 'string' && value.length > 0) {
//         return value
//       }
//     }
//     return null
//   }

//   const videoUrl = getVideoUrl()
  
//   // CRITICAL FIX: Check if a video should display (The purple gradient issue)
//   const isVideoLesson = Boolean(videoUrl) || currentLessonData?.contentType === 'video' || currentLessonData?.lessonType === 'video';

//   if (!currentLessonData) {
//     return (
//       <div className="flex-1 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading lesson...</p>
//         </div>
//       </div>
//     )
//   }

//   // AxioQuan Logo Component
//   const AxioQuanLogo = ({ size = "default" }: { size?: "default" | "small" }) => (
//     <a href="/" className={`flex items-center gap-3 ${size === "small" ? 'px-2' : 'px-4'}`}>
//       <div className="flex items-center justify-center bg-black rounded-lg p-3 w-8 h-8">
//         <span className="text-white font-bold text-xl">A</span>
//       </div>
//       {size === "default" && (
//         <span className="font-bold text-xl text-foreground">AxioQuan</span>
//       )}
//     </a>
//   )

//   // Get lesson icon based on content type
//   const getLessonIcon = (contentType: string, completed?: boolean) => {
//     if (completed) {
//       return <CheckCircle2 size={16} className="flex-shrink-0 text-green-500" />
//     }
    
//     // Check if videoUrl exists for general video icon, even if contentType is 'free'
//     if (videoUrl) return <Video size={16} className="flex-shrink-0 text-blue-500" />

//     switch (contentType) {
//       case 'video':
//         return <Video size={16} className="flex-shrink-0 text-blue-500" />
//       case 'document':
//       case 'text':
//         return <FileText size={16} className="flex-shrink-0 text-purple-500" />
//       case 'quiz':
//         return <FileText size={16} className="flex-shrink-0 text-orange-500" />
//       default:
//         return <Play size={16} className="flex-shrink-0 text-gray-500" />
//     }
//   }

//   // === YOUR EXACT ORIGINAL VIDEO PLAYER COMPONENT ===
//   const VideoPlayer = () => {
//     return (
//       <div className="relative w-full h-full bg-black">
//         {videoUrl ? (
//           <video
//             key={videoUrl}
//             ref={videoRef}
//             className="w-full h-full object-contain"
//             controls
//             playsInline
//           >
//             <source src={videoUrl} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
//             <p>No video available</p>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Mobile Sidebar Overlay - IMPROVED VERSION
//   const MobileSidebar = () => (
//     <>
//       {/* Improved Mobile Overlay - Clean dim background with blur */}
//       {isMobileSidebarOpen && (
//         <div 
//           className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden transition-all duration-300"
//           onClick={() => setIsMobileSidebarOpen(false)}
//         />
//       )}
      
//       {/* Improved Mobile Sidebar - Smooth slide from right without obstruction */}
//       <div className={`
//         fixed top-0 right-0 h-full w-80 bg-white z-50 transform transition-transform duration-300 ease-out md:hidden
//         ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}
//         shadow-xl
//       `}>
//         <div className="p-4 border-b border-border bg-white">
//           <div className="flex items-center justify-between mb-4">
//             <AxioQuanLogo />
//             <button
//               onClick={() => setIsMobileSidebarOpen(false)}
//               className="p-2 rounded-lg cursor-pointer hover:bg-gray-100 transition"
//             >
//               <X size={20} />
//             </button>
//           </div>
//           <Link 
//             href="/dashboard"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group w-full"
//           >
//             <LayoutDashboard size={20} className="text-primary" />
//             <span className="font-semibold text-foreground">Back to Dashboard</span>
//           </Link>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-2 h-[calc(100vh-140px)]">
//           {curriculumData.map((module, moduleIndex) => (
//             <div key={module.id} className="space-y-1">
//               <button
//                 onClick={() => toggleModule(moduleIndex)}
//                 className="cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
//               >
//                 <div className="flex items-center gap-3 flex-1">
//                   <BookOpen size={18} className="text-primary flex-shrink-0" />
//                   <div className="text-left">
//                     <p className="font-semibold text-sm text-foreground">{module.title}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {calculateModuleProgress(module)}% complete
//                       {isSaving && <span className="ml-2 text-blue-500">Saving...</span>}
//                     </p>
//                   </div>
//                 </div>
//                 {expandedModules.includes(moduleIndex) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>

//               {expandedModules.includes(moduleIndex) && (
//                 <div className="space-y-1 ml-4">
//                   {module.lessons.map((lesson, lessonIndex) => (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(moduleIndex, lessonIndex)}
//                       className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
//                         currentModule === moduleIndex && currentLesson === lessonIndex
//                           ? "bg-primary text-primary-foreground"
//                           : "hover:bg-gray-100 text-foreground"
//                       }`}
//                     >
//                       {getLessonIcon(lesson.contentType, userProgress[lesson.id]?.completed)}
//                       <span className="flex-1 text-left truncate">{lesson.title}</span>
//                       {lesson.duration && (
//                         <span className="text-xs opacity-75 flex items-center gap-1">
//                           <Clock size={12} />
//                           {formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   )

//   return (
//     <div className="flex min-h-screen bg-background">
//       {/* Mobile Sidebar */}
//       <MobileSidebar />

//       {/* Desktop Sidebar Navigation - Fixed Position with Dashboard Link */}
//       <div className="hidden md:flex w-80 bg-white/90 backdrop-blur-md border-r border-border flex-col overflow-hidden fixed left-0 top-0 bottom-0 z-30">
//         {/* Logo and Dashboard Header */}
//         <div className="p-4 border-b border-border bg-white/95">
//           <div className="mb-4">
//             <AxioQuanLogo />
//           </div>
//           <Link 
//             href="/dashboard"
//             className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition group"
//           >
//             <LayoutDashboard size={20} className="text-primary" />
//             <span className="font-semibold text-foreground">Back to Dashboard</span>
//           </Link>
//         </div>

//         <div className="flex-1 overflow-y-auto p-4 space-y-2">
//           {curriculumData.map((module, moduleIndex) => (
//             <div key={module.id} className="space-y-1">
//               <button
//                 onClick={() => toggleModule(moduleIndex)}
//                 className="cursor-pointer w-full flex items-center justify-between px-4 py-3 rounded-lg hover:bg-gray-100 transition group"
//               >
//                 <div className="flex items-center gap-3 flex-1">
//                   <BookOpen size={18} className="text-primary flex-shrink-0" />
//                   <div className="text-left">
//                     <p className="font-semibold text-sm text-foreground">{module.title}</p>
//                     <p className="text-xs text-muted-foreground">
//                       {calculateModuleProgress(module)}% complete
//                       {isSaving && <span className="ml-2 text-blue-500">Saving...</span>}
//                     </p>
//                   </div>
//                 </div>
//                 {expandedModules.includes(moduleIndex) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
//               </button>

//               {expandedModules.includes(moduleIndex) && (
//                 <div className="space-y-1 ml-4">
//                   {module.lessons.map((lesson, lessonIndex) => (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(moduleIndex, lessonIndex)}
//                       className={`cursor-pointer w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition ${
//                         currentModule === moduleIndex && currentLesson === lessonIndex
//                           ? "bg-primary text-primary-foreground"
//                           : "hover:bg-gray-100 text-foreground"
//                       }`}
//                     >
//                       {getLessonIcon(lesson.contentType, userProgress[lesson.id]?.completed)}
//                       <span className="flex-1 text-left truncate">{lesson.title}</span>
//                       {lesson.duration && (
//                         <span className="text-xs opacity-75 flex items-center gap-1">
//                           <Clock size={12} />
//                           {formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Main Content Area - Normal Page Scroll with Sidebar Offset */}
//       <div className="flex-1 overflow-y-auto md:ml-80 w-full">
//         {/* Mobile Header */}
//         <div className="md:hidden bg-white border-b border-border p-4 sticky top-0 z-30 w-full">
//           <div className="flex items-center justify-between w-full">
//             <AxioQuanLogo size="small" />
//             <div className="flex-1 ml-3 min-w-0">
//               <h1 className="text-lg font-semibold text-gray-900 truncate">
//                 {courseData?.title || 'Course'}
//               </h1>
              
//               {/* Current Lesson Info for Mobile */}
//               <div className="mt-1">
//                 <p className="text-xs text-muted-foreground truncate">{curriculumData[currentModule]?.title}</p>
//                 <p className="font-semibold text-foreground text-sm truncate">{currentLessonData.title}</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Floating Course Menu Button */}
//         <button
//           onClick={() => setIsMobileSidebarOpen(true)}
//           className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl hover:shadow-3xl transition-all hover:scale-110 active:scale-95 z-40 animate-bounce"
//           style={{ animationDuration: '2s' }}
//         >
//           <Menu size={24} />
//           <span className="sr-only">Open Course Menu</span>
//         </button>

//         <div className="w-full max-w-none">
//           {/* Course Title Header - Full Width (Hidden on mobile) */}
//           <div className="bg-white p-6 md:p-8 border-b border-border w-full hidden md:block">
//             <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
//               <h1 className="text-3xl font-bold text-gray-900 mb-2">{courseData?.title || 'Course'}</h1>
//               <p className="text-gray-600 text-lg">{courseData?.short_description || courseData?.description}</p>
//               <p className="text-gray-500 mt-1">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
//             </div>
//           </div>

//           {/* Content Player Section - Full Width */}
//           <div className="bg-white p-4 md:p-8 border-b border-border w-full">
//             <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
//               <div className="bg-black rounded-xl overflow-hidden relative w-full aspect-video max-w-4xl mx-auto shadow-lg">
                
//                 {/* CRITICAL FIX APPLIED HERE: Using the robust `isVideoLesson` check */}
//                 {isVideoLesson ? (
//                   <VideoPlayer />
//                 ) : (
//                   // Non-video content placeholder (PURPLE GRADIENT)
//                   <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
//                     <div className="text-center space-y-4 text-white">
//                       <FileText size={64} className="mx-auto" />
//                       <p className="text-xl font-semibold">{currentLessonData.title}</p>
//                       <p className="text-white/80">This is a {currentLessonData.contentType} lesson</p>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* Progress saving indicator */}
//               <div className="mt-2 text-center">
//                 {isSaving && (
//                   <div className="inline-flex items-center gap-2 text-sm text-blue-600">
//                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
//                     Saving progress...
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Overall Progress Bar - Full Width */}
//           <div className="bg-white p-4 md:p-6 border-b border-border w-full">
//             <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
//               <div className="flex items-center justify-between mb-2">
//                 <span className="font-semibold text-gray-900">Course Progress</span>
//                 <span className="text-primary font-bold">{overallProgress}%</span>
//               </div>
//               <div className="w-full bg-gray-200 rounded-full h-3">
//                 <div
//                   className="bg-primary rounded-full h-3 transition-all duration-500 ease-in-out"
//                   style={{ width: `${overallProgress}%` }}
//                 />
//               </div>
//               <p className="text-sm text-gray-600 mt-2">
//                 You've completed {overallProgress}% of the course. Keep going!
//               </p>
//             </div>
//           </div>

//           {/* Lesson Content Section - Full Width */}
//           <div className="bg-white px-4 md:px-8 py-6 md:py-8 w-full">
//             {/* Lesson Header - Full Width but content constrained */}
//             <div className="border-b border-border pb-6 md:pb-8 w-full">
//               <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
//                 <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
//                   <div className="hidden md:block">
//                     <p className="text-sm text-muted-foreground mb-2">{curriculumData[currentModule]?.title}</p>
//                     <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{currentLessonData.title}</h1>
//                     <p className="text-muted-foreground">
//                       {currentLessonData.duration ? `${Math.round(currentLessonData.duration / 60)} minute ` : ''}
//                       {currentLessonData.contentType} lesson
//                     </p>
//                   </div>
//                   <button
//                     onClick={() => completeLesson()}
//                     disabled={userProgress[currentLessonData.id]?.completed || isSaving}
//                     className={`px-6 py-3 rounded-lg font-semibold transition whitespace-nowrap w-full md:w-auto ${
//                       userProgress[currentLessonData.id]?.completed
//                         ? "bg-green-100 text-green-800 cursor-not-allowed"
//                         : "bg-primary text-primary-foreground hover:opacity-90 hover:shadow-md"
//                     }`}
//                   >
//                     {userProgress[currentLessonData.id]?.completed ? (
//                       <span className="flex items-center gap-2">
//                         <CheckCircle2 size={18} />
//                         Completed
//                       </span>
//                     ) : isSaving ? (
//                       <span className="flex items-center gap-2">
//                         <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                         Saving...
//                       </span>
//                     ) : (
//                       "Mark Complete"
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Lesson Content Tabs - Full Width but content constrained */}
//             <div className="border-b border-border w-full">
//               <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
//                 <div className="flex gap-2 md:gap-4 overflow-x-auto">
//                   <button
//                     onClick={() => setActiveTab("overview")}
//                     className={`cursor-pointer px-3 py-2 md:px-4 md:py-3 font-semibold transition whitespace-nowrap ${
//                       activeTab === "overview"
//                         ? "text-primary border-b-2 border-primary"
//                         : "text-muted-foreground hover:text-foreground"
//                     }`}
//                   >
//                     Overview
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("notes")}
//                     className={`cursor-pointer px-3 py-2 md:px-4 md:py-3 font-semibold transition whitespace-nowrap ${
//                       activeTab === "notes"
//                         ? "text-primary border-b-2 border-primary"
//                         : "text-muted-foreground hover:text-foreground"
//                     }`}
//                   >
//                     Notes
//                   </button>
//                   <button
//                     onClick={() => setActiveTab("resources")}
//                     className={`cursor-pointerpx-3 py-2 md:px-4 md:py-3 font-semibold transition whitespace-nowrap ${
//                       activeTab === "resources"
//                         ? "text-primary border-b-2 border-primary"
//                         : "text-muted-foreground hover:text-foreground"
//                     }`}
//                   >
//                     Resources
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* File Viewer Modal */}
//             {showFileViewer && selectedFile && (
//               <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//                 <div className="w-full max-w-6xl h-[90vh]">
//                   <FileViewer
//                     file={selectedFile}
//                     onClose={() => setShowFileViewer(false)}
//                     onNext={handleNextFile}
//                     onPrev={handlePrevFile}
//                     showNavigation={courseResources.length > 1}
//                   />
//                 </div>
//               </div>
//             )}

//             {/* Tab Content - ONLY this section is constrained to max-w-4xl */}
//             <div className="w-full">
//               <div className="max-w-4xl mx-auto mt-6 md:mt-8 px-4 md:px-6">
//                 {activeTab === "overview" && (
//                   <div className="w-full py-4 md:py-6">
//                     <div className="space-y-6 md:space-y-8 w-full">
//                       <div>
//                         <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 text-foreground">About this lesson</h3>
//                         <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
//                           {currentLessonData.description || "This lesson covers important concepts and practical applications. Follow along to enhance your understanding and skills."}
//                         </p>
//                       </div>

//                       <div className="bg-gray-50 rounded-lg p-4 md:p-6 w-full">
//                         <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">Learning Objectives</h3>
//                         <ul className="space-y-2 md:space-y-3 text-muted-foreground">
//                           <li className="flex items-center gap-3">
//                             <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
//                             Understand key concepts presented in this lesson
//                           </li>
//                           <li className="flex items-center gap-3">
//                             <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
//                             Apply the knowledge to practical scenarios
//                           </li>
//                           <li className="flex items-center gap-3">
//                             <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
//                             Complete exercises and assessments
//                           </li>
//                         </ul>
//                       </div>

//                       <div className="w-full">
//                         <h3 className="text-lg md:text-xl font-bold mb-3 md:mb-4 text-foreground">Bookmarks</h3>
//                         <div className="space-y-2 md:space-y-3 w-full">
//                           {bookmarkedTimes.length > 0 ? (
//                             bookmarkedTimes.map((time, index) => (
//                               <button
//                                 key={index}
//                                 onClick={() => {
//                                   currentTimeRef.current = time
//                                   if (videoRef.current) {
//                                     videoRef.current.currentTime = time
//                                   }
//                                   forceUpdate(x => x + 1)
//                                 }}
//                                 className="cursor-pointer w-full text-left px-3 py-2 md:px-4 md:py-3 rounded-lg bg-muted hover:bg-muted/80 transition flex items-center gap-3"
//                               >
//                                 <Bookmark size={14} className="text-blue-500 flex-shrink-0" />
//                                 <div>
//                                   <span className="font-semibold text-foreground text-sm md:text-base">{formatTime(time)}</span>
//                                   <span className="text-xs text-muted-foreground ml-2">Bookmark {index + 1}</span>
//                                 </div>
//                               </button>
//                             ))
//                           ) : (
//                             <div className="text-center py-6 md:py-8 bg-gray-50 rounded-lg w-full">
//                               <Bookmark size={36} className="text-gray-400 mx-auto mb-2 md:mb-3" />
//                               <p className="text-muted-foreground">No bookmarks yet</p>
//                               <p className="text-sm text-muted-foreground mt-1">Add bookmarks while watching the video!</p>
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "notes" && (
//                   <div className="w-full py-4 md:py-6">
//                     <div className="space-y-4 md:space-y-6 w-full">
//                       <h3 className="text-xl md:text-2xl font-bold text-foreground">Your Notes</h3>
                      
//                       {/* Text Formatting Toolbar */}
//                       <div className="bg-gray-50 border border-gray-200 rounded-lg p-2 md:p-3 flex flex-wrap gap-1 md:gap-2 w-full">
//                         <button className="cursor-pointerp-1 md:p-2 hover:bg-gray-200 rounded transition" title="Bold">
//                           <Bold size={16} />
//                         </button>
//                         <button className="cursor-pointer p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Italic">
//                           <Italic size={16} />
//                         </button>
//                         <button className="cursor-pointer p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Underline">
//                           <Underline size={16} />
//                         </button>
//                         <div className="cursor-pointer w-px bg-gray-300 h-4 md:h-6"></div>
//                         <button className="p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Bullet List">
//                           <List size={16} />
//                         </button>
//                         <button className="cursor-pointer p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Numbered List">
//                           <ListOrdered size={16} />
//                         </button>
//                         <button className="cursor-pointer p-1 md:p-2 hover:bg-gray-200 rounded transition" title="Insert Link">
//                           <LinkIcon size={16} />
//                         </button>
//                       </div>

//                       {/* Large Text Area - Full Width */}
//                       <textarea
//                         value={notes}
//                         onChange={(e) => setNotes(e.target.value)}
//                         placeholder="Start typing your notes here... You can format your text using the toolbar above. Write down key concepts, questions, code snippets, or insights from this lesson."
//                         className="w-full min-h-[300px] md:min-h-[400px] p-4 md:p-6 rounded-lg border border-gray-300 bg-white text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-base md:text-lg leading-relaxed resize-y"
//                       />
                      
//                       <div className="flex justify-between items-center text-xs md:text-sm text-muted-foreground w-full flex-col md:flex-row gap-2 md:gap-0">
//                         <span>Your notes are automatically saved as you type</span>
//                         <span>{notes.length} characters • {notes.split(/\s+/).filter(word => word.length > 0).length} words</span>
//                       </div>
//                     </div>
//                   </div>
//                 )}

//                 {activeTab === "resources" && (
//                   <div className="w-full py-4 md:py-6">
//                     <div className="space-y-6 md:space-y-8 w-full">
//                       <h3 className="text-xl md:text-2xl font-bold text-foreground">Course Resources</h3>
                      
//                       {/* Quick Stats */}
//                       {courseResources.length > 0 && (
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
//                           <div className="bg-blue-50 p-3 md:p-4 rounded-xl">
//                             <div className="text-lg md:text-2xl font-bold text-blue-700">{courseResources.length}</div>
//                             <div className="text-xs md:text-sm text-blue-600">Total Files</div>
//                           </div>
//                           <div className="bg-green-50 p-3 md:p-4 rounded-xl">
//                             <div className="text-lg md:text-2xl font-bold text-green-700">
//                               {pdfResources.length}
//                             </div>
//                             <div className="text-xs md:text-sm text-green-600">PDF Documents</div>
//                           </div>
//                           <div className="bg-purple-50 p-3 md:p-4 rounded-xl">
//                             <div className="text-lg md:text-2xl font-bold text-purple-700">{otherResources.length}</div>
//                             <div className="text-xs md:text-sm text-purple-600">Other Files</div>
//                           </div>
//                           <div className="bg-amber-50 p-3 md:p-4 rounded-xl">
//                             <div className="text-lg md:text-2xl font-bold text-amber-700">
//                               {new Set(courseResources.map(r => r.moduleTitle)).size}
//                             </div>
//                             <div className="text-xs md:text-sm text-amber-600">Modules</div>
//                           </div>
//                         </div>
//                       )}
                      
//                       {/* All Resources Section */}
//                       {courseResources.length > 0 ? (
//                         <div className="space-y-6">
//                           <div className="flex items-center justify-between">
//                             <h4 className="text-lg md:text-xl font-bold text-gray-900">All Resources</h4>
//                             <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
//                               {courseResources.length} {courseResources.length === 1 ? 'file' : 'files'}
//                             </span>
//                           </div>
                          
//                           <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
//                             <div className="overflow-x-auto">
//                               <table className="w-full">
//                                 <thead className="bg-gray-50">
//                                   <tr>
//                                     <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       File
//                                     </th>
//                                     <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Type
//                                     </th>
//                                     <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider hidden md:table-cell">
//                                       Source
//                                     </th>
//                                     <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Size
//                                     </th>
//                                     <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
//                                       Actions
//                                     </th>
//                                   </tr>
//                                 </thead>
//                                 <tbody className="divide-y divide-gray-200">
//                                   {courseResources.map((resource, index) => (
//                                     <tr key={resource.id} className="hover:bg-gray-50 transition-colors group">
//                                       <td className="py-3 px-4">
//                                         <div className="flex items-center gap-3">
//                                           <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                             <span className="text-blue-600">{getFileIcon(resource.type)}</span>
//                                           </div>
//                                           <div className="min-w-0">
//                                             <p className="font-medium text-gray-900 truncate max-w-xs">
//                                               {resource.name}
//                                             </p>
//                                             <p className="text-xs text-gray-500 md:hidden">
//                                               {resource.lessonTitle}
//                                             </p>
//                                           </div>
//                                         </div>
//                                       </td>
//                                       <td className="py-3 px-4">
//                                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
//                                           {resource.type}
//                                         </span>
//                                       </td>
//                                       <td className="py-3 px-4 hidden md:table-cell">
//                                         <div className="text-sm text-gray-600">
//                                           <p className="truncate max-w-xs">{resource.lessonTitle}</p>
//                                           <p className="text-xs text-gray-500">{resource.moduleTitle}</p>
//                                         </div>
//                                       </td>
//                                       <td className="py-3 px-4">
//                                         <span className="text-sm text-gray-600">
//                                           {resource.size ? formatFileSize(resource.size) : '—'}
//                                         </span>
//                                       </td>
//                                       <td className="py-3 px-4">
//                                         <div className="flex items-center gap-2">
//                                           <button
//                                             onClick={() => {
//                                               setSelectedFile(resource);
//                                               setCurrentFileIndex(index);
//                                               setShowFileViewer(true);
//                                             }}
//                                             className="cursor-pointer inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 font-medium text-sm px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
//                                             title="Preview file"
//                                           >
//                                             <Eye size={14} />
//                                             View
//                                           </button>
//                                           <a
//                                             href={resource.url}
//                                             download={resource.name}
//                                             className="inline-flex items-center gap-1.5 text-green-600 hover:text-green-800 font-medium text-sm px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
//                                             title="Download file"
//                                           >
//                                             <Download size={14} />
//                                             Download
//                                           </a>
//                                         </div>
//                                       </td>
//                                     </tr>
//                                   ))}
//                                 </tbody>
//                               </table>
//                             </div>
//                           </div>
                          
//                           {/* Card View for Mobile */}
//                           <div className="md:hidden space-y-3">
//                             <h4 className="text-lg font-bold text-gray-900">Resources</h4>
//                             {courseResources.map((resource, index) => (
//                               <div
//                                 key={resource.id}
//                                 className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
//                               >
//                                 <div className="flex items-start gap-3">
//                                   <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
//                                     <span className="text-blue-600 text-lg">{getFileIcon(resource.type)}</span>
//                                   </div>
                                  
//                                   <div className="flex-1 min-w-0">
//                                     <h5 className="font-semibold text-gray-900 truncate">{resource.name}</h5>
//                                     <p className="text-xs text-gray-600 mt-1">
//                                       {resource.type} • {resource.size ? formatFileSize(resource.size) : 'Size unknown'}
//                                     </p>
//                                     <p className="text-xs text-gray-500 mt-1 truncate">
//                                       From: {resource.lessonTitle}
//                                     </p>
                                    
//                                     <div className="flex items-center justify-between mt-3">
//                                       <div className="flex items-center gap-2">
//                                         <button
//                                           onClick={() => {
//                                             setSelectedFile(resource);
//                                             setCurrentFileIndex(index);
//                                             setShowFileViewer(true);
//                                           }}
//                                           className="cursor-pointer text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 bg-blue-50 rounded"
//                                         >
//                                           View
//                                         </button>
                                        
//                                         <a
//                                           href={resource.url}
//                                           download={resource.name}
//                                           className="text-xs text-green-600 hover:text-green-800 font-medium px-2 py-1 bg-green-50 rounded"
//                                         >
//                                           Download
//                                         </a>
//                                       </div>
                                      
//                                       <span className="text-xs text-gray-500">
//                                         {resource.moduleTitle}
//                                       </span>
//                                     </div>
//                                   </div>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl border border-gray-200">
//                           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
//                             <span className="text-3xl">📁</span>
//                           </div>
//                           <h4 className="text-xl font-semibold text-gray-900 mb-2">No Resources Available</h4>
//                           <p className="text-gray-600 max-w-md mx-auto">
//                             This course doesn't have any downloadable resources or documents yet.
//                           </p>
//                           <p className="text-sm text-gray-500 mt-2">
//                             Check back later or contact the instructor for additional materials.
//                           </p>
//                         </div>
//                       )}
                      
//                       {/* Quick Actions Bar */}
//                       {courseResources.length > 0 && (
//                         <div className="flex flex-wrap gap-3 justify-center pt-6 border-t border-gray-200">
//                           <button
//                             onClick={() => {
//                               // Download all as zip (would need backend implementation)
//                               toast({
//                                 title: "Feature Coming Soon",
//                                 description: "Bulk download will be available in the next update.",
//                               });
//                             }}
//                             className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium transition-colors"
//                           >
//                             <Archive className="h-4 w-4" />
//                             Download All as ZIP
//                           </button>
                          
//                           <button
//                             onClick={() => {
//                               // Print all resources (would need backend implementation)
//                               toast({
//                                 title: "Feature Coming Soon",
//                                 description: "Print all resources feature will be available soon.",
//                               });
//                             }}
//                             className="cursor-pointerinline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg font-medium transition-colors"
//                           >
//                             <Printer className="h-4 w-4" />
//                             Print All
//                           </button>
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Navigation Buttons - Full Width but content constrained */}
//             <div className="border-t border-border w-full mt-6 md:mt-8">
//               <div className="max-w-7xl mx-auto w-full px-4 md:px-6">
//                 <div className="flex gap-3 md:gap-4 py-6 md:py-8 flex-col md:flex-row">
//                   <button
//                     onClick={goToPreviousLesson}
//                     disabled={currentModule === 0 && currentLesson === 0}
//                     className="cursor-pointer px-6 py-3 md:px-8 md:py-3 rounded-lg border border-border hover:bg-muted transition disabled:opacity-50 font-semibold text-sm md:text-base"
//                   >
//                     Previous Lesson
//                   </button>
//                   <button
//                     onClick={goToNextLesson}
//                     disabled={
//                       currentModule === curriculumData.length - 1 &&
//                       currentLesson === curriculumData[currentModule].lessons.length - 1
//                     }
//                     className="cursor-pointer px-6 py-3 md:px-8 md:py-3 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-50 font-semibold text-sm md:text-base"
//                   >
//                     Next Lesson
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }


















































// 'use client'
// // /src/components/courses/course-learning.tsx
// //
// // Key corrections vs previous version:
// // ─ lesson_type (not content_type) determines the lesson medium
// //   Values: 'video'|'text'|'document'|'quiz'|'assignment'|
// //           'live_session'|'audio'|'interactive'|'code'|'discussion'
// // ─ content_type is 'free'|'premium'|'trial' — access control only
// // ─ content_html is the real WYSIWYG field name
// // ─ Video viewport only renders when lesson has a real video_url
// // ─ All lesson types get appropriate content displays
// // ─ Module learning_objectives and key_concepts displayed
// // ─ audio lessons get audio player
// // ─ recommended_readings displayed for text/document lessons

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import {
//   ChevronDown, ChevronUp, Bookmark, CheckCircle2, BookOpen,
//   Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
//   LayoutDashboard, Menu, X, Clock, FileText, Video, Download,
//   Eye, Archive, Printer, ExternalLink, BookMarked, AlignLeft,
//   GraduationCap, Lightbulb, Hash, Music, Code2, MessageSquare,
//   Calendar, Puzzle, ClipboardList, ChevronRight,
// } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import FileViewer from '@/components/courses/file-viewer'

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const formatFileSize = (bytes: number | null): string => {
//   if (!bytes) return 'Unknown size'
//   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   if (bytes === 0) return '0 Bytes'
//   const i = Math.floor(Math.log(bytes) / Math.log(1024))
//   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
// }

// const getFileIcon = (type: string) => {
//   const t = type.toLowerCase()
//   if (t.includes('pdf'))    return '📄'
//   if (t.includes('word') || t.includes('doc'))  return '📝'
//   if (t.includes('excel') || t.includes('sheet') || t.includes('csv')) return '📊'
//   if (t.includes('powerpoint') || t.includes('presentation')) return '📈'
//   if (t.includes('image'))  return '🖼️'
//   if (t.includes('video'))  return '🎬'
//   if (t.includes('audio'))  return '🎵'
//   if (t.includes('zip') || t.includes('archive') || t.includes('rar')) return '🗜️'
//   if (t.includes('code') || t.includes('json') || t.includes('xml'))   return '💻'
//   return '📁'
// }

// const hasHtmlContent = (html: string | null | undefined): boolean => {
//   if (!html) return false
//   return html.replace(/<[^>]*>/g, '').trim().length > 0
// }

// // Approximate read time in minutes
// const readTimeMinutes = (html: string | null | undefined): number => {
//   if (!html) return 1
//   const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
//   return Math.max(1, Math.ceil(words / 200))
// }

// // ─── Types ────────────────────────────────────────────────────────────────────
// // These match exactly what learn-page.tsx pushes into curriculumData

// type LessonType =
//   | 'video' | 'text' | 'document' | 'quiz' | 'assignment'
//   | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion'

// interface Lesson {
//   id:           string
//   title:        string
//   description?: string | null
//   lessonType:   LessonType   // the actual medium — THIS is what we branch on
//   contentType:  string       // 'free'|'premium'|'trial' — access control only
//   difficulty?:  string | null
//   // ── Rich text body ────────────────────────────────────────────────────
//   contentHtml?: string | null
//   // ── Video ─────────────────────────────────────────────────────────────
//   videoUrl?:       string | null
//   videoDuration?:  number
//   videoThumbnail?: string | null
//   // ── Audio ─────────────────────────────────────────────────────────────
//   audioUrl?:      string | null
//   audioDuration?: number
//   // ── Document ──────────────────────────────────────────────────────────
//   documentUrl?:  string | null
//   documentType?: string | null
//   documentSize?: number | null
//   // ── Supplementary ─────────────────────────────────────────────────────
//   externalLinks?:            any
//   downloadableResources?:    string[]
//   attachedFiles?:            string[]
//   recommendedReadings?:      string[]
//   hasDownloadableResources?: boolean
//   // ── Display ───────────────────────────────────────────────────────────
//   duration:  number
//   order:     number
//   isPreview: boolean
//   // ── Progress (merged in by getCurrentLessonData) ───────────────────────
//   watched?:    number
//   completed?:  boolean
// }

// interface Module {
//   id:                 string
//   title:              string
//   description?:       string | null
//   order:              number
//   learningObjectives: string[]
//   keyConcepts:        string[]
//   lessons:            Lesson[]
// }

// interface UserProgress {
//   [lessonId: string]: {
//     completed:      boolean
//     progress:       number
//     timeSpent:      number
//     lastPosition:   number
//     lastAccessedAt: string | null
//   }
// }

// interface CourseResource {
//   id:           string
//   name:         string
//   url:          string
//   type:         string
//   size:         number | null
//   lessonTitle:  string
//   moduleTitle:  string
//   isPdf?:       boolean
// }

// interface CourseLearningProps {
//   courseId:             string
//   courseData:           any
//   curriculumData:       Module[]
//   enrollmentData?:      any
//   userId:               string
//   initialUserProgress?: UserProgress
//   courseResources?:     CourseResource[]
// }

// // ─── Lesson type metadata ────────────────────────────────────────────────────

// const LESSON_TYPE_META: Record<LessonType, { label: string; color: string; bgColor: string; Icon: any }> = {
//   video:        { label: 'Video Lesson',       color: 'text-blue-600',   bgColor: 'bg-blue-50',   Icon: Video },
//   audio:        { label: 'Audio Lesson',        color: 'text-violet-600', bgColor: 'bg-violet-50', Icon: Music },
//   text:         { label: 'Reading',             color: 'text-indigo-600', bgColor: 'bg-indigo-50', Icon: BookMarked },
//   document:     { label: 'Document',            color: 'text-amber-600',  bgColor: 'bg-amber-50',  Icon: FileText },
//   quiz:         { label: 'Quiz',                color: 'text-orange-600', bgColor: 'bg-orange-50', Icon: ClipboardList },
//   assignment:   { label: 'Assignment',          color: 'text-rose-600',   bgColor: 'bg-rose-50',   Icon: ClipboardList },
//   live_session: { label: 'Live Session',        color: 'text-green-600',  bgColor: 'bg-green-50',  Icon: Calendar },
//   interactive:  { label: 'Interactive Lesson',  color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   Icon: Puzzle },
//   code:         { label: 'Code Exercise',       color: 'text-slate-600',  bgColor: 'bg-slate-50',  Icon: Code2 },
//   discussion:   { label: 'Discussion',          color: 'text-teal-600',   bgColor: 'bg-teal-50',   Icon: MessageSquare },
// }

// // ─── LessonContent ────────────────────────────────────────────────────────────
// // Renders the body for non-video lessons (text, document, audio, code, etc.)

// interface LessonContentProps {
//   lesson:          Lesson
//   module:          Module
//   courseResources: CourseResource[]
//   onViewFile:      (resource: CourseResource, index: number) => void
// }

// function LessonContent({ lesson, module, courseResources, onViewFile }: LessonContentProps) {
//   const meta         = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//   const hasContent   = hasHtmlContent(lesson.contentHtml)
//   const hasDocument  = Boolean(lesson.documentUrl)
//   const hasExtLinks  = Array.isArray(lesson.externalLinks) && lesson.externalLinks.length > 0
//   const hasReadings  = Array.isArray(lesson.recommendedReadings) && lesson.recommendedReadings.length > 0
//   const lessonFiles  = courseResources.filter(r => r.lessonTitle === lesson.title)
//   const hasFiles     = lessonFiles.length > 0
//   const hasModuleObjectives = module.learningObjectives?.length > 0
//   const hasModuleKeyConcepts = module.keyConcepts?.length > 0

//   const nothing = !hasContent && !hasDocument && !hasExtLinks && !hasReadings && !hasFiles

//   if (nothing) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className={`w-16 h-16 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-4`}>
//           <meta.Icon className={`w-8 h-8 ${meta.color}`} />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-1">No content yet</h3>
//         <p className="text-sm text-gray-400 max-w-sm">
//           The instructor hasn't added content for this lesson. Check back later or explore the Resources tab.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-10">

//       {/* ── RICH HTML BODY (content_html) ────────────────────────────────── */}
//       {hasContent && (
//         <section>
//           <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//             <AlignLeft className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Lesson Content</span>
//             <span className="ml-auto text-xs text-gray-400">~{readTimeMinutes(lesson.contentHtml)} min read</span>
//           </div>

//           <div
//             className="
//               prose prose-slate max-w-none
//               prose-headings:font-bold prose-headings:text-gray-900 prose-headings:tracking-tight
//               prose-h1:text-2xl prose-h2:text-xl prose-h2:mt-8 prose-h3:text-lg prose-h3:mt-6
//               prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-[15px]
//               prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
//               prose-strong:text-gray-900 prose-strong:font-semibold
//               prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:text-rose-600 prose-code:font-mono prose-code:before:content-none prose-code:after:content-none
//               prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:overflow-x-auto prose-pre:text-sm
//               prose-blockquote:border-l-4 prose-blockquote:border-indigo-400 prose-blockquote:bg-indigo-50/60 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic prose-blockquote:text-gray-700
//               prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:my-1.5
//               prose-img:rounded-xl prose-img:shadow-md prose-img:mx-auto
//               prose-hr:border-gray-100 prose-hr:my-8
//               prose-table:text-sm prose-th:bg-gray-50 prose-th:font-semibold prose-td:align-top
//             "
//             dangerouslySetInnerHTML={{ __html: lesson.contentHtml! }}
//           />
//         </section>
//       )}

//       {/* ── DOCUMENT ATTACHMENT (document_url) ───────────────────────────── */}
//       {hasDocument && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Attached Document</span>
//             {lesson.documentSize && (
//               <span className="ml-auto text-xs text-gray-400">{formatFileSize(lesson.documentSize)}</span>
//             )}
//           </div>
//           <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
//             <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
//               {lesson.documentType?.toLowerCase().includes('pdf') ? '📄' : '📎'}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-900 truncate">{lesson.title}</p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {lesson.documentType || 'Document'}
//                 {lesson.documentSize ? ` • ${formatFileSize(lesson.documentSize)}` : ''}
//               </p>
//             </div>
//             <div className="flex gap-2 flex-shrink-0">
//               <a
//                 href={lesson.documentUrl!}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-medium text-sm px-3 py-1.5 bg-white border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors"
//               >
//                 <Eye className="w-3.5 h-3.5" /> View
//               </a>
//               <a
//                 href={lesson.documentUrl!}
//                 download
//                 className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-900 font-medium text-sm px-3 py-1.5 bg-white border border-green-200 hover:bg-green-100 rounded-lg transition-colors"
//               >
//                 <Download className="w-3.5 h-3.5" /> Download
//               </a>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ── LESSON FILES (from courseResources, filtered by lessonTitle) ──── */}
//       {hasFiles && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Archive className="w-4 h-4 text-violet-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Lesson Files</span>
//             <span className="ml-auto text-xs text-gray-400">
//               {lessonFiles.length} file{lessonFiles.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="grid gap-2.5">
//             {lessonFiles.map((resource) => {
//               const globalIdx = courseResources.findIndex(r => r.id === resource.id)
//               return (
//                 <div
//                   key={resource.id}
//                   className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all"
//                 >
//                   <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base shadow-sm">
//                     {getFileIcon(resource.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 text-sm truncate">{resource.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}
//                     </p>
//                   </div>
//                   <div className="flex gap-1.5 flex-shrink-0">
//                     <button
//                       onClick={() => onViewFile(resource, globalIdx)}
//                       className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
//                     >
//                       <Eye className="w-3 h-3" /> View
//                     </button>
//                     <a
//                       href={resource.url}
//                       download={resource.name}
//                       className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
//                     >
//                       <Download className="w-3 h-3" /> Save
//                     </a>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </section>
//       )}

//       {/* ── RECOMMENDED READINGS (recommended_readings string[]) ─────────── */}
//       {hasReadings && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
//               Recommended Readings
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {lesson.recommendedReadings!.map((reading, i) => (
//               <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                 <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
//                 </div>
//                 <span className="text-sm text-gray-700 leading-relaxed">{reading}</span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* ── EXTERNAL LINKS (external_links JSONB) ────────────────────────── */}
//       {hasExtLinks && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <ExternalLink className="w-4 h-4 text-sky-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
//               References & Links
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {(lesson.externalLinks as any[]).map((link: any, i: number) => {
//               const href  = typeof link === 'string' ? link : (link.url || '#')
//               const label = typeof link === 'string' ? link : (link.name || link.title || link.url || href)
//               return (
//                 <li key={i}>
//                   <a
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-sky-50 hover:bg-sky-100 hover:border-sky-200 transition-all"
//                   >
//                     <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-100">
//                       <Hash className="w-3.5 h-3.5 text-sky-500" />
//                     </div>
//                     <span className="flex-1 text-sm text-sky-700 group-hover:text-sky-900 font-medium truncate">
//                       {label}
//                     </span>
//                     <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0" />
//                   </a>
//                 </li>
//               )
//             })}
//           </ul>
//         </section>
//       )}

//       {/* ── MODULE KEY CONCEPTS (module.keyConcepts string[]) ────────────── */}
//       {hasModuleKeyConcepts && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Key Concepts</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {module.keyConcepts.map((concept, i) => (
//               <span
//                 key={i}
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
//                 {concept}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CourseLearningPage({
//   courseId,
//   courseData,
//   curriculumData,
//   enrollmentData,
//   userId,
//   initialUserProgress = {},
//   courseResources = [],
// }: CourseLearningProps) {
//   const [currentModule, setCurrentModule]             = useState(0)
//   const [currentLesson, setCurrentLesson]             = useState(0)
//   const [expandedModules, setExpandedModules]         = useState<number[]>([0])
//   const [isPlaying, setIsPlaying]                     = useState(false)
//   const [isMuted, setIsMuted]                         = useState(false)
//   const [bookmarkedTimes, setBookmarkedTimes]         = useState<number[]>([])
//   const [activeTab, setActiveTab]                     = useState<'overview' | 'notes' | 'resources'>('overview')
//   const [notes, setNotes]                             = useState('')
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
//   const [userProgress, setUserProgress]               = useState<UserProgress>(initialUserProgress)
//   const [selectedFile, setSelectedFile]               = useState<CourseResource | null>(null)
//   const [showFileViewer, setShowFileViewer]           = useState(false)
//   const [currentFileIndex, setCurrentFileIndex]       = useState(0)
//   const [videoDuration, setVideoDuration]             = useState(0)
//   const [isSaving, setIsSaving]                       = useState(false)

//   const currentTimeRef     = useRef(0)
//   const [, forceUpdate]    = useState(0)
//   const videoRef           = useRef<HTMLVideoElement>(null)
//   const audioRef           = useRef<HTMLAudioElement>(null)
//   const lastSaveRef        = useRef(0)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const pdfResources   = courseResources.filter(r => r.type === 'PDF Document')
//   const otherResources = courseResources.filter(r => r.type !== 'PDF Document')

//   const handleNextFile = () => {
//     if (currentFileIndex < courseResources.length - 1) {
//       const n = currentFileIndex + 1
//       setSelectedFile(courseResources[n]); setCurrentFileIndex(n)
//     }
//   }
//   const handlePrevFile = () => {
//     if (currentFileIndex > 0) {
//       const p = currentFileIndex - 1
//       setSelectedFile(courseResources[p]); setCurrentFileIndex(p)
//     }
//   }

//   useEffect(() => { loadUserProgress() }, [courseId, userId])

//   const loadUserProgress = async () => {
//     try {
//       const res = await fetch(`/api/student/progress?courseId=${courseId}`)
//       if (res.ok) {
//         const data = await res.json()
//         const t: UserProgress = {}
//         if (data.progress && typeof data.progress === 'object') {
//           Object.entries(data.progress).forEach(([id, d]: [string, any]) => {
//             t[id] = {
//               completed:      d.is_completed  || d.completed  || false,
//               progress:       d.video_progress || d.progress  || 0,
//               timeSpent:      d.time_spent     || 0,
//               lastPosition:   d.last_position  || 0,
//               lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
//             }
//           })
//         }
//         setUserProgress(t)
//       } else {
//         const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//         if (saved) setUserProgress(JSON.parse(saved))
//       }
//     } catch {
//       const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//       if (saved) try { setUserProgress(JSON.parse(saved)) } catch {}
//     }
//   }

//   const saveProgressToDatabase = async (lessonId: string, data: {
//     completed?: boolean; progress?: number; timeSpent?: number; lastPosition?: number
//   }) => {
//     try {
//       setIsSaving(true)
//       const res = await fetch('/api/student/progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ courseId, lessonId, userId, ...data }),
//       })
//       if (!res.ok) throw new Error('Failed to save')
//       return await res.json()
//     } catch {
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(userProgress).length > 0 && userId)
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//   }, [userProgress, courseId, userId])

//   // Auto-save video/audio progress
//   useEffect(() => {
//     const autoSave = async () => {
//       const lesson = getCurrentLessonData()
//       if (!lesson) return
//       const now = Date.now()
//       const currentTime = currentTimeRef.current
//       if (now - lastSaveRef.current > 30000 && currentTime > 10) {
//         const pct = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0
//         await saveProgressToDatabase(lesson.id, {
//           progress: pct, timeSpent: Math.floor(currentTime), lastPosition: Math.floor(currentTime),
//         })
//         lastSaveRef.current = now
//       }
//     }
//     const id = setInterval(autoSave, 10000)
//     return () => clearInterval(id)
//   }, [courseId, videoDuration])

//   const calculateOverallProgress = () => {
//     let total = 0, done = 0
//     curriculumData.forEach(m => m.lessons.forEach(l => {
//       total++
//       if (userProgress[l.id]?.completed) done++
//     }))
//     return total > 0 ? Math.round((done / total) * 100) : 0
//   }

//   const calculateModuleProgress = (module: Module) => {
//     if (!module.lessons.length) return 0
//     const done = module.lessons.filter(l => userProgress[l.id]?.completed).length
//     return Math.round((done / module.lessons.length) * 100)
//   }

//   const completeLesson = async (lessonId?: string) => {
//     const id = lessonId || getCurrentLessonData()?.id
//     if (!id) return
//     setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
//     await saveProgressToDatabase(id, { completed: true, progress: 100 })
//   }

//   const goToNextLesson = () => {
//     const lesson = getCurrentLessonData()
//     if (lesson && !userProgress[lesson.id]?.completed) completeLesson()
//     if (currentLesson < curriculumData[currentModule].lessons.length - 1)
//       selectLesson(currentModule, currentLesson + 1)
//     else if (currentModule < curriculumData.length - 1)
//       selectLesson(currentModule + 1, 0)
//   }

//   const goToPreviousLesson = () => {
//     if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
//     else if (currentModule > 0)
//       selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
//   }

//   const toggleModule = (i: number) =>
//     setExpandedModules(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

//   const selectLesson = async (modIdx: number, lesIdx: number) => {
//     setCurrentModule(modIdx); setCurrentLesson(lesIdx)
//     currentTimeRef.current = 0
//     setIsPlaying(false); setIsMobileSidebarOpen(false)
//     setTimeout(() => {
//       if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
//       if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.pause() }
//       forceUpdate(x => x + 1)
//     }, 100)
//     const lesson = curriculumData[modIdx]?.lessons[lesIdx]
//     if (lesson && !userProgress[lesson.id]?.completed) {
//       setUserProgress(prev => ({
//         ...prev,
//         [lesson.id]: { ...prev[lesson.id], completed: prev[lesson.id]?.completed || false,
//           progress: prev[lesson.id]?.progress || 0, timeSpent: prev[lesson.id]?.timeSpent || 0,
//           lastPosition: 0, lastAccessedAt: new Date().toISOString() },
//       }))
//       saveProgressToDatabase(lesson.id, { progress: 0, timeSpent: 0, lastPosition: 0 }).catch(() => {})
//     }
//   }

//   const formatTime = (s: number) =>
//     !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

//   const getCurrentLessonData = (): Lesson | null => {
//     const l = curriculumData[currentModule]?.lessons[currentLesson]
//     if (!l) return null
//     const p = userProgress[l.id] || {}
//     return { ...l, watched: p.timeSpent || 0, completed: p.completed || false }
//   }

//   const currentLessonData    = getCurrentLessonData()
//   const currentModuleData    = curriculumData[currentModule]
//   const overallProgress      = calculateOverallProgress()

//   // ── Determine what to show ──────────────────────────────────────────────
//   // We branch exclusively on lesson_type (the real medium field).
//   // video_url being present is the secondary check for video lessons
//   // (in case lesson_type is incorrectly set but url exists).
//   const lt = currentLessonData?.lessonType
//   const isVideoLesson = (lt === 'video') && Boolean(currentLessonData?.videoUrl)
//   const isAudioLesson = (lt === 'audio') && Boolean(currentLessonData?.audioUrl)
//   // All others render text/document content layout
//   const hasMediaPlayer = isVideoLesson || isAudioLesson

//   const lessonMeta = lt ? (LESSON_TYPE_META[lt] ?? LESSON_TYPE_META.text) : LESSON_TYPE_META.text

//   // ── Per-lesson sidebar icon (uses lesson's own lessonType/urls) ─────────
//   const getLessonIcon = (lesson: Lesson, completed?: boolean) => {
//     if (completed) return <CheckCircle2 size={15} className="flex-shrink-0 text-green-500" />
//     const meta = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//     return <meta.Icon size={14} className={`flex-shrink-0 ${meta.color}`} />
//   }

//   useEffect(() => () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }, [])

//   if (!currentLessonData) {
//     return (
//       <div className="flex-1 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
//           <p className="mt-4 text-gray-500 text-sm">Loading lesson…</p>
//         </div>
//       </div>
//     )
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // Sub-components
//   // ─────────────────────────────────────────────────────────────────────────

//   const AxioQuanLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
//     <a href="/" className={`flex items-center gap-2.5 ${size === 'small' ? 'px-1' : 'px-2'}`}>
//       <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
//         <span className="text-white font-bold text-sm">A</span>
//       </div>
//       {size === 'default' && <span className="font-bold text-lg text-foreground">AxioQuan</span>}
//     </a>
//   )

//   const CurriculumList = () => (
//     <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
//       {curriculumData.map((module, modIdx) => {
//         const modProgress = calculateModuleProgress(module)
//         return (
//           <div key={module.id}>
//             <button
//               onClick={() => toggleModule(modIdx)}
//               className="cursor-pointer w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
//             >
//               <div className="flex items-center gap-2.5 flex-1 min-w-0">
//                 <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
//                   <BookOpen size={13} className="text-gray-500" />
//                 </div>
//                 <div className="text-left min-w-0">
//                   <p className="font-semibold text-sm text-foreground truncate">{module.title}</p>
//                   <p className="text-xs text-muted-foreground">{modProgress}% complete</p>
//                 </div>
//               </div>
//               {expandedModules.includes(modIdx)
//                 ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
//                 : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
//             </button>

//             {expandedModules.includes(modIdx) && (
//               <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
//                 {module.lessons.map((lesson, lesIdx) => {
//                   const isActive    = currentModule === modIdx && currentLesson === lesIdx
//                   const isDone      = userProgress[lesson.id]?.completed
//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(modIdx, lesIdx)}
//                       className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
//                         isActive
//                           ? 'bg-primary text-primary-foreground'
//                           : 'hover:bg-gray-50 text-foreground'
//                       }`}
//                     >
//                       <span className="flex-shrink-0">{getLessonIcon(lesson, isDone)}</span>
//                       <span className="flex-1 text-left text-xs leading-snug line-clamp-2">{lesson.title}</span>
//                       {lesson.duration > 0 && !isDone && (
//                         <span className={`text-xs flex-shrink-0 flex items-center gap-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
//                           <Clock size={10} />{formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )

//   const MobileSidebar = () => (
//     <>
//       {isMobileSidebarOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)} />
//       )}
//       <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden shadow-2xl
//         ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <AxioQuanLogo />
//             <button onClick={() => setIsMobileSidebarOpen(false)}
//               className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <X size={18} />
//             </button>
//           </div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>
//     </>
//   )

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="flex min-h-screen bg-background">
//       <MobileSidebar />

//       {/* Desktop sidebar */}
//       <div className="hidden md:flex w-80 bg-white border-r border-border flex-col fixed left-0 top-0 bottom-0 z-30">
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="mb-3"><AxioQuanLogo /></div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>

//       {/* Main area */}
//       <div className="flex-1 md:ml-80 w-full min-h-screen flex flex-col">

//         {/* Mobile top bar */}
//         <div className="md:hidden bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <AxioQuanLogo size="small" />
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-muted-foreground truncate">{currentModuleData?.title}</p>
//               <p className="font-semibold text-sm truncate">{currentLessonData.title}</p>
//             </div>
//           </div>
//         </div>

//         {/* Floating mobile menu */}
//         <button
//           onClick={() => setIsMobileSidebarOpen(true)}
//           className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl z-40"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Course header (desktop only) */}
//         <div className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{courseData?.title || 'Course'}</h1>
//             {courseData?.short_description && (
//               <p className="text-gray-500 text-sm">{courseData.short_description}</p>
//             )}
//             <p className="text-gray-400 text-xs mt-0.5">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             VIDEO PLAYER — only when lessonType='video' AND videoUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isVideoLesson && (
//           <div className="bg-black flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
//               <div className="bg-black rounded-xl overflow-hidden w-full aspect-video max-w-4xl mx-auto shadow-2xl">
//                 <video
//                   key={currentLessonData.videoUrl!}
//                   ref={videoRef}
//                   className="w-full h-full object-contain"
//                   controls
//                   playsInline
//                   poster={currentLessonData.videoThumbnail ?? undefined}
//                   onTimeUpdate={() => {
//                     if (!videoRef.current) return
//                     currentTimeRef.current = videoRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onLoadedMetadata={() => {
//                     if (videoRef.current) setVideoDuration(videoRef.current.duration)
//                   }}
//                   onEnded={() => {
//                     setIsPlaying(false)
//                     const pct = currentLessonData.duration > 0
//                       ? (currentTimeRef.current / currentLessonData.duration) * 100
//                       : 100
//                     if (pct >= 90) completeLesson()
//                   }}
//                   onPlay={() => setIsPlaying(true)}
//                   onPause={() => setIsPlaying(false)}
//                 >
//                   <source src={currentLessonData.videoUrl!} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//               {isSaving && (
//                 <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1.5">
//                   <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//                   Saving progress…
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             AUDIO PLAYER — lessonType='audio' AND audioUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isAudioLesson && (
//           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
//               <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
//                     <Music className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
//                       Audio Lesson
//                     </p>
//                     <h3 className="text-white font-bold text-lg leading-tight">{currentLessonData.title}</h3>
//                   </div>
//                 </div>
//                 <audio
//                   key={currentLessonData.audioUrl!}
//                   ref={audioRef}
//                   className="w-full"
//                   controls
//                   onTimeUpdate={() => {
//                     if (!audioRef.current) return
//                     currentTimeRef.current = audioRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onEnded={() => completeLesson()}
//                 >
//                   <source src={currentLessonData.audioUrl!} />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             Progress bar
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-3 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <div className="flex items-center justify-between mb-1.5">
//               <span className="text-xs font-semibold text-gray-600">Course Progress</span>
//               <span className="text-xs font-bold text-primary">{overallProgress}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2">
//               <div
//                 className="bg-primary rounded-full h-2 transition-all duration-700"
//                 style={{ width: `${overallProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Lesson header + Mark Complete
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-4 justify-between flex-col md:flex-row">
//             <div className="min-w-0">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//                 {currentModuleData?.title}
//               </p>
//               <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
//                 {currentLessonData.title}
//               </h2>
//               <div className="flex flex-wrap items-center gap-2.5">
//                 {/* Lesson type badge */}
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${lessonMeta.bgColor} ${lessonMeta.color}`}>
//                   <lessonMeta.Icon size={12} />
//                   {lessonMeta.label}
//                 </span>
//                 {currentLessonData.difficulty && (
//                   <span className="text-xs text-gray-400 capitalize">{currentLessonData.difficulty}</span>
//                 )}
//                 {currentLessonData.duration > 0 && (
//                   <span className="flex items-center gap-1 text-xs text-gray-400">
//                     <Clock size={11} />{formatTime(currentLessonData.duration)}
//                   </span>
//                 )}
//                 {isVideoLesson && (
//                   <span className="text-xs text-gray-400 flex items-center gap-1">
//                     <Video size={11} /> Video
//                   </span>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => completeLesson()}
//               disabled={userProgress[currentLessonData.id]?.completed || isSaving}
//               className={`flex-shrink-0 w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
//                 userProgress[currentLessonData.id]?.completed
//                   ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
//                   : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
//               }`}
//             >
//               {userProgress[currentLessonData.id]?.completed ? (
//                 <><CheckCircle2 size={16} />Completed</>
//               ) : isSaving ? (
//                 <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
//               ) : (
//                 'Mark Complete'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Tabs
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border flex-shrink-0 sticky top-0 z-20">
//           <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0 overflow-x-auto">
//             {(['overview', 'notes', 'resources'] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`cursor-pointer px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* File viewer modal */}
//         {showFileViewer && selectedFile && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-6xl h-[90vh]">
//               <FileViewer
//                 file={selectedFile}
//                 onClose={() => setShowFileViewer(false)}
//                 onNext={handleNextFile}
//                 onPrev={handlePrevFile}
//                 showNavigation={courseResources.length > 1}
//               />
//             </div>
//           </div>
//         )}

//         {/* ─── Tab content ────────────────────────────────────────────── */}
//         <div className="flex-1 bg-gray-50">
//           <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

//             {/* ── OVERVIEW ─────────────────────────────────────────────── */}
//             {activeTab === 'overview' && (
//               <div className="space-y-8">

//                 {/* Description */}
//                 {currentLessonData.description && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Lightbulb className="w-4 h-4 text-amber-500" />
//                       <h3 className="font-bold text-gray-900 text-sm">About this lesson</h3>
//                     </div>
//                     <p className="text-gray-600 leading-relaxed text-[15px]">
//                       {currentLessonData.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ─────────────────────────────────────────────────────
//                     VIDEO lesson → objectives + bookmarks
//                     All other lesson types → full content body
//                 ───────────────────────────────────────────────────── */}
//                 {hasMediaPlayer ? (
//                   /* ── Video/Audio: objectives + bookmarks ──────────── */
//                   <div className="space-y-6">
//                     {/* Module learning objectives */}
//                     {currentModuleData?.learningObjectives?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <GraduationCap className="w-4 h-4 text-indigo-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Learning Objectives</h3>
//                         </div>
//                         <ul className="space-y-2.5">
//                           {currentModuleData.learningObjectives.map((obj, i) => (
//                             <li key={i} className="flex items-start gap-3">
//                               <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
//                               <span className="text-gray-600 text-[15px] leading-relaxed">{obj}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Module key concepts */}
//                     {currentModuleData?.keyConcepts?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Lightbulb className="w-4 h-4 text-yellow-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Key Concepts</h3>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {currentModuleData.keyConcepts.map((concept, i) => (
//                             <span key={i}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
//                               <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{concept}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Bookmarks (only relevant for video) */}
//                     {isVideoLesson && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Bookmark className="w-4 h-4 text-blue-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Video Bookmarks</h3>
//                         </div>
//                         {bookmarkedTimes.length > 0 ? (
//                           <div className="space-y-2">
//                             {bookmarkedTimes.map((t, i) => (
//                               <button
//                                 key={i}
//                                 onClick={() => {
//                                   currentTimeRef.current = t
//                                   if (videoRef.current) videoRef.current.currentTime = t
//                                   forceUpdate(x => x + 1)
//                                 }}
//                                 className="cursor-pointer w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition flex items-center gap-3"
//                               >
//                                 <Bookmark size={13} className="text-blue-400 flex-shrink-0" />
//                                 <span className="font-mono font-semibold text-sm text-gray-800">{formatTime(t)}</span>
//                                 <span className="text-xs text-gray-400">Bookmark {i + 1}</span>
//                               </button>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-400 text-center py-3">
//                             No bookmarks yet. Use the video player to add them.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   /* ── Text/Document/Quiz/etc: full lesson content ─── */
//                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className={`px-6 py-4 border-b border-gray-50 flex items-center gap-3 ${lessonMeta.bgColor}`}>
//                       <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
//                         <lessonMeta.Icon className={`w-4 h-4 ${lessonMeta.color}`} />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 text-sm">{lessonMeta.label}</p>
//                         <p className="text-xs text-gray-500">
//                           {hasHtmlContent(currentLessonData.contentHtml)
//                             ? `~${readTimeMinutes(currentLessonData.contentHtml)} min read`
//                             : 'Study material below'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="p-6 md:p-8">
//                       <LessonContent
//                         lesson={currentLessonData}
//                         module={currentModuleData}
//                         courseResources={courseResources}
//                         onViewFile={(resource, index) => {
//                           setSelectedFile(resource)
//                           setCurrentFileIndex(index)
//                           setShowFileViewer(true)
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── NOTES ────────────────────────────────────────────────── */}
//             {activeTab === 'notes' && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
//                   <span className="text-xs text-gray-400">{notes.split(/\s+/).filter(Boolean).length} words</span>
//                 </div>
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                   <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
//                     {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, i) => (
//                       <button key={i}
//                         className="cursor-pointer p-1.5 rounded hover:bg-gray-200 transition text-gray-500 hover:text-gray-800">
//                         <Icon size={14} />
//                       </button>
//                     ))}
//                   </div>
//                   <textarea
//                     value={notes}
//                     onChange={e => setNotes(e.target.value)}
//                     placeholder={"Start typing your notes…\n\nWrite down key concepts, questions, or insights."}
//                     className="w-full min-h-[400px] p-5 bg-white text-gray-800 placeholder-gray-300 focus:outline-none text-[15px] leading-relaxed resize-y font-sans"
//                   />
//                   <div className="px-5 py-2 border-t border-gray-50 flex justify-between text-xs text-gray-400">
//                     <span>Notes are saved locally</span>
//                     <span>{notes.length} chars</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── RESOURCES ────────────────────────────────────────────── */}
//             {activeTab === 'resources' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-bold text-foreground">Course Resources</h3>

//                 {courseResources.length > 0 ? (
//                   <>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {[
//                         { label: 'Total Files',   value: courseResources.length, bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-500' },
//                         { label: 'PDFs',          value: pdfResources.length,    bg: 'bg-green-50',  text: 'text-green-700',  sub: 'text-green-500' },
//                         { label: 'Other',         value: otherResources.length,  bg: 'bg-violet-50', text: 'text-violet-700', sub: 'text-violet-500' },
//                         { label: 'Modules',       value: new Set(courseResources.map(r => r.moduleTitle)).size, bg: 'bg-amber-50', text: 'text-amber-700', sub: 'text-amber-500' },
//                       ].map(s => (
//                         <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
//                           <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
//                           <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Desktop table */}
//                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hidden md:block overflow-hidden">
//                       <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
//                         <span className="font-semibold text-sm text-gray-900">All Resources</span>
//                         <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                           {courseResources.length} files
//                         </span>
//                       </div>
//                       <table className="w-full">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             {['File', 'Type', 'Source', 'Size', 'Actions'].map(h => (
//                               <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                           {courseResources.map((resource, idx) => (
//                             <tr key={resource.id} className="hover:bg-gray-50/60 transition-colors">
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2.5">
//                                   <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">{getFileIcon(resource.type)}</div>
//                                   <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{resource.name}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resource.type}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <p className="text-sm text-gray-600 truncate max-w-[160px]">{resource.lessonTitle}</p>
//                                 <p className="text-xs text-gray-400">{resource.moduleTitle}</p>
//                               </td>
//                               <td className="py-3 px-4 text-sm text-gray-500">
//                                 {resource.size ? formatFileSize(resource.size) : '—'}
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex gap-1.5">
//                                   <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                     className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
//                                     <Eye size={11} /> View
//                                   </button>
//                                   <a href={resource.url} download={resource.name}
//                                     className="inline-flex items-center gap-1 text-green-700 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
//                                     <Download size={11} /> Download
//                                   </a>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden space-y-2.5">
//                       {courseResources.map((resource, idx) => (
//                         <div key={resource.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{getFileIcon(resource.type)}</div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
//                               <p className="text-xs text-gray-400 mt-0.5">{resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}</p>
//                               <div className="flex gap-2 mt-2.5">
//                                 <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                   className="cursor-pointer text-xs text-indigo-600 font-medium px-2.5 py-1.5 bg-indigo-50 rounded-lg">View</button>
//                                 <a href={resource.url} download={resource.name}
//                                   className="text-xs text-green-700 font-medium px-2.5 py-1.5 bg-green-50 rounded-lg">Download</a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex flex-wrap gap-3 pt-2">
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Bulk download will be available in a future update.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//                         <Archive className="w-4 h-4" /> Download All as ZIP
//                       </button>
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Print resources feature coming soon.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
//                         <Printer className="w-4 h-4" /> Print All
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
//                     <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
//                     <h4 className="font-semibold text-gray-700 mb-1">No Resources Yet</h4>
//                     <p className="text-sm text-gray-400">The instructor hasn't added any downloadable resources yet.</p>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="bg-white border-t border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-3 flex-col md:flex-row">
//             <button
//               onClick={goToPreviousLesson}
//               disabled={currentModule === 0 && currentLesson === 0}
//               className="cursor-pointer px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition disabled:opacity-40 font-semibold text-sm"
//             >
//               ← Previous Lesson
//             </button>
//             <button
//               onClick={goToNextLesson}
//               disabled={
//                 currentModule === curriculumData.length - 1 &&
//                 currentLesson === curriculumData[currentModule]?.lessons.length - 1
//               }
//               className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 font-semibold text-sm"
//             >
//               Next Lesson →
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }
































// 'use client'
// // /src/components/courses/course-learning.tsx
// //
// // Key corrections vs previous version:
// // ─ lesson_type (not content_type) determines the lesson medium
// //   Values: 'video'|'text'|'document'|'quiz'|'assignment'|
// //           'live_session'|'audio'|'interactive'|'code'|'discussion'
// // ─ content_type is 'free'|'premium'|'trial' — access control only
// // ─ content_html is the real WYSIWYG field name
// // ─ Video viewport only renders when lesson has a real video_url
// // ─ All lesson types get appropriate content displays
// // ─ Module learning_objectives and key_concepts displayed
// // ─ audio lessons get audio player
// // ─ recommended_readings displayed for text/document lessons

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import {
//   ChevronDown, ChevronUp, Bookmark, CheckCircle2, BookOpen,
//   Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
//   LayoutDashboard, Menu, X, Clock, FileText, Video, Download,
//   Eye, Archive, Printer, ExternalLink, BookMarked, AlignLeft,
//   GraduationCap, Lightbulb, Hash, Music, Code2, MessageSquare,
//   Calendar, Puzzle, ClipboardList, ChevronRight,
// } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import FileViewer from '@/components/courses/file-viewer'

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const formatFileSize = (bytes: number | null): string => {
//   if (!bytes) return 'Unknown size'
//   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   if (bytes === 0) return '0 Bytes'
//   const i = Math.floor(Math.log(bytes) / Math.log(1024))
//   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
// }

// const getFileIcon = (type: string) => {
//   const t = type.toLowerCase()
//   if (t.includes('pdf'))    return '📄'
//   if (t.includes('word') || t.includes('doc'))  return '📝'
//   if (t.includes('excel') || t.includes('sheet') || t.includes('csv')) return '📊'
//   if (t.includes('powerpoint') || t.includes('presentation')) return '📈'
//   if (t.includes('image'))  return '🖼️'
//   if (t.includes('video'))  return '🎬'
//   if (t.includes('audio'))  return '🎵'
//   if (t.includes('zip') || t.includes('archive') || t.includes('rar')) return '🗜️'
//   if (t.includes('code') || t.includes('json') || t.includes('xml'))   return '💻'
//   return '📁'
// }

// const hasHtmlContent = (html: string | null | undefined): boolean => {
//   if (!html) return false
//   return html.replace(/<[^>]*>/g, '').trim().length > 0
// }

// // Approximate read time in minutes
// const readTimeMinutes = (html: string | null | undefined): number => {
//   if (!html) return 1
//   const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
//   return Math.max(1, Math.ceil(words / 200))
// }

// // ─── Types ────────────────────────────────────────────────────────────────────
// // These match exactly what learn-page.tsx pushes into curriculumData

// type LessonType =
//   | 'video' | 'text' | 'document' | 'quiz' | 'assignment'
//   | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion'

// interface Lesson {
//   id:           string
//   title:        string
//   description?: string | null
//   lessonType:   LessonType   // the actual medium — THIS is what we branch on
//   contentType:  string       // 'free'|'premium'|'trial' — access control only
//   difficulty?:  string | null
//   // ── Rich text body ────────────────────────────────────────────────────
//   contentHtml?: string | null
//   // ── Video ─────────────────────────────────────────────────────────────
//   videoUrl?:       string | null
//   videoDuration?:  number
//   videoThumbnail?: string | null
//   // ── Audio ─────────────────────────────────────────────────────────────
//   audioUrl?:      string | null
//   audioDuration?: number
//   // ── Document ──────────────────────────────────────────────────────────
//   documentUrl?:  string | null
//   documentType?: string | null
//   documentSize?: number | null
//   // ── Supplementary ─────────────────────────────────────────────────────
//   externalLinks?:            any
//   downloadableResources?:    string[]
//   attachedFiles?:            string[]
//   recommendedReadings?:      string[]
//   hasDownloadableResources?: boolean
//   // ── Display ───────────────────────────────────────────────────────────
//   duration:  number
//   order:     number
//   isPreview: boolean
//   // ── Progress (merged in by getCurrentLessonData) ───────────────────────
//   watched?:    number
//   completed?:  boolean
// }

// interface Module {
//   id:                 string
//   title:              string
//   description?:       string | null
//   order:              number
//   learningObjectives: string[]
//   keyConcepts:        string[]
//   lessons:            Lesson[]
// }

// interface UserProgress {
//   [lessonId: string]: {
//     completed:      boolean
//     progress:       number
//     timeSpent:      number
//     lastPosition:   number
//     lastAccessedAt: string | null
//   }
// }

// interface CourseResource {
//   id:           string
//   name:         string
//   url:          string
//   type:         string
//   size:         number | null
//   lessonTitle:  string
//   moduleTitle:  string
//   isPdf?:       boolean
// }

// interface CourseLearningProps {
//   courseId:             string
//   courseData:           any
//   curriculumData:       Module[]
//   enrollmentData?:      any
//   userId:               string
//   initialUserProgress?: UserProgress
//   courseResources?:     CourseResource[]
// }

// // ─── Lesson type metadata ────────────────────────────────────────────────────

// const LESSON_TYPE_META: Record<LessonType, { label: string; color: string; bgColor: string; Icon: any }> = {
//   video:        { label: 'Video Lesson',       color: 'text-blue-600',   bgColor: 'bg-blue-50',   Icon: Video },
//   audio:        { label: 'Audio Lesson',        color: 'text-violet-600', bgColor: 'bg-violet-50', Icon: Music },
//   text:         { label: 'Reading',             color: 'text-indigo-600', bgColor: 'bg-indigo-50', Icon: BookMarked },
//   document:     { label: 'Document',            color: 'text-amber-600',  bgColor: 'bg-amber-50',  Icon: FileText },
//   quiz:         { label: 'Quiz',                color: 'text-orange-600', bgColor: 'bg-orange-50', Icon: ClipboardList },
//   assignment:   { label: 'Assignment',          color: 'text-rose-600',   bgColor: 'bg-rose-50',   Icon: ClipboardList },
//   live_session: { label: 'Live Session',        color: 'text-green-600',  bgColor: 'bg-green-50',  Icon: Calendar },
//   interactive:  { label: 'Interactive Lesson',  color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   Icon: Puzzle },
//   code:         { label: 'Code Exercise',       color: 'text-slate-600',  bgColor: 'bg-slate-50',  Icon: Code2 },
//   discussion:   { label: 'Discussion',          color: 'text-teal-600',   bgColor: 'bg-teal-50',   Icon: MessageSquare },
// }

// // ─── LessonContent ────────────────────────────────────────────────────────────
// // Renders the body for non-video lessons (text, document, audio, code, etc.)

// interface LessonContentProps {
//   lesson:          Lesson
//   module:          Module
//   courseResources: CourseResource[]
//   onViewFile:      (resource: CourseResource, index: number) => void
// }

// function LessonContent({ lesson, module, courseResources, onViewFile }: LessonContentProps) {
//   const meta         = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//   const hasContent   = hasHtmlContent(lesson.contentHtml)
//   const hasDocument  = Boolean(lesson.documentUrl)
//   const hasExtLinks  = Array.isArray(lesson.externalLinks) && lesson.externalLinks.length > 0
//   const hasReadings  = Array.isArray(lesson.recommendedReadings) && lesson.recommendedReadings.length > 0
//   const lessonFiles  = courseResources.filter(r => r.lessonTitle === lesson.title)
//   const hasFiles     = lessonFiles.length > 0
//   const hasModuleObjectives = module.learningObjectives?.length > 0
//   const hasModuleKeyConcepts = module.keyConcepts?.length > 0

//   const nothing = !hasContent && !hasDocument && !hasExtLinks && !hasReadings && !hasFiles

//   if (nothing) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className={`w-16 h-16 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-4`}>
//           <meta.Icon className={`w-8 h-8 ${meta.color}`} />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-1">No content yet</h3>
//         <p className="text-sm text-gray-400 max-w-sm">
//           The instructor hasn't added content for this lesson. Check back later or explore the Resources tab.
//         </p>
//       </div>
//     )
//   }

//   return (
//     <div className="space-y-10">

//       {/* ── RICH HTML BODY (content_html) ────────────────────────────────── */}
//       {hasContent && (
//         <section>
//           {/* Scoped styles — no @tailwindcss/typography plugin needed */}
//           <style>{`
//             .lesson-body { color: #374151; font-size: 15px; line-height: 1.8; }

//             /* Paragraphs — clear vertical rhythm */
//             .lesson-body p {
//               margin-top: 0;
//               margin-bottom: 1.35em;
//               line-height: 1.8;
//             }
//             .lesson-body p:last-child { margin-bottom: 0; }

//             /* Headings */
//             .lesson-body h1, .lesson-body h2, .lesson-body h3,
//             .lesson-body h4, .lesson-body h5, .lesson-body h6 {
//               font-weight: 700;
//               color: #111827;
//               letter-spacing: -0.02em;
//               line-height: 1.3;
//               margin-top: 2em;
//               margin-bottom: 0.6em;
//             }
//             .lesson-body h1 { font-size: 1.75rem; }
//             .lesson-body h2 { font-size: 1.4rem; border-bottom: 2px solid #f3f4f6; padding-bottom: 0.4em; }
//             .lesson-body h3 { font-size: 1.15rem; color: #1f2937; }
//             .lesson-body h4 { font-size: 1rem; color: #374151; }
//             .lesson-body h1:first-child, .lesson-body h2:first-child,
//             .lesson-body h3:first-child { margin-top: 0; }

//             /* Lists */
//             .lesson-body ul, .lesson-body ol {
//               padding-left: 1.6em;
//               margin-bottom: 1.35em;
//             }
//             .lesson-body ul { list-style-type: disc; }
//             .lesson-body ol { list-style-type: decimal; }
//             .lesson-body li {
//               margin-bottom: 0.45em;
//               line-height: 1.75;
//               color: #374151;
//             }
//             .lesson-body li > p { margin-bottom: 0.4em; }
//             .lesson-body ul ul, .lesson-body ol ol,
//             .lesson-body ul ol, .lesson-body ol ul {
//               margin-top: 0.4em;
//               margin-bottom: 0.4em;
//             }

//             /* Inline code */
//             .lesson-body code {
//               background: #f3f4f6;
//               color: #e11d48;
//               font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
//               font-size: 0.875em;
//               padding: 0.15em 0.45em;
//               border-radius: 5px;
//               border: 1px solid #e5e7eb;
//             }
//             .lesson-body code::before, .lesson-body code::after { content: none; }

//             /* Code blocks */
//             .lesson-body pre {
//               background: #1e293b;
//               color: #e2e8f0;
//               font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, monospace;
//               font-size: 0.875em;
//               line-height: 1.65;
//               padding: 1.25em 1.5em;
//               border-radius: 12px;
//               overflow-x: auto;
//               margin-bottom: 1.5em;
//               border: 1px solid #334155;
//             }
//             .lesson-body pre code {
//               background: none;
//               color: inherit;
//               padding: 0;
//               border: none;
//               border-radius: 0;
//               font-size: 1em;
//             }

//             /* Blockquote */
//             .lesson-body blockquote {
//               border-left: 4px solid #6366f1;
//               background: #eef2ff;
//               margin: 1.5em 0;
//               padding: 1em 1.25em;
//               border-radius: 0 10px 10px 0;
//               color: #4338ca;
//               font-style: normal;
//             }
//             .lesson-body blockquote p { margin-bottom: 0; color: #4338ca; }

//             /* Links */
//             .lesson-body a {
//               color: #4f46e5;
//               font-weight: 500;
//               text-decoration: none;
//               border-bottom: 1px solid #c7d2fe;
//               transition: color 0.15s, border-color 0.15s;
//             }
//             .lesson-body a:hover {
//               color: #3730a3;
//               border-bottom-color: #6366f1;
//             }

//             /* Bold / italic */
//             .lesson-body strong, .lesson-body b { font-weight: 700; color: #111827; }
//             .lesson-body em, .lesson-body i { font-style: italic; }
//             .lesson-body u { text-decoration: underline; text-underline-offset: 3px; }
//             .lesson-body s, .lesson-body del { text-decoration: line-through; color: #9ca3af; }
//             .lesson-body mark { background: #fef9c3; padding: 0.1em 0.25em; border-radius: 3px; }

//             /* Horizontal rule */
//             .lesson-body hr {
//               border: none;
//               border-top: 2px solid #f3f4f6;
//               margin: 2em 0;
//             }

//             /* Images */
//             .lesson-body img {
//               max-width: 100%;
//               height: auto;
//               border-radius: 10px;
//               box-shadow: 0 4px 16px rgba(0,0,0,0.08);
//               margin: 1.25em auto;
//               display: block;
//             }

//             /* Tables */
//             .lesson-body table {
//               width: 100%;
//               border-collapse: collapse;
//               font-size: 0.9em;
//               margin-bottom: 1.5em;
//               border-radius: 10px;
//               overflow: hidden;
//               border: 1px solid #e5e7eb;
//             }
//             .lesson-body thead { background: #f9fafb; }
//             .lesson-body th {
//               padding: 0.65em 1em;
//               text-align: left;
//               font-weight: 600;
//               color: #374151;
//               font-size: 0.8em;
//               text-transform: uppercase;
//               letter-spacing: 0.05em;
//               border-bottom: 2px solid #e5e7eb;
//             }
//             .lesson-body td {
//               padding: 0.6em 1em;
//               color: #374151;
//               border-bottom: 1px solid #f3f4f6;
//               vertical-align: top;
//             }
//             .lesson-body tbody tr:last-child td { border-bottom: none; }
//             .lesson-body tbody tr:hover { background: #f9fafb; }

//             /* Callout divs sometimes output by WYSIWYG */
//             .lesson-body .callout, .lesson-body .note, .lesson-body .tip, .lesson-body .warning {
//               padding: 1em 1.25em;
//               border-radius: 10px;
//               margin-bottom: 1.25em;
//             }

//             /* Video/iframe embeds */
//             .lesson-body iframe {
//               width: 100%;
//               border-radius: 10px;
//               margin: 1.25em 0;
//               border: none;
//             }
//           `}</style>

//           <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//             <AlignLeft className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Lesson Content</span>
//             <span className="ml-auto text-xs text-gray-400">~{readTimeMinutes(lesson.contentHtml)} min read</span>
//           </div>

//           <div
//             className="lesson-body"
//             dangerouslySetInnerHTML={{ __html: lesson.contentHtml! }}
//           />
//         </section>
//       )}

//       {/* ── DOCUMENT ATTACHMENT (document_url) ───────────────────────────── */}
//       {hasDocument && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">Attached Document</span>
//             {lesson.documentSize && (
//               <span className="ml-auto text-xs text-gray-400">{formatFileSize(lesson.documentSize)}</span>
//             )}
//           </div>
//           <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
//             <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
//               {lesson.documentType?.toLowerCase().includes('pdf') ? '📄' : '📎'}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-900 truncate">{lesson.title}</p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {lesson.documentType || 'Document'}
//                 {lesson.documentSize ? ` • ${formatFileSize(lesson.documentSize)}` : ''}
//               </p>
//             </div>
//             <div className="flex gap-2 flex-shrink-0">
//               <a
//                 href={lesson.documentUrl!}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 text-amber-700 hover:text-amber-900 font-medium text-sm px-3 py-1.5 bg-white border border-amber-200 hover:bg-amber-100 rounded-lg transition-colors"
//               >
//                 <Eye className="w-3.5 h-3.5" /> View
//               </a>
//               <a
//                 href={lesson.documentUrl!}
//                 download
//                 className="inline-flex items-center gap-1.5 text-green-700 hover:text-green-900 font-medium text-sm px-3 py-1.5 bg-white border border-green-200 hover:bg-green-100 rounded-lg transition-colors"
//               >
//                 <Download className="w-3.5 h-3.5" /> Download
//               </a>
//             </div>
//           </div>
//         </section>
//       )}

//       {/* ── LESSON FILES (from courseResources, filtered by lessonTitle) ──── */}
//       {hasFiles && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Archive className="w-4 h-4 text-violet-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Lesson Files</span>
//             <span className="ml-auto text-xs text-gray-400">
//               {lessonFiles.length} file{lessonFiles.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="grid gap-2.5">
//             {lessonFiles.map((resource) => {
//               const globalIdx = courseResources.findIndex(r => r.id === resource.id)
//               return (
//                 <div
//                   key={resource.id}
//                   className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all"
//                 >
//                   <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base shadow-sm">
//                     {getFileIcon(resource.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 text-sm truncate">{resource.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}
//                     </p>
//                   </div>
//                   <div className="flex gap-1.5 flex-shrink-0">
//                     <button
//                       onClick={() => onViewFile(resource, globalIdx)}
//                       className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
//                     >
//                       <Eye className="w-3 h-3" /> View
//                     </button>
//                     <a
//                       href={resource.url}
//                       download={resource.name}
//                       className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
//                     >
//                       <Download className="w-3 h-3" /> Save
//                     </a>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </section>
//       )}

//       {/* ── RECOMMENDED READINGS (recommended_readings string[]) ─────────── */}
//       {hasReadings && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
//               Recommended Readings
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {lesson.recommendedReadings!.map((reading, i) => (
//               <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                 <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
//                 </div>
//                 <span className="text-sm text-gray-700 leading-relaxed">{reading}</span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* ── EXTERNAL LINKS (external_links JSONB) ────────────────────────── */}
//       {hasExtLinks && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <ExternalLink className="w-4 h-4 text-sky-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
//               References & Links
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {(lesson.externalLinks as any[]).map((link: any, i: number) => {
//               const href  = typeof link === 'string' ? link : (link.url || '#')
//               const label = typeof link === 'string' ? link : (link.name || link.title || link.url || href)
//               return (
//                 <li key={i}>
//                   <a
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-sky-50 hover:bg-sky-100 hover:border-sky-200 transition-all"
//                   >
//                     <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-100">
//                       <Hash className="w-3.5 h-3.5 text-sky-500" />
//                     </div>
//                     <span className="flex-1 text-sm text-sky-700 group-hover:text-sky-900 font-medium truncate">
//                       {label}
//                     </span>
//                     <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0" />
//                   </a>
//                 </li>
//               )
//             })}
//           </ul>
//         </section>
//       )}

//       {/* ── MODULE KEY CONCEPTS (module.keyConcepts string[]) ────────────── */}
//       {hasModuleKeyConcepts && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Key Concepts</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {module.keyConcepts.map((concept, i) => (
//               <span
//                 key={i}
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
//                 {concept}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CourseLearningPage({
//   courseId,
//   courseData,
//   curriculumData,
//   enrollmentData,
//   userId,
//   initialUserProgress = {},
//   courseResources = [],
// }: CourseLearningProps) {
//   const [currentModule, setCurrentModule]             = useState(0)
//   const [currentLesson, setCurrentLesson]             = useState(0)
//   const [expandedModules, setExpandedModules]         = useState<number[]>([0])
//   const [isPlaying, setIsPlaying]                     = useState(false)
//   const [isMuted, setIsMuted]                         = useState(false)
//   const [bookmarkedTimes, setBookmarkedTimes]         = useState<number[]>([])
//   const [activeTab, setActiveTab]                     = useState<'overview' | 'notes' | 'resources'>('overview')
//   const [notes, setNotes]                             = useState('')
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
//   const [userProgress, setUserProgress]               = useState<UserProgress>(initialUserProgress)
//   const [selectedFile, setSelectedFile]               = useState<CourseResource | null>(null)
//   const [showFileViewer, setShowFileViewer]           = useState(false)
//   const [currentFileIndex, setCurrentFileIndex]       = useState(0)
//   const [videoDuration, setVideoDuration]             = useState(0)
//   const [isSaving, setIsSaving]                       = useState(false)

//   const currentTimeRef     = useRef(0)
//   const [, forceUpdate]    = useState(0)
//   const videoRef           = useRef<HTMLVideoElement>(null)
//   const audioRef           = useRef<HTMLAudioElement>(null)
//   const lastSaveRef        = useRef(0)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const pdfResources   = courseResources.filter(r => r.type === 'PDF Document')
//   const otherResources = courseResources.filter(r => r.type !== 'PDF Document')

//   const handleNextFile = () => {
//     if (currentFileIndex < courseResources.length - 1) {
//       const n = currentFileIndex + 1
//       setSelectedFile(courseResources[n]); setCurrentFileIndex(n)
//     }
//   }
//   const handlePrevFile = () => {
//     if (currentFileIndex > 0) {
//       const p = currentFileIndex - 1
//       setSelectedFile(courseResources[p]); setCurrentFileIndex(p)
//     }
//   }

//   useEffect(() => { loadUserProgress() }, [courseId, userId])

//   const loadUserProgress = async () => {
//     try {
//       const res = await fetch(`/api/student/progress?courseId=${courseId}`)
//       if (res.ok) {
//         const data = await res.json()
//         const t: UserProgress = {}
//         if (data.progress && typeof data.progress === 'object') {
//           Object.entries(data.progress).forEach(([id, d]: [string, any]) => {
//             t[id] = {
//               completed:      d.is_completed  || d.completed  || false,
//               progress:       d.video_progress || d.progress  || 0,
//               timeSpent:      d.time_spent     || 0,
//               lastPosition:   d.last_position  || 0,
//               lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
//             }
//           })
//         }
//         setUserProgress(t)
//       } else {
//         const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//         if (saved) setUserProgress(JSON.parse(saved))
//       }
//     } catch {
//       const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//       if (saved) try { setUserProgress(JSON.parse(saved)) } catch {}
//     }
//   }

//   const saveProgressToDatabase = async (lessonId: string, data: {
//     completed?: boolean; progress?: number; timeSpent?: number; lastPosition?: number
//   }) => {
//     try {
//       setIsSaving(true)
//       const res = await fetch('/api/student/progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ courseId, lessonId, userId, ...data }),
//       })
//       if (!res.ok) throw new Error('Failed to save')
//       return await res.json()
//     } catch {
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(userProgress).length > 0 && userId)
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//   }, [userProgress, courseId, userId])

//   // Auto-save video/audio progress
//   useEffect(() => {
//     const autoSave = async () => {
//       const lesson = getCurrentLessonData()
//       if (!lesson) return
//       const now = Date.now()
//       const currentTime = currentTimeRef.current
//       if (now - lastSaveRef.current > 30000 && currentTime > 10) {
//         const pct = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0
//         await saveProgressToDatabase(lesson.id, {
//           progress: pct, timeSpent: Math.floor(currentTime), lastPosition: Math.floor(currentTime),
//         })
//         lastSaveRef.current = now
//       }
//     }
//     const id = setInterval(autoSave, 10000)
//     return () => clearInterval(id)
//   }, [courseId, videoDuration])

//   const calculateOverallProgress = () => {
//     let total = 0, done = 0
//     curriculumData.forEach(m => m.lessons.forEach(l => {
//       total++
//       if (userProgress[l.id]?.completed) done++
//     }))
//     return total > 0 ? Math.round((done / total) * 100) : 0
//   }

//   const calculateModuleProgress = (module: Module) => {
//     if (!module.lessons.length) return 0
//     const done = module.lessons.filter(l => userProgress[l.id]?.completed).length
//     return Math.round((done / module.lessons.length) * 100)
//   }

//   const completeLesson = async (lessonId?: string) => {
//     const id = lessonId || getCurrentLessonData()?.id
//     if (!id) return
//     setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
//     await saveProgressToDatabase(id, { completed: true, progress: 100 })
//   }

//   const goToNextLesson = () => {
//     const lesson = getCurrentLessonData()
//     if (lesson && !userProgress[lesson.id]?.completed) completeLesson()
//     if (currentLesson < curriculumData[currentModule].lessons.length - 1)
//       selectLesson(currentModule, currentLesson + 1)
//     else if (currentModule < curriculumData.length - 1)
//       selectLesson(currentModule + 1, 0)
//   }

//   const goToPreviousLesson = () => {
//     if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
//     else if (currentModule > 0)
//       selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
//   }

//   const toggleModule = (i: number) =>
//     setExpandedModules(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

//   const selectLesson = async (modIdx: number, lesIdx: number) => {
//     setCurrentModule(modIdx); setCurrentLesson(lesIdx)
//     currentTimeRef.current = 0
//     setIsPlaying(false); setIsMobileSidebarOpen(false)
//     setTimeout(() => {
//       if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
//       if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.pause() }
//       forceUpdate(x => x + 1)
//     }, 100)
//     const lesson = curriculumData[modIdx]?.lessons[lesIdx]
//     if (lesson && !userProgress[lesson.id]?.completed) {
//       setUserProgress(prev => ({
//         ...prev,
//         [lesson.id]: { ...prev[lesson.id], completed: prev[lesson.id]?.completed || false,
//           progress: prev[lesson.id]?.progress || 0, timeSpent: prev[lesson.id]?.timeSpent || 0,
//           lastPosition: 0, lastAccessedAt: new Date().toISOString() },
//       }))
//       saveProgressToDatabase(lesson.id, { progress: 0, timeSpent: 0, lastPosition: 0 }).catch(() => {})
//     }
//   }

//   const formatTime = (s: number) =>
//     !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

//   const getCurrentLessonData = (): Lesson | null => {
//     const l = curriculumData[currentModule]?.lessons[currentLesson]
//     if (!l) return null
//     const p = userProgress[l.id] || {}
//     return { ...l, watched: p.timeSpent || 0, completed: p.completed || false }
//   }

//   const currentLessonData    = getCurrentLessonData()
//   const currentModuleData    = curriculumData[currentModule]
//   const overallProgress      = calculateOverallProgress()

//   // ── Determine what to show ──────────────────────────────────────────────
//   // We branch exclusively on lesson_type (the real medium field).
//   // video_url being present is the secondary check for video lessons
//   // (in case lesson_type is incorrectly set but url exists).
//   const lt = currentLessonData?.lessonType
//   const isVideoLesson = (lt === 'video') && Boolean(currentLessonData?.videoUrl)
//   const isAudioLesson = (lt === 'audio') && Boolean(currentLessonData?.audioUrl)
//   // All others render text/document content layout
//   const hasMediaPlayer = isVideoLesson || isAudioLesson

//   const lessonMeta = lt ? (LESSON_TYPE_META[lt] ?? LESSON_TYPE_META.text) : LESSON_TYPE_META.text

//   // ── Per-lesson sidebar icon (uses lesson's own lessonType/urls) ─────────
//   const getLessonIcon = (lesson: Lesson, completed?: boolean) => {
//     if (completed) return <CheckCircle2 size={15} className="flex-shrink-0 text-green-500" />
//     const meta = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//     return <meta.Icon size={14} className={`flex-shrink-0 ${meta.color}`} />
//   }

//   useEffect(() => () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }, [])

//   if (!currentLessonData) {
//     return (
//       <div className="flex-1 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
//           <p className="mt-4 text-gray-500 text-sm">Loading lesson…</p>
//         </div>
//       </div>
//     )
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // Sub-components
//   // ─────────────────────────────────────────────────────────────────────────

//   const AxioQuanLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
//     <a href="/" className={`flex items-center gap-2.5 ${size === 'small' ? 'px-1' : 'px-2'}`}>
//       <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
//         <span className="text-white font-bold text-sm">A</span>
//       </div>
//       {size === 'default' && <span className="font-bold text-lg text-foreground">AxioQuan</span>}
//     </a>
//   )

//   const CurriculumList = () => (
//     <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
//       {curriculumData.map((module, modIdx) => {
//         const modProgress = calculateModuleProgress(module)
//         return (
//           <div key={module.id}>
//             <button
//               onClick={() => toggleModule(modIdx)}
//               className="cursor-pointer w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
//             >
//               <div className="flex items-center gap-2.5 flex-1 min-w-0">
//                 <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
//                   <BookOpen size={13} className="text-gray-500" />
//                 </div>
//                 <div className="text-left min-w-0">
//                   <p className="font-semibold text-sm text-foreground truncate">{module.title}</p>
//                   <p className="text-xs text-muted-foreground">{modProgress}% complete</p>
//                 </div>
//               </div>
//               {expandedModules.includes(modIdx)
//                 ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
//                 : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
//             </button>

//             {expandedModules.includes(modIdx) && (
//               <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
//                 {module.lessons.map((lesson, lesIdx) => {
//                   const isActive    = currentModule === modIdx && currentLesson === lesIdx
//                   const isDone      = userProgress[lesson.id]?.completed
//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(modIdx, lesIdx)}
//                       className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
//                         isActive
//                           ? 'bg-primary text-primary-foreground'
//                           : 'hover:bg-gray-50 text-foreground'
//                       }`}
//                     >
//                       <span className="flex-shrink-0">{getLessonIcon(lesson, isDone)}</span>
//                       <span className="flex-1 text-left text-xs leading-snug line-clamp-2">{lesson.title}</span>
//                       {lesson.duration > 0 && !isDone && (
//                         <span className={`text-xs flex-shrink-0 flex items-center gap-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
//                           <Clock size={10} />{formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )

//   const MobileSidebar = () => (
//     <>
//       {isMobileSidebarOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)} />
//       )}
//       <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden shadow-2xl
//         ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <AxioQuanLogo />
//             <button onClick={() => setIsMobileSidebarOpen(false)}
//               className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <X size={18} />
//             </button>
//           </div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>
//     </>
//   )

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="flex min-h-screen bg-background">
//       <MobileSidebar />

//       {/* Desktop sidebar */}
//       <div className="hidden md:flex w-80 bg-white border-r border-border flex-col fixed left-0 top-0 bottom-0 z-30">
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="mb-3"><AxioQuanLogo /></div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>

//       {/* Main area */}
//       <div className="flex-1 md:ml-80 w-full min-h-screen flex flex-col">

//         {/* Mobile top bar */}
//         <div className="md:hidden bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <AxioQuanLogo size="small" />
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-muted-foreground truncate">{currentModuleData?.title}</p>
//               <p className="font-semibold text-sm truncate">{currentLessonData.title}</p>
//             </div>
//           </div>
//         </div>

//         {/* Floating mobile menu */}
//         <button
//           onClick={() => setIsMobileSidebarOpen(true)}
//           className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl z-40"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Course header (desktop only) */}
//         <div className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{courseData?.title || 'Course'}</h1>
//             {courseData?.short_description && (
//               <p className="text-gray-500 text-sm">{courseData.short_description}</p>
//             )}
//             <p className="text-gray-400 text-xs mt-0.5">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             VIDEO PLAYER — only when lessonType='video' AND videoUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isVideoLesson && (
//           <div className="bg-black flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 md:py-6">
//               <div className="bg-black rounded-xl overflow-hidden w-full aspect-video max-w-4xl mx-auto shadow-2xl">
//                 <video
//                   key={currentLessonData.videoUrl!}
//                   ref={videoRef}
//                   className="w-full h-full object-contain"
//                   controls
//                   playsInline
//                   poster={currentLessonData.videoThumbnail ?? undefined}
//                   onTimeUpdate={() => {
//                     if (!videoRef.current) return
//                     currentTimeRef.current = videoRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onLoadedMetadata={() => {
//                     if (videoRef.current) setVideoDuration(videoRef.current.duration)
//                   }}
//                   onEnded={() => {
//                     setIsPlaying(false)
//                     const pct = currentLessonData.duration > 0
//                       ? (currentTimeRef.current / currentLessonData.duration) * 100
//                       : 100
//                     if (pct >= 90) completeLesson()
//                   }}
//                   onPlay={() => setIsPlaying(true)}
//                   onPause={() => setIsPlaying(false)}
//                 >
//                   <source src={currentLessonData.videoUrl!} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//               {isSaving && (
//                 <p className="text-center text-xs text-gray-500 mt-2 flex items-center justify-center gap-1.5">
//                   <span className="inline-block w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
//                   Saving progress…
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             AUDIO PLAYER — lessonType='audio' AND audioUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isAudioLesson && (
//           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
//               <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
//                     <Music className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
//                       Audio Lesson
//                     </p>
//                     <h3 className="text-white font-bold text-lg leading-tight">{currentLessonData.title}</h3>
//                   </div>
//                 </div>
//                 <audio
//                   key={currentLessonData.audioUrl!}
//                   ref={audioRef}
//                   className="w-full"
//                   controls
//                   onTimeUpdate={() => {
//                     if (!audioRef.current) return
//                     currentTimeRef.current = audioRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onEnded={() => completeLesson()}
//                 >
//                   <source src={currentLessonData.audioUrl!} />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             Progress bar
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-3 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <div className="flex items-center justify-between mb-1.5">
//               <span className="text-xs font-semibold text-gray-600">Course Progress</span>
//               <span className="text-xs font-bold text-primary">{overallProgress}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2">
//               <div
//                 className="bg-primary rounded-full h-2 transition-all duration-700"
//                 style={{ width: `${overallProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Lesson header + Mark Complete
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-4 justify-between flex-col md:flex-row">
//             <div className="min-w-0">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//                 {currentModuleData?.title}
//               </p>
//               <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
//                 {currentLessonData.title}
//               </h2>
//               <div className="flex flex-wrap items-center gap-2.5">
//                 {/* Lesson type badge */}
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${lessonMeta.bgColor} ${lessonMeta.color}`}>
//                   <lessonMeta.Icon size={12} />
//                   {lessonMeta.label}
//                 </span>
//                 {currentLessonData.difficulty && (
//                   <span className="text-xs text-gray-400 capitalize">{currentLessonData.difficulty}</span>
//                 )}
//                 {currentLessonData.duration > 0 && (
//                   <span className="flex items-center gap-1 text-xs text-gray-400">
//                     <Clock size={11} />{formatTime(currentLessonData.duration)}
//                   </span>
//                 )}
//                 {isVideoLesson && (
//                   <span className="text-xs text-gray-400 flex items-center gap-1">
//                     <Video size={11} /> Video
//                   </span>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => completeLesson()}
//               disabled={userProgress[currentLessonData.id]?.completed || isSaving}
//               className={`flex-shrink-0 w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
//                 userProgress[currentLessonData.id]?.completed
//                   ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
//                   : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
//               }`}
//             >
//               {userProgress[currentLessonData.id]?.completed ? (
//                 <><CheckCircle2 size={16} />Completed</>
//               ) : isSaving ? (
//                 <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
//               ) : (
//                 'Mark Complete'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Tabs
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border flex-shrink-0 sticky top-0 z-20">
//           <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0 overflow-x-auto">
//             {(['overview', 'notes', 'resources'] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`cursor-pointer px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* File viewer modal */}
//         {showFileViewer && selectedFile && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-6xl h-[90vh]">
//               <FileViewer
//                 file={selectedFile}
//                 onClose={() => setShowFileViewer(false)}
//                 onNext={handleNextFile}
//                 onPrev={handlePrevFile}
//                 showNavigation={courseResources.length > 1}
//               />
//             </div>
//           </div>
//         )}

//         {/* ─── Tab content ────────────────────────────────────────────── */}
//         <div className="flex-1 bg-gray-50">
//           <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

//             {/* ── OVERVIEW ─────────────────────────────────────────────── */}
//             {activeTab === 'overview' && (
//               <div className="space-y-8">

//                 {/* Description */}
//                 {currentLessonData.description && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Lightbulb className="w-4 h-4 text-amber-500" />
//                       <h3 className="font-bold text-gray-900 text-sm">About this lesson</h3>
//                     </div>
//                     <p className="text-gray-600 leading-relaxed text-[15px]">
//                       {currentLessonData.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ─────────────────────────────────────────────────────
//                     VIDEO lesson → objectives + bookmarks
//                     All other lesson types → full content body
//                 ───────────────────────────────────────────────────── */}
//                 {hasMediaPlayer ? (
//                   /* ── Video/Audio: objectives + bookmarks ──────────── */
//                   <div className="space-y-6">
//                     {/* Module learning objectives */}
//                     {currentModuleData?.learningObjectives?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <GraduationCap className="w-4 h-4 text-indigo-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Learning Objectives</h3>
//                         </div>
//                         <ul className="space-y-2.5">
//                           {currentModuleData.learningObjectives.map((obj, i) => (
//                             <li key={i} className="flex items-start gap-3">
//                               <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
//                               <span className="text-gray-600 text-[15px] leading-relaxed">{obj}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Module key concepts */}
//                     {currentModuleData?.keyConcepts?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Lightbulb className="w-4 h-4 text-yellow-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Key Concepts</h3>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {currentModuleData.keyConcepts.map((concept, i) => (
//                             <span key={i}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
//                               <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{concept}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Bookmarks (only relevant for video) */}
//                     {isVideoLesson && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Bookmark className="w-4 h-4 text-blue-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Video Bookmarks</h3>
//                         </div>
//                         {bookmarkedTimes.length > 0 ? (
//                           <div className="space-y-2">
//                             {bookmarkedTimes.map((t, i) => (
//                               <button
//                                 key={i}
//                                 onClick={() => {
//                                   currentTimeRef.current = t
//                                   if (videoRef.current) videoRef.current.currentTime = t
//                                   forceUpdate(x => x + 1)
//                                 }}
//                                 className="cursor-pointer w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition flex items-center gap-3"
//                               >
//                                 <Bookmark size={13} className="text-blue-400 flex-shrink-0" />
//                                 <span className="font-mono font-semibold text-sm text-gray-800">{formatTime(t)}</span>
//                                 <span className="text-xs text-gray-400">Bookmark {i + 1}</span>
//                               </button>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-400 text-center py-3">
//                             No bookmarks yet. Use the video player to add them.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   /* ── Text/Document/Quiz/etc: full lesson content ─── */
//                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className={`px-6 py-4 border-b border-gray-50 flex items-center gap-3 ${lessonMeta.bgColor}`}>
//                       <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
//                         <lessonMeta.Icon className={`w-4 h-4 ${lessonMeta.color}`} />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 text-sm">{lessonMeta.label}</p>
//                         <p className="text-xs text-gray-500">
//                           {hasHtmlContent(currentLessonData.contentHtml)
//                             ? `~${readTimeMinutes(currentLessonData.contentHtml)} min read`
//                             : 'Study material below'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="p-6 md:p-8">
//                       <LessonContent
//                         lesson={currentLessonData}
//                         module={currentModuleData}
//                         courseResources={courseResources}
//                         onViewFile={(resource, index) => {
//                           setSelectedFile(resource)
//                           setCurrentFileIndex(index)
//                           setShowFileViewer(true)
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── NOTES ────────────────────────────────────────────────── */}
//             {activeTab === 'notes' && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
//                   <span className="text-xs text-gray-400">{notes.split(/\s+/).filter(Boolean).length} words</span>
//                 </div>
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                   <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
//                     {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, i) => (
//                       <button key={i}
//                         className="cursor-pointer p-1.5 rounded hover:bg-gray-200 transition text-gray-500 hover:text-gray-800">
//                         <Icon size={14} />
//                       </button>
//                     ))}
//                   </div>
//                   <textarea
//                     value={notes}
//                     onChange={e => setNotes(e.target.value)}
//                     placeholder={"Start typing your notes…\n\nWrite down key concepts, questions, or insights."}
//                     className="w-full min-h-[400px] p-5 bg-white text-gray-800 placeholder-gray-300 focus:outline-none text-[15px] leading-relaxed resize-y font-sans"
//                   />
//                   <div className="px-5 py-2 border-t border-gray-50 flex justify-between text-xs text-gray-400">
//                     <span>Notes are saved locally</span>
//                     <span>{notes.length} chars</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── RESOURCES ────────────────────────────────────────────── */}
//             {activeTab === 'resources' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-bold text-foreground">Course Resources</h3>

//                 {courseResources.length > 0 ? (
//                   <>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {[
//                         { label: 'Total Files',   value: courseResources.length, bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-500' },
//                         { label: 'PDFs',          value: pdfResources.length,    bg: 'bg-green-50',  text: 'text-green-700',  sub: 'text-green-500' },
//                         { label: 'Other',         value: otherResources.length,  bg: 'bg-violet-50', text: 'text-violet-700', sub: 'text-violet-500' },
//                         { label: 'Modules',       value: new Set(courseResources.map(r => r.moduleTitle)).size, bg: 'bg-amber-50', text: 'text-amber-700', sub: 'text-amber-500' },
//                       ].map(s => (
//                         <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
//                           <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
//                           <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Desktop table */}
//                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hidden md:block overflow-hidden">
//                       <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
//                         <span className="font-semibold text-sm text-gray-900">All Resources</span>
//                         <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                           {courseResources.length} files
//                         </span>
//                       </div>
//                       <table className="w-full">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             {['File', 'Type', 'Source', 'Size', 'Actions'].map(h => (
//                               <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                           {courseResources.map((resource, idx) => (
//                             <tr key={resource.id} className="hover:bg-gray-50/60 transition-colors">
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2.5">
//                                   <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">{getFileIcon(resource.type)}</div>
//                                   <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{resource.name}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resource.type}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <p className="text-sm text-gray-600 truncate max-w-[160px]">{resource.lessonTitle}</p>
//                                 <p className="text-xs text-gray-400">{resource.moduleTitle}</p>
//                               </td>
//                               <td className="py-3 px-4 text-sm text-gray-500">
//                                 {resource.size ? formatFileSize(resource.size) : '—'}
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex gap-1.5">
//                                   <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                     className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
//                                     <Eye size={11} /> View
//                                   </button>
//                                   <a href={resource.url} download={resource.name}
//                                     className="inline-flex items-center gap-1 text-green-700 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
//                                     <Download size={11} /> Download
//                                   </a>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden space-y-2.5">
//                       {courseResources.map((resource, idx) => (
//                         <div key={resource.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{getFileIcon(resource.type)}</div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
//                               <p className="text-xs text-gray-400 mt-0.5">{resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}</p>
//                               <div className="flex gap-2 mt-2.5">
//                                 <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                   className="cursor-pointer text-xs text-indigo-600 font-medium px-2.5 py-1.5 bg-indigo-50 rounded-lg">View</button>
//                                 <a href={resource.url} download={resource.name}
//                                   className="text-xs text-green-700 font-medium px-2.5 py-1.5 bg-green-50 rounded-lg">Download</a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex flex-wrap gap-3 pt-2">
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Bulk download will be available in a future update.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//                         <Archive className="w-4 h-4" /> Download All as ZIP
//                       </button>
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Print resources feature coming soon.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
//                         <Printer className="w-4 h-4" /> Print All
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
//                     <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
//                     <h4 className="font-semibold text-gray-700 mb-1">No Resources Yet</h4>
//                     <p className="text-sm text-gray-400">The instructor hasn't added any downloadable resources yet.</p>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="bg-white border-t border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-3 flex-col md:flex-row">
//             <button
//               onClick={goToPreviousLesson}
//               disabled={currentModule === 0 && currentLesson === 0}
//               className="cursor-pointer px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition disabled:opacity-40 font-semibold text-sm"
//             >
//               ← Previous Lesson
//             </button>
//             <button
//               onClick={goToNextLesson}
//               disabled={
//                 currentModule === curriculumData.length - 1 &&
//                 currentLesson === curriculumData[currentModule]?.lessons.length - 1
//               }
//               className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 font-semibold text-sm"
//             >
//               Next Lesson →
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }








































// 'use client'
// // /src/components/courses/course-learning.tsx
// //
// // Key corrections vs previous version:
// // ─ lesson_type (not content_type) determines the lesson medium
// //   Values: 'video'|'text'|'document'|'quiz'|'assignment'|
// //           'live_session'|'audio'|'interactive'|'code'|'discussion'
// // ─ content_type is 'free'|'premium'|'trial' — access control only
// // ─ content_html is the real WYSIWYG field name
// // ─ Video viewport only renders when lesson has a real video_url
// // ─ All lesson types get appropriate content displays
// // ─ Module learning_objectives and key_concepts displayed
// // ─ audio lessons get audio player
// // ─ recommended_readings displayed for text/document lessons

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import {
//   ChevronDown, ChevronUp, Bookmark, CheckCircle2, BookOpen,
//   Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
//   LayoutDashboard, Menu, X, Clock, FileText, Video, Download,
//   Eye, Archive, Printer, ExternalLink, BookMarked, AlignLeft,
//   GraduationCap, Lightbulb, Hash, Music, Code2, MessageSquare,
//   Calendar, Puzzle, ClipboardList, ChevronRight,
// } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import FileViewer from '@/components/courses/file-viewer'

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const formatFileSize = (bytes: number | null): string => {
//   if (!bytes) return 'Unknown size'
//   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   if (bytes === 0) return '0 Bytes'
//   const i = Math.floor(Math.log(bytes) / Math.log(1024))
//   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
// }

// const getFileIcon = (type: string) => {
//   const t = type.toLowerCase()
//   if (t.includes('pdf'))    return '📄'
//   if (t.includes('word') || t.includes('doc'))  return '📝'
//   if (t.includes('excel') || t.includes('sheet') || t.includes('csv')) return '📊'
//   if (t.includes('powerpoint') || t.includes('presentation')) return '📈'
//   if (t.includes('image'))  return '🖼️'
//   if (t.includes('video'))  return '🎬'
//   if (t.includes('audio'))  return '🎵'
//   if (t.includes('zip') || t.includes('archive') || t.includes('rar')) return '🗜️'
//   if (t.includes('code') || t.includes('json') || t.includes('xml'))   return '💻'
//   return '📁'
// }

// const hasHtmlContent = (html: string | null | undefined): boolean => {
//   if (!html) return false
//   return html.replace(/<[^>]*>/g, '').trim().length > 0
// }

// // Approximate read time in minutes
// const readTimeMinutes = (html: string | null | undefined): number => {
//   if (!html) return 1
//   const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
//   return Math.max(1, Math.ceil(words / 200))
// }

// // ─── Types ────────────────────────────────────────────────────────────────────
// // These match exactly what learn-page.tsx pushes into curriculumData

// type LessonType =
//   | 'video' | 'text' | 'document' | 'quiz' | 'assignment'
//   | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion'

// interface Lesson {
//   id:           string
//   title:        string
//   description?: string | null
//   lessonType:   LessonType   // the actual medium — THIS is what we branch on
//   contentType:  string       // 'free'|'premium'|'trial' — access control only
//   difficulty?:  string | null
//   // ── Rich text body ────────────────────────────────────────────────────
//   contentHtml?: string | null
//   // ── Video ─────────────────────────────────────────────────────────────
//   videoUrl?:       string | null
//   videoDuration?:  number
//   videoThumbnail?: string | null
//   // ── Audio ─────────────────────────────────────────────────────────────
//   audioUrl?:      string | null
//   audioDuration?: number
//   // ── Document ──────────────────────────────────────────────────────────
//   documentUrl?:  string | null
//   documentType?: string | null
//   documentSize?: number | null
//   // ── Supplementary ─────────────────────────────────────────────────────
//   externalLinks?:            any
//   downloadableResources?:    string[]
//   attachedFiles?:            string[]
//   recommendedReadings?:      string[]
//   hasDownloadableResources?: boolean
//   // ── Display ───────────────────────────────────────────────────────────
//   duration:  number
//   order:     number
//   isPreview: boolean
//   // ── Progress (merged in by getCurrentLessonData) ───────────────────────
//   watched?:    number
//   completed?:  boolean
// }

// interface Module {
//   id:                 string
//   title:              string
//   description?:       string | null
//   order:              number
//   learningObjectives: string[]
//   keyConcepts:        string[]
//   lessons:            Lesson[]
// }

// interface UserProgress {
//   [lessonId: string]: {
//     completed:      boolean
//     progress:       number
//     timeSpent:      number
//     lastPosition:   number
//     lastAccessedAt: string | null
//   }
// }

// interface CourseResource {
//   id:           string
//   name:         string
//   url:          string
//   type:         string
//   size:         number | null
//   lessonTitle:  string
//   moduleTitle:  string
//   isPdf?:       boolean
// }

// interface CourseLearningProps {
//   courseId:             string
//   courseData:           any
//   curriculumData:       Module[]
//   enrollmentData?:      any
//   userId:               string
//   initialUserProgress?: UserProgress
//   courseResources?:     CourseResource[]
// }

// // ─── Lesson type metadata ────────────────────────────────────────────────────

// const LESSON_TYPE_META: Record<LessonType, { label: string; color: string; bgColor: string; Icon: any }> = {
//   video:        { label: 'Video Lesson',       color: 'text-blue-600',   bgColor: 'bg-blue-50',   Icon: Video },
//   audio:        { label: 'Audio Lesson',        color: 'text-violet-600', bgColor: 'bg-violet-50', Icon: Music },
//   text:         { label: 'Reading',             color: 'text-indigo-600', bgColor: 'bg-indigo-50', Icon: BookMarked },
//   document:     { label: 'Document',            color: 'text-amber-600',  bgColor: 'bg-amber-50',  Icon: FileText },
//   quiz:         { label: 'Quiz',                color: 'text-orange-600', bgColor: 'bg-orange-50', Icon: ClipboardList },
//   assignment:   { label: 'Assignment',          color: 'text-rose-600',   bgColor: 'bg-rose-50',   Icon: ClipboardList },
//   live_session: { label: 'Live Session',        color: 'text-green-600',  bgColor: 'bg-green-50',  Icon: Calendar },
//   interactive:  { label: 'Interactive Lesson',  color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   Icon: Puzzle },
//   code:         { label: 'Code Exercise',       color: 'text-slate-600',  bgColor: 'bg-slate-50',  Icon: Code2 },
//   discussion:   { label: 'Discussion',          color: 'text-teal-600',   bgColor: 'bg-teal-50',   Icon: MessageSquare },
// }

// // ─── LessonContent ────────────────────────────────────────────────────────────
// // Renders the body for non-video lessons (text, document, audio, code, etc.)

// interface LessonContentProps {
//   lesson:          Lesson
//   module:          Module
//   courseResources: CourseResource[]
//   onViewFile:      (resource: CourseResource, index: number) => void
// }

// function LessonContent({ lesson, module, courseResources, onViewFile }: LessonContentProps) {
//   const meta         = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//   const hasContent   = hasHtmlContent(lesson.contentHtml)
//   const hasDocument  = Boolean(lesson.documentUrl)
//   const hasExtLinks  = Array.isArray(lesson.externalLinks) && lesson.externalLinks.length > 0
//   const hasReadings  = Array.isArray(lesson.recommendedReadings) && lesson.recommendedReadings.length > 0
//   const lessonFiles  = courseResources.filter(r => r.lessonTitle === lesson.title)
//   const hasFiles     = lessonFiles.length > 0
//   const hasModuleObjectives = module.learningObjectives?.length > 0
//   const hasModuleKeyConcepts = module.keyConcepts?.length > 0
//   const [docExpanded, setDocExpanded] = useState(true)

//   // Inject CSS into <head> once — guarantees styles survive SSR/hydration
//   useEffect(() => {
//     const id = 'axioquan-lesson-body-styles'
//     if (document.getElementById(id)) return
//     const tag = document.createElement('style')
//     tag.id = id
//     tag.textContent = `
//       .lesson-body{color:#374151;font-size:15px;line-height:1.8;word-break:break-word}
//       .lesson-body *{box-sizing:border-box}

//       /* ── Paragraphs ── */
//       .lesson-body p{margin:0 0 1.4em 0 !important;line-height:1.85 !important;color:#374151}
//       .lesson-body p:last-child{margin-bottom:0 !important}

//       /* ── Headings ── */
//       .lesson-body h1,.lesson-body h2,.lesson-body h3,
//       .lesson-body h4,.lesson-body h5,.lesson-body h6{
//         font-weight:700;color:#111827;letter-spacing:-0.02em;
//         line-height:1.3;margin:2em 0 0.65em 0 !important}
//       .lesson-body h1{font-size:1.8rem}
//       .lesson-body h2{font-size:1.4rem;border-bottom:2px solid #f3f4f6;padding-bottom:0.4em}
//       .lesson-body h3{font-size:1.18rem;color:#1f2937}
//       .lesson-body h4{font-size:1.05rem;color:#374151}
//       .lesson-body h5,.lesson-body h6{font-size:1rem;color:#4b5563}
//       .lesson-body h1:first-child,.lesson-body h2:first-child,
//       .lesson-body h3:first-child{margin-top:0 !important}

//       /* ── Lists ── */
//       .lesson-body ul,.lesson-body ol{padding-left:1.7em;margin:0 0 1.4em 0 !important}
//       .lesson-body ul{list-style-type:disc}
//       .lesson-body ol{list-style-type:decimal}
//       .lesson-body li{margin-bottom:0.5em !important;line-height:1.75;color:#374151;display:list-item}
//       .lesson-body li::marker{color:#6366f1}
//       .lesson-body li>p{margin-bottom:0.35em !important}
//       .lesson-body ul ul,.lesson-body ol ol,
//       .lesson-body ul ol,.lesson-body ol ul{margin:0.4em 0 0.4em 0 !important}

//       /* ── Inline code ── */
//       .lesson-body code{background:#f3f4f6;color:#e11d48;
//         font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
//         font-size:0.875em;padding:0.15em 0.45em;border-radius:5px;
//         border:1px solid #e5e7eb}
//       .lesson-body code::before,.lesson-body code::after{content:none !important}

//       /* ── Code blocks ── */
//       .lesson-body pre{background:#1e293b;color:#e2e8f0;
//         font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
//         font-size:0.875em;line-height:1.65;padding:1.25em 1.5em;
//         border-radius:12px;overflow-x:auto;margin:0 0 1.5em 0 !important;
//         border:1px solid #334155}
//       .lesson-body pre code{background:none;color:inherit;padding:0;
//         border:none;border-radius:0;font-size:1em}

//       /* ── Blockquote ── */
//       .lesson-body blockquote{border-left:4px solid #6366f1;background:#eef2ff;
//         margin:1.5em 0 !important;padding:1em 1.25em;
//         border-radius:0 10px 10px 0;color:#4338ca;font-style:normal}
//       .lesson-body blockquote p{margin-bottom:0 !important;color:#4338ca}

//       /* ── Links ── */
//       .lesson-body a{color:#4f46e5;font-weight:500;text-decoration:none;
//         border-bottom:1px solid #c7d2fe;transition:color .15s,border-color .15s}
//       .lesson-body a:hover{color:#3730a3;border-bottom-color:#6366f1}

//       /* ── Inline styling ── */
//       .lesson-body strong,.lesson-body b{font-weight:700;color:#111827}
//       .lesson-body em,.lesson-body i{font-style:italic}
//       .lesson-body u{text-decoration:underline;text-underline-offset:3px}
//       .lesson-body s,.lesson-body del{text-decoration:line-through;color:#9ca3af}
//       .lesson-body mark{background:#fef9c3;padding:0.1em 0.25em;border-radius:3px}
//       .lesson-body sub{vertical-align:sub;font-size:0.8em}
//       .lesson-body sup{vertical-align:super;font-size:0.8em}

//       /* ── HR ── */
//       .lesson-body hr{border:none;border-top:2px solid #f3f4f6;margin:2em 0 !important}

//       /* ── Images ── */
//       .lesson-body img{max-width:100%;height:auto;border-radius:10px;
//         box-shadow:0 4px 16px rgba(0,0,0,.08);margin:1.25em auto !important;display:block}

//       /* ── Tables ── */
//       .lesson-body table{width:100%;border-collapse:collapse;font-size:0.9em;
//         margin:0 0 1.5em 0 !important;border-radius:10px;overflow:hidden;
//         border:1px solid #e5e7eb}
//       .lesson-body thead{background:#f9fafb}
//       .lesson-body th{padding:0.65em 1em;text-align:left;font-weight:600;
//         color:#374151;font-size:0.8em;text-transform:uppercase;
//         letter-spacing:0.05em;border-bottom:2px solid #e5e7eb}
//       .lesson-body td{padding:0.6em 1em;color:#374151;
//         border-bottom:1px solid #f3f4f6;vertical-align:top}
//       .lesson-body tbody tr:last-child td{border-bottom:none}
//       .lesson-body tbody tr:hover{background:#f9fafb}

//       /* ── Dividers / spacers that WYSIWYG editors output ── */
//       .lesson-body div{margin-bottom:0}
//       .lesson-body br+br{display:block;margin:0.8em 0;content:""}

//       /* ── Iframes ── */
//       .lesson-body iframe{width:100%;border-radius:10px;
//         margin:1.25em 0 !important;border:none}
//     `
//     document.head.appendChild(tag)
//     return () => { /* keep styles across lesson switches */ }
//   }, [])

//   const nothing = !hasContent && !hasDocument && !hasExtLinks && !hasReadings && !hasFiles

//   if (nothing) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className={`w-16 h-16 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-4`}>
//           <meta.Icon className={`w-8 h-8 ${meta.color}`} />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-1">No content yet</h3>
//         <p className="text-sm text-gray-400 max-w-sm">
//           The instructor hasn't added content for this lesson. Check back later or explore the Resources tab.
//         </p>
//       </div>
//     )
//   }

//   // Detect if document is a PDF (can be embedded inline)
//   const isPdf = lesson.documentType?.toLowerCase().includes('pdf')
//     || lesson.documentUrl?.toLowerCase().endsWith('.pdf')

//   return (
//     <div className="space-y-10">

//       {/* ── RICH HTML BODY ────────────────────────────────────────────────── */}
//       {hasContent && (
//         <section>
//           <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//             <AlignLeft className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Lesson Content</span>
//             <span className="ml-auto text-xs text-gray-400">~{readTimeMinutes(lesson.contentHtml)} min read</span>
//           </div>
//           {/* lesson-body styles are injected into <head> via useEffect above */}
//           <div
//             className="lesson-body"
//             dangerouslySetInnerHTML={{ __html: lesson.contentHtml! }}
//           />
//         </section>
//       )}

//       {/* ── DOCUMENT VIEWER (document_url) ───────────────────────────────── */}
//       {hasDocument && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
//               Attached Document
//             </span>
//             {lesson.documentSize && (
//               <span className="text-xs text-gray-400 ml-auto">{formatFileSize(lesson.documentSize)}</span>
//             )}
//           </div>

//           {/* Document action bar */}
//           <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-3">
//             <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
//               {isPdf ? '📄' : '📎'}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {lesson.documentType || 'Document'}
//                 {lesson.documentSize ? ` · ${formatFileSize(lesson.documentSize)}` : ''}
//               </p>
//             </div>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               {/* Toggle inline view */}
//               <button
//                 onClick={() => setDocExpanded(v => !v)}
//                 className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
//               >
//                 <Eye className="w-3.5 h-3.5" />
//                 {docExpanded ? 'Collapse' : 'View'}
//               </button>
//               {/* Open in new tab */}
//               <a
//                 href={lesson.documentUrl!}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 <ExternalLink className="w-3.5 h-3.5" /> Open
//               </a>
//               {/* Download */}
//               <a
//                 href={lesson.documentUrl!}
//                 download
//                 className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
//               >
//                 <Download className="w-3.5 h-3.5" /> Download
//               </a>
//             </div>
//           </div>

//           {/* Inline viewer */}
//           {docExpanded && (
//             <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
//               {isPdf ? (
//                 /* PDF — native browser embed */
//                 <iframe
//                   src={`${lesson.documentUrl!}#toolbar=1&navpanes=1&scrollbar=1`}
//                   className="w-full"
//                   style={{ height: '75vh', minHeight: '500px', border: 'none' }}
//                   title={lesson.title}
//                 />
//               ) : (
//                 /* Non-PDF: try Google Docs viewer as fallback */
//                 <iframe
//                   src={`https://docs.google.com/viewer?url=${encodeURIComponent(lesson.documentUrl!)}&embedded=true`}
//                   className="w-full"
//                   style={{ height: '75vh', minHeight: '500px', border: 'none' }}
//                   title={lesson.title}
//                 />
//               )}
//               {/* Fallback message shown below iframe */}
//               <div className="px-4 py-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
//                 <p className="text-xs text-gray-400">
//                   If the document doesn't load,{' '}
//                   <a href={lesson.documentUrl!} target="_blank" rel="noopener noreferrer"
//                     className="text-indigo-600 font-medium hover:underline">
//                     open it in a new tab
//                   </a>
//                 </p>
//                 <a href={lesson.documentUrl!} download
//                   className="inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-900">
//                   <Download className="w-3 h-3" /> Download
//                 </a>
//               </div>
//             </div>
//           )}
//         </section>
//       )}

//       {/* ── LESSON FILES (from courseResources, filtered by lessonTitle) ──── */}
//       {hasFiles && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Archive className="w-4 h-4 text-violet-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Lesson Files</span>
//             <span className="ml-auto text-xs text-gray-400">
//               {lessonFiles.length} file{lessonFiles.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="grid gap-2.5">
//             {lessonFiles.map((resource) => {
//               const globalIdx = courseResources.findIndex(r => r.id === resource.id)
//               return (
//                 <div
//                   key={resource.id}
//                   className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all"
//                 >
//                   <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base shadow-sm">
//                     {getFileIcon(resource.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 text-sm truncate">{resource.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}
//                     </p>
//                   </div>
//                   <div className="flex gap-1.5 flex-shrink-0">
//                     <button
//                       onClick={() => onViewFile(resource, globalIdx)}
//                       className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
//                     >
//                       <Eye className="w-3 h-3" /> View
//                     </button>
//                     <a
//                       href={resource.url}
//                       download={resource.name}
//                       className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
//                     >
//                       <Download className="w-3 h-3" /> Save
//                     </a>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </section>
//       )}

//       {/* ── RECOMMENDED READINGS (recommended_readings string[]) ─────────── */}
//       {hasReadings && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
//               Recommended Readings
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {lesson.recommendedReadings!.map((reading, i) => (
//               <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                 <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
//                 </div>
//                 <span className="text-sm text-gray-700 leading-relaxed">{reading}</span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* ── EXTERNAL LINKS (external_links JSONB) ────────────────────────── */}
//       {hasExtLinks && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <ExternalLink className="w-4 h-4 text-sky-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
//               References & Links
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {(lesson.externalLinks as any[]).map((link: any, i: number) => {
//               const href  = typeof link === 'string' ? link : (link.url || '#')
//               const label = typeof link === 'string' ? link : (link.name || link.title || link.url || href)
//               return (
//                 <li key={i}>
//                   <a
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-sky-50 hover:bg-sky-100 hover:border-sky-200 transition-all"
//                   >
//                     <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-100">
//                       <Hash className="w-3.5 h-3.5 text-sky-500" />
//                     </div>
//                     <span className="flex-1 text-sm text-sky-700 group-hover:text-sky-900 font-medium truncate">
//                       {label}
//                     </span>
//                     <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0" />
//                   </a>
//                 </li>
//               )
//             })}
//           </ul>
//         </section>
//       )}

//       {/* ── MODULE KEY CONCEPTS (module.keyConcepts string[]) ────────────── */}
//       {hasModuleKeyConcepts && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Key Concepts</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {module.keyConcepts.map((concept, i) => (
//               <span
//                 key={i}
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
//                 {concept}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CourseLearningPage({
//   courseId,
//   courseData,
//   curriculumData,
//   enrollmentData,
//   userId,
//   initialUserProgress = {},
//   courseResources = [],
// }: CourseLearningProps) {
//   const [currentModule, setCurrentModule]             = useState(0)
//   const [currentLesson, setCurrentLesson]             = useState(0)
//   const [expandedModules, setExpandedModules]         = useState<number[]>([0])
//   const [isPlaying, setIsPlaying]                     = useState(false)
//   const [isMuted, setIsMuted]                         = useState(false)
//   const [bookmarkedTimes, setBookmarkedTimes]         = useState<number[]>([])
//   const [activeTab, setActiveTab]                     = useState<'overview' | 'notes' | 'resources'>('overview')
//   const [notes, setNotes]                             = useState('')
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
//   const [userProgress, setUserProgress]               = useState<UserProgress>(initialUserProgress)
//   const [selectedFile, setSelectedFile]               = useState<CourseResource | null>(null)
//   const [showFileViewer, setShowFileViewer]           = useState(false)
//   const [currentFileIndex, setCurrentFileIndex]       = useState(0)
//   const [videoDuration, setVideoDuration]             = useState(0)
//   const [isSaving, setIsSaving]                       = useState(false)

//   const currentTimeRef     = useRef(0)
//   const [, forceUpdate]    = useState(0)
//   const videoRef           = useRef<HTMLVideoElement>(null)
//   const audioRef           = useRef<HTMLAudioElement>(null)
//   const lastSaveRef        = useRef(0)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const pdfResources   = courseResources.filter(r => r.type === 'PDF Document')
//   const otherResources = courseResources.filter(r => r.type !== 'PDF Document')

//   const handleNextFile = () => {
//     if (currentFileIndex < courseResources.length - 1) {
//       const n = currentFileIndex + 1
//       setSelectedFile(courseResources[n]); setCurrentFileIndex(n)
//     }
//   }
//   const handlePrevFile = () => {
//     if (currentFileIndex > 0) {
//       const p = currentFileIndex - 1
//       setSelectedFile(courseResources[p]); setCurrentFileIndex(p)
//     }
//   }

//   useEffect(() => { loadUserProgress() }, [courseId, userId])

//   const loadUserProgress = async () => {
//     try {
//       const res = await fetch(`/api/student/progress?courseId=${courseId}`)
//       if (res.ok) {
//         const data = await res.json()
//         const t: UserProgress = {}
//         if (data.progress && typeof data.progress === 'object') {
//           Object.entries(data.progress).forEach(([id, d]: [string, any]) => {
//             t[id] = {
//               completed:      d.is_completed  || d.completed  || false,
//               progress:       d.video_progress || d.progress  || 0,
//               timeSpent:      d.time_spent     || 0,
//               lastPosition:   d.last_position  || 0,
//               lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
//             }
//           })
//         }
//         setUserProgress(t)
//       } else {
//         const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//         if (saved) setUserProgress(JSON.parse(saved))
//       }
//     } catch {
//       const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//       if (saved) try { setUserProgress(JSON.parse(saved)) } catch {}
//     }
//   }

//   const saveProgressToDatabase = async (lessonId: string, data: {
//     completed?: boolean; progress?: number; timeSpent?: number; lastPosition?: number
//   }) => {
//     try {
//       setIsSaving(true)
//       const res = await fetch('/api/student/progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ courseId, lessonId, userId, ...data }),
//       })
//       if (!res.ok) throw new Error('Failed to save')
//       return await res.json()
//     } catch {
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(userProgress).length > 0 && userId)
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//   }, [userProgress, courseId, userId])

//   // Auto-save video/audio progress
//   useEffect(() => {
//     const autoSave = async () => {
//       const lesson = getCurrentLessonData()
//       if (!lesson) return
//       const now = Date.now()
//       const currentTime = currentTimeRef.current
//       if (now - lastSaveRef.current > 30000 && currentTime > 10) {
//         const pct = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0
//         await saveProgressToDatabase(lesson.id, {
//           progress: pct, timeSpent: Math.floor(currentTime), lastPosition: Math.floor(currentTime),
//         })
//         lastSaveRef.current = now
//       }
//     }
//     const id = setInterval(autoSave, 10000)
//     return () => clearInterval(id)
//   }, [courseId, videoDuration])

//   const calculateOverallProgress = () => {
//     let total = 0, done = 0
//     curriculumData.forEach(m => m.lessons.forEach(l => {
//       total++
//       if (userProgress[l.id]?.completed) done++
//     }))
//     return total > 0 ? Math.round((done / total) * 100) : 0
//   }

//   const calculateModuleProgress = (module: Module) => {
//     if (!module.lessons.length) return 0
//     const done = module.lessons.filter(l => userProgress[l.id]?.completed).length
//     return Math.round((done / module.lessons.length) * 100)
//   }

//   const completeLesson = async (lessonId?: string) => {
//     const id = lessonId || getCurrentLessonData()?.id
//     if (!id) return
//     setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
//     await saveProgressToDatabase(id, { completed: true, progress: 100 })
//   }

//   const goToNextLesson = () => {
//     const lesson = getCurrentLessonData()
//     if (lesson && !userProgress[lesson.id]?.completed) completeLesson()
//     if (currentLesson < curriculumData[currentModule].lessons.length - 1)
//       selectLesson(currentModule, currentLesson + 1)
//     else if (currentModule < curriculumData.length - 1)
//       selectLesson(currentModule + 1, 0)
//   }

//   const goToPreviousLesson = () => {
//     if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
//     else if (currentModule > 0)
//       selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
//   }

//   const toggleModule = (i: number) =>
//     setExpandedModules(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

//   const selectLesson = async (modIdx: number, lesIdx: number) => {
//     setCurrentModule(modIdx); setCurrentLesson(lesIdx)
//     currentTimeRef.current = 0
//     setIsPlaying(false); setIsMobileSidebarOpen(false)
//     setTimeout(() => {
//       if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
//       if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.pause() }
//       forceUpdate(x => x + 1)
//     }, 100)
//     const lesson = curriculumData[modIdx]?.lessons[lesIdx]
//     if (lesson && !userProgress[lesson.id]?.completed) {
//       setUserProgress(prev => ({
//         ...prev,
//         [lesson.id]: { ...prev[lesson.id], completed: prev[lesson.id]?.completed || false,
//           progress: prev[lesson.id]?.progress || 0, timeSpent: prev[lesson.id]?.timeSpent || 0,
//           lastPosition: 0, lastAccessedAt: new Date().toISOString() },
//       }))
//       saveProgressToDatabase(lesson.id, { progress: 0, timeSpent: 0, lastPosition: 0 }).catch(() => {})
//     }
//   }

//   const formatTime = (s: number) =>
//     !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

//   const getCurrentLessonData = (): Lesson | null => {
//     const l = curriculumData[currentModule]?.lessons[currentLesson]
//     if (!l) return null
//     const p = userProgress[l.id] || {}
//     return { ...l, watched: p.timeSpent || 0, completed: p.completed || false }
//   }

//   const currentLessonData    = getCurrentLessonData()
//   const currentModuleData    = curriculumData[currentModule]
//   const overallProgress      = calculateOverallProgress()

//   // ── Determine what to show ──────────────────────────────────────────────
//   // We branch exclusively on lesson_type (the real medium field).
//   // video_url being present is the secondary check for video lessons
//   // (in case lesson_type is incorrectly set but url exists).
//   const lt = currentLessonData?.lessonType
//   const isVideoLesson = (lt === 'video') && Boolean(currentLessonData?.videoUrl)
//   const isAudioLesson = (lt === 'audio') && Boolean(currentLessonData?.audioUrl)
//   // All others render text/document content layout
//   const hasMediaPlayer = isVideoLesson || isAudioLesson

//   const lessonMeta = lt ? (LESSON_TYPE_META[lt] ?? LESSON_TYPE_META.text) : LESSON_TYPE_META.text

//   // ── Per-lesson sidebar icon (uses lesson's own lessonType/urls) ─────────
//   const getLessonIcon = (lesson: Lesson, completed?: boolean) => {
//     if (completed) return <CheckCircle2 size={15} className="flex-shrink-0 text-green-500" />
//     const meta = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//     return <meta.Icon size={14} className={`flex-shrink-0 ${meta.color}`} />
//   }

//   useEffect(() => () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }, [])

//   if (!currentLessonData) {
//     return (
//       <div className="flex-1 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
//           <p className="mt-4 text-gray-500 text-sm">Loading lesson…</p>
//         </div>
//       </div>
//     )
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // Sub-components
//   // ─────────────────────────────────────────────────────────────────────────

//   const AxioQuanLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
//     <a href="/" className={`flex items-center gap-2.5 ${size === 'small' ? 'px-1' : 'px-2'}`}>
//       <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
//         <span className="text-white font-bold text-sm">A</span>
//       </div>
//       {size === 'default' && <span className="font-bold text-lg text-foreground">AxioQuan</span>}
//     </a>
//   )

//   const CurriculumList = () => (
//     <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
//       {curriculumData.map((module, modIdx) => {
//         const modProgress = calculateModuleProgress(module)
//         return (
//           <div key={module.id}>
//             <button
//               onClick={() => toggleModule(modIdx)}
//               className="cursor-pointer w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
//             >
//               <div className="flex items-center gap-2.5 flex-1 min-w-0">
//                 <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
//                   <BookOpen size={13} className="text-gray-500" />
//                 </div>
//                 <div className="text-left min-w-0">
//                   <p className="font-semibold text-sm text-foreground truncate">{module.title}</p>
//                   <p className="text-xs text-muted-foreground">{modProgress}% complete</p>
//                 </div>
//               </div>
//               {expandedModules.includes(modIdx)
//                 ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
//                 : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
//             </button>

//             {expandedModules.includes(modIdx) && (
//               <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
//                 {module.lessons.map((lesson, lesIdx) => {
//                   const isActive    = currentModule === modIdx && currentLesson === lesIdx
//                   const isDone      = userProgress[lesson.id]?.completed
//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(modIdx, lesIdx)}
//                       className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
//                         isActive
//                           ? 'bg-primary text-primary-foreground'
//                           : 'hover:bg-gray-50 text-foreground'
//                       }`}
//                     >
//                       <span className="flex-shrink-0">{getLessonIcon(lesson, isDone)}</span>
//                       <span className="flex-1 text-left text-xs leading-snug line-clamp-2">{lesson.title}</span>
//                       {lesson.duration > 0 && !isDone && (
//                         <span className={`text-xs flex-shrink-0 flex items-center gap-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
//                           <Clock size={10} />{formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )

//   const MobileSidebar = () => (
//     <>
//       {isMobileSidebarOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)} />
//       )}
//       <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden shadow-2xl
//         ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <AxioQuanLogo />
//             <button onClick={() => setIsMobileSidebarOpen(false)}
//               className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <X size={18} />
//             </button>
//           </div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>
//     </>
//   )

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="flex min-h-screen bg-background">
//       <MobileSidebar />

//       {/* Desktop sidebar */}
//       <div className="hidden md:flex w-80 bg-white border-r border-border flex-col fixed left-0 top-0 bottom-0 z-30">
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="mb-3"><AxioQuanLogo /></div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>

//       {/* Main area */}
//       <div className="flex-1 md:ml-80 w-full min-h-screen flex flex-col">

//         {/* Mobile top bar */}
//         <div className="md:hidden bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <AxioQuanLogo size="small" />
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-muted-foreground truncate">{currentModuleData?.title}</p>
//               <p className="font-semibold text-sm truncate">{currentLessonData.title}</p>
//             </div>
//           </div>
//         </div>

//         {/* Floating mobile menu */}
//         <button
//           onClick={() => setIsMobileSidebarOpen(true)}
//           className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl z-40"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Course header (desktop only) */}
//         <div className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{courseData?.title || 'Course'}</h1>
//             {courseData?.short_description && (
//               <p className="text-gray-500 text-sm">{courseData.short_description}</p>
//             )}
//             <p className="text-gray-400 text-xs mt-0.5">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             VIDEO PLAYER — only when lessonType='video' AND videoUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isVideoLesson && (
//           <div className="bg-white border-b border-gray-100 flex-shrink-0">
//             {/* White section with generous padding so the video breathes */}
//             <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
//               {/* Dark rounded card — video sits inside with shadow */}
//               <div
//                 className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
//                 style={{ background: '#0f0f0f' }}
//               >
//                 <video
//                   key={currentLessonData.videoUrl!}
//                   ref={videoRef}
//                   className="w-full aspect-video object-contain"
//                   controls
//                   playsInline
//                   poster={currentLessonData.videoThumbnail ?? undefined}
//                   onTimeUpdate={() => {
//                     if (!videoRef.current) return
//                     currentTimeRef.current = videoRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onLoadedMetadata={() => {
//                     if (videoRef.current) setVideoDuration(videoRef.current.duration)
//                   }}
//                   onEnded={() => {
//                     setIsPlaying(false)
//                     const pct = currentLessonData.duration > 0
//                       ? (currentTimeRef.current / currentLessonData.duration) * 100
//                       : 100
//                     if (pct >= 90) completeLesson()
//                   }}
//                   onPlay={() => setIsPlaying(true)}
//                   onPause={() => setIsPlaying(false)}
//                 >
//                   <source src={currentLessonData.videoUrl!} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//               {isSaving && (
//                 <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
//                   <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
//                   Saving progress…
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             AUDIO PLAYER — lessonType='audio' AND audioUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isAudioLesson && (
//           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
//               <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
//                     <Music className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
//                       Audio Lesson
//                     </p>
//                     <h3 className="text-white font-bold text-lg leading-tight">{currentLessonData.title}</h3>
//                   </div>
//                 </div>
//                 <audio
//                   key={currentLessonData.audioUrl!}
//                   ref={audioRef}
//                   className="w-full"
//                   controls
//                   onTimeUpdate={() => {
//                     if (!audioRef.current) return
//                     currentTimeRef.current = audioRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onEnded={() => completeLesson()}
//                 >
//                   <source src={currentLessonData.audioUrl!} />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             Progress bar
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-3 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <div className="flex items-center justify-between mb-1.5">
//               <span className="text-xs font-semibold text-gray-600">Course Progress</span>
//               <span className="text-xs font-bold text-primary">{overallProgress}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2">
//               <div
//                 className="bg-primary rounded-full h-2 transition-all duration-700"
//                 style={{ width: `${overallProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Lesson header + Mark Complete
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-4 justify-between flex-col md:flex-row">
//             <div className="min-w-0">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//                 {currentModuleData?.title}
//               </p>
//               <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
//                 {currentLessonData.title}
//               </h2>
//               <div className="flex flex-wrap items-center gap-2.5">
//                 {/* Lesson type badge */}
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${lessonMeta.bgColor} ${lessonMeta.color}`}>
//                   <lessonMeta.Icon size={12} />
//                   {lessonMeta.label}
//                 </span>
//                 {currentLessonData.difficulty && (
//                   <span className="text-xs text-gray-400 capitalize">{currentLessonData.difficulty}</span>
//                 )}
//                 {currentLessonData.duration > 0 && (
//                   <span className="flex items-center gap-1 text-xs text-gray-400">
//                     <Clock size={11} />{formatTime(currentLessonData.duration)}
//                   </span>
//                 )}
//                 {isVideoLesson && (
//                   <span className="text-xs text-gray-400 flex items-center gap-1">
//                     <Video size={11} /> Video
//                   </span>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => completeLesson()}
//               disabled={userProgress[currentLessonData.id]?.completed || isSaving}
//               className={`flex-shrink-0 w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
//                 userProgress[currentLessonData.id]?.completed
//                   ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
//                   : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
//               }`}
//             >
//               {userProgress[currentLessonData.id]?.completed ? (
//                 <><CheckCircle2 size={16} />Completed</>
//               ) : isSaving ? (
//                 <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
//               ) : (
//                 'Mark Complete'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Tabs
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border flex-shrink-0 sticky top-0 z-20">
//           <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0 overflow-x-auto">
//             {(['overview', 'notes', 'resources'] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`cursor-pointer px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* File viewer modal */}
//         {showFileViewer && selectedFile && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-6xl h-[90vh]">
//               <FileViewer
//                 file={selectedFile}
//                 onClose={() => setShowFileViewer(false)}
//                 onNext={handleNextFile}
//                 onPrev={handlePrevFile}
//                 showNavigation={courseResources.length > 1}
//               />
//             </div>
//           </div>
//         )}

//         {/* ─── Tab content ────────────────────────────────────────────── */}
//         <div className="flex-1 bg-gray-50">
//           <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

//             {/* ── OVERVIEW ─────────────────────────────────────────────── */}
//             {activeTab === 'overview' && (
//               <div className="space-y-8">

//                 {/* Description */}
//                 {currentLessonData.description && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Lightbulb className="w-4 h-4 text-amber-500" />
//                       <h3 className="font-bold text-gray-900 text-sm">About this lesson</h3>
//                     </div>
//                     <p className="text-gray-600 leading-relaxed text-[15px]">
//                       {currentLessonData.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ─────────────────────────────────────────────────────
//                     VIDEO lesson → objectives + bookmarks
//                     All other lesson types → full content body
//                 ───────────────────────────────────────────────────── */}
//                 {hasMediaPlayer ? (
//                   /* ── Video/Audio: objectives + bookmarks ──────────── */
//                   <div className="space-y-6">
//                     {/* Module learning objectives */}
//                     {currentModuleData?.learningObjectives?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <GraduationCap className="w-4 h-4 text-indigo-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Learning Objectives</h3>
//                         </div>
//                         <ul className="space-y-2.5">
//                           {currentModuleData.learningObjectives.map((obj, i) => (
//                             <li key={i} className="flex items-start gap-3">
//                               <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
//                               <span className="text-gray-600 text-[15px] leading-relaxed">{obj}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Module key concepts */}
//                     {currentModuleData?.keyConcepts?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Lightbulb className="w-4 h-4 text-yellow-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Key Concepts</h3>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {currentModuleData.keyConcepts.map((concept, i) => (
//                             <span key={i}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
//                               <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{concept}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Bookmarks (only relevant for video) */}
//                     {isVideoLesson && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Bookmark className="w-4 h-4 text-blue-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Video Bookmarks</h3>
//                         </div>
//                         {bookmarkedTimes.length > 0 ? (
//                           <div className="space-y-2">
//                             {bookmarkedTimes.map((t, i) => (
//                               <button
//                                 key={i}
//                                 onClick={() => {
//                                   currentTimeRef.current = t
//                                   if (videoRef.current) videoRef.current.currentTime = t
//                                   forceUpdate(x => x + 1)
//                                 }}
//                                 className="cursor-pointer w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition flex items-center gap-3"
//                               >
//                                 <Bookmark size={13} className="text-blue-400 flex-shrink-0" />
//                                 <span className="font-mono font-semibold text-sm text-gray-800">{formatTime(t)}</span>
//                                 <span className="text-xs text-gray-400">Bookmark {i + 1}</span>
//                               </button>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-400 text-center py-3">
//                             No bookmarks yet. Use the video player to add them.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   /* ── Text/Document/Quiz/etc: full lesson content ─── */
//                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className={`px-6 py-4 border-b border-gray-50 flex items-center gap-3 ${lessonMeta.bgColor}`}>
//                       <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
//                         <lessonMeta.Icon className={`w-4 h-4 ${lessonMeta.color}`} />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 text-sm">{lessonMeta.label}</p>
//                         <p className="text-xs text-gray-500">
//                           {hasHtmlContent(currentLessonData.contentHtml)
//                             ? `~${readTimeMinutes(currentLessonData.contentHtml)} min read`
//                             : 'Study material below'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="p-6 md:p-8">
//                       <LessonContent
//                         lesson={currentLessonData}
//                         module={currentModuleData}
//                         courseResources={courseResources}
//                         onViewFile={(resource, index) => {
//                           setSelectedFile(resource)
//                           setCurrentFileIndex(index)
//                           setShowFileViewer(true)
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── NOTES ────────────────────────────────────────────────── */}
//             {activeTab === 'notes' && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
//                   <span className="text-xs text-gray-400">{notes.split(/\s+/).filter(Boolean).length} words</span>
//                 </div>
//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                   <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
//                     {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, i) => (
//                       <button key={i}
//                         className="cursor-pointer p-1.5 rounded hover:bg-gray-200 transition text-gray-500 hover:text-gray-800">
//                         <Icon size={14} />
//                       </button>
//                     ))}
//                   </div>
//                   <textarea
//                     value={notes}
//                     onChange={e => setNotes(e.target.value)}
//                     placeholder={"Start typing your notes…\n\nWrite down key concepts, questions, or insights."}
//                     className="w-full min-h-[400px] p-5 bg-white text-gray-800 placeholder-gray-300 focus:outline-none text-[15px] leading-relaxed resize-y font-sans"
//                   />
//                   <div className="px-5 py-2 border-t border-gray-50 flex justify-between text-xs text-gray-400">
//                     <span>Notes are saved locally</span>
//                     <span>{notes.length} chars</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── RESOURCES ────────────────────────────────────────────── */}
//             {activeTab === 'resources' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-bold text-foreground">Course Resources</h3>

//                 {courseResources.length > 0 ? (
//                   <>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {[
//                         { label: 'Total Files',   value: courseResources.length, bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-500' },
//                         { label: 'PDFs',          value: pdfResources.length,    bg: 'bg-green-50',  text: 'text-green-700',  sub: 'text-green-500' },
//                         { label: 'Other',         value: otherResources.length,  bg: 'bg-violet-50', text: 'text-violet-700', sub: 'text-violet-500' },
//                         { label: 'Modules',       value: new Set(courseResources.map(r => r.moduleTitle)).size, bg: 'bg-amber-50', text: 'text-amber-700', sub: 'text-amber-500' },
//                       ].map(s => (
//                         <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
//                           <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
//                           <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Desktop table */}
//                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hidden md:block overflow-hidden">
//                       <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
//                         <span className="font-semibold text-sm text-gray-900">All Resources</span>
//                         <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                           {courseResources.length} files
//                         </span>
//                       </div>
//                       <table className="w-full">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             {['File', 'Type', 'Source', 'Size', 'Actions'].map(h => (
//                               <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                           {courseResources.map((resource, idx) => (
//                             <tr key={resource.id} className="hover:bg-gray-50/60 transition-colors">
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2.5">
//                                   <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">{getFileIcon(resource.type)}</div>
//                                   <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{resource.name}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resource.type}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <p className="text-sm text-gray-600 truncate max-w-[160px]">{resource.lessonTitle}</p>
//                                 <p className="text-xs text-gray-400">{resource.moduleTitle}</p>
//                               </td>
//                               <td className="py-3 px-4 text-sm text-gray-500">
//                                 {resource.size ? formatFileSize(resource.size) : '—'}
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex gap-1.5">
//                                   <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                     className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
//                                     <Eye size={11} /> View
//                                   </button>
//                                   <a href={resource.url} download={resource.name}
//                                     className="inline-flex items-center gap-1 text-green-700 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
//                                     <Download size={11} /> Download
//                                   </a>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden space-y-2.5">
//                       {courseResources.map((resource, idx) => (
//                         <div key={resource.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{getFileIcon(resource.type)}</div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
//                               <p className="text-xs text-gray-400 mt-0.5">{resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}</p>
//                               <div className="flex gap-2 mt-2.5">
//                                 <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                   className="cursor-pointer text-xs text-indigo-600 font-medium px-2.5 py-1.5 bg-indigo-50 rounded-lg">View</button>
//                                 <a href={resource.url} download={resource.name}
//                                   className="text-xs text-green-700 font-medium px-2.5 py-1.5 bg-green-50 rounded-lg">Download</a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex flex-wrap gap-3 pt-2">
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Bulk download will be available in a future update.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//                         <Archive className="w-4 h-4" /> Download All as ZIP
//                       </button>
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Print resources feature coming soon.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
//                         <Printer className="w-4 h-4" /> Print All
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
//                     <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
//                     <h4 className="font-semibold text-gray-700 mb-1">No Resources Yet</h4>
//                     <p className="text-sm text-gray-400">The instructor hasn't added any downloadable resources yet.</p>
//                   </div>
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="bg-white border-t border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-3 flex-col md:flex-row">
//             <button
//               onClick={goToPreviousLesson}
//               disabled={currentModule === 0 && currentLesson === 0}
//               className="cursor-pointer px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition disabled:opacity-40 font-semibold text-sm"
//             >
//               ← Previous Lesson
//             </button>
//             <button
//               onClick={goToNextLesson}
//               disabled={
//                 currentModule === curriculumData.length - 1 &&
//                 currentLesson === curriculumData[currentModule]?.lessons.length - 1
//               }
//               className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 font-semibold text-sm"
//             >
//               Next Lesson →
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }





























// 'use client'
// // /src/components/courses/course-learning.tsx
// //
// // Key corrections vs previous version:
// // ─ lesson_type (not content_type) determines the lesson medium
// //   Values: 'video'|'text'|'document'|'quiz'|'assignment'|
// //           'live_session'|'audio'|'interactive'|'code'|'discussion'
// // ─ content_type is 'free'|'premium'|'trial' — access control only
// // ─ content_html is the real WYSIWYG field name
// // ─ Video viewport only renders when lesson has a real video_url
// // ─ All lesson types get appropriate content displays
// // ─ Module learning_objectives and key_concepts displayed
// // ─ audio lessons get audio player
// // ─ recommended_readings displayed for text/document lessons

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import {
//   ChevronDown, ChevronUp, Bookmark, CheckCircle2, BookOpen,
//   Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
//   LayoutDashboard, Menu, X, Clock, FileText, Video, Download,
//   Eye, Archive, Printer, ExternalLink, BookMarked, AlignLeft,
//   GraduationCap, Lightbulb, Hash, Music, Code2, MessageSquare,
//   Calendar, Puzzle, ClipboardList, ChevronRight, Save, Package,
// } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import FileViewer from '@/components/courses/file-viewer'

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const formatFileSize = (bytes: number | null): string => {
//   if (!bytes) return 'Unknown size'
//   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   if (bytes === 0) return '0 Bytes'
//   const i = Math.floor(Math.log(bytes) / Math.log(1024))
//   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
// }

// const getFileIcon = (type: string) => {
//   const t = type.toLowerCase()
//   if (t.includes('pdf'))    return '📄'
//   if (t.includes('word') || t.includes('doc'))  return '📝'
//   if (t.includes('excel') || t.includes('sheet') || t.includes('csv')) return '📊'
//   if (t.includes('powerpoint') || t.includes('presentation')) return '📈'
//   if (t.includes('image'))  return '🖼️'
//   if (t.includes('video'))  return '🎬'
//   if (t.includes('audio'))  return '🎵'
//   if (t.includes('zip') || t.includes('archive') || t.includes('rar')) return '🗜️'
//   if (t.includes('code') || t.includes('json') || t.includes('xml'))   return '💻'
//   return '📁'
// }

// const hasHtmlContent = (html: string | null | undefined): boolean => {
//   if (!html) return false
//   return html.replace(/<[^>]*>/g, '').trim().length > 0
// }

// // Approximate read time in minutes
// const readTimeMinutes = (html: string | null | undefined): number => {
//   if (!html) return 1
//   const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
//   return Math.max(1, Math.ceil(words / 200))
// }

// // ─── Types ────────────────────────────────────────────────────────────────────
// // These match exactly what learn-page.tsx pushes into curriculumData

// type LessonType =
//   | 'video' | 'text' | 'document' | 'quiz' | 'assignment'
//   | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion'

// interface Lesson {
//   id:           string
//   title:        string
//   description?: string | null
//   lessonType:   LessonType   // the actual medium — THIS is what we branch on
//   contentType:  string       // 'free'|'premium'|'trial' — access control only
//   difficulty?:  string | null
//   // ── Rich text body ────────────────────────────────────────────────────
//   contentHtml?: string | null
//   // ── Video ─────────────────────────────────────────────────────────────
//   videoUrl?:       string | null
//   videoDuration?:  number
//   videoThumbnail?: string | null
//   // ── Audio ─────────────────────────────────────────────────────────────
//   audioUrl?:      string | null
//   audioDuration?: number
//   // ── Document ──────────────────────────────────────────────────────────
//   documentUrl?:  string | null
//   documentType?: string | null
//   documentSize?: number | null
//   // ── Supplementary ─────────────────────────────────────────────────────
//   externalLinks?:            any
//   downloadableResources?:    string[]
//   attachedFiles?:            string[]
//   recommendedReadings?:      string[]
//   hasDownloadableResources?: boolean
//   // ── Display ───────────────────────────────────────────────────────────
//   duration:  number
//   order:     number
//   isPreview: boolean
//   // ── Progress (merged in by getCurrentLessonData) ───────────────────────
//   watched?:    number
//   completed?:  boolean
// }

// interface Module {
//   id:                 string
//   title:              string
//   description?:       string | null
//   order:              number
//   learningObjectives: string[]
//   keyConcepts:        string[]
//   lessons:            Lesson[]
// }

// interface UserProgress {
//   [lessonId: string]: {
//     completed:      boolean
//     progress:       number
//     timeSpent:      number
//     lastPosition:   number
//     lastAccessedAt: string | null
//   }
// }

// interface CourseResource {
//   id:           string
//   name:         string
//   url:          string
//   type:         string
//   size:         number | null
//   lessonTitle:  string
//   moduleTitle:  string
//   isPdf?:       boolean
// }

// interface CourseLearningProps {
//   courseId:             string
//   courseData:           any
//   curriculumData:       Module[]
//   enrollmentData?:      any
//   userId:               string
//   initialUserProgress?: UserProgress
//   courseResources?:     CourseResource[]
// }

// // ─── Lesson type metadata ────────────────────────────────────────────────────

// const LESSON_TYPE_META: Record<LessonType, { label: string; color: string; bgColor: string; Icon: any }> = {
//   video:        { label: 'Video Lesson',       color: 'text-blue-600',   bgColor: 'bg-blue-50',   Icon: Video },
//   audio:        { label: 'Audio Lesson',        color: 'text-violet-600', bgColor: 'bg-violet-50', Icon: Music },
//   text:         { label: 'Reading',             color: 'text-indigo-600', bgColor: 'bg-indigo-50', Icon: BookMarked },
//   document:     { label: 'Document',            color: 'text-amber-600',  bgColor: 'bg-amber-50',  Icon: FileText },
//   quiz:         { label: 'Quiz',                color: 'text-orange-600', bgColor: 'bg-orange-50', Icon: ClipboardList },
//   assignment:   { label: 'Assignment',          color: 'text-rose-600',   bgColor: 'bg-rose-50',   Icon: ClipboardList },
//   live_session: { label: 'Live Session',        color: 'text-green-600',  bgColor: 'bg-green-50',  Icon: Calendar },
//   interactive:  { label: 'Interactive Lesson',  color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   Icon: Puzzle },
//   code:         { label: 'Code Exercise',       color: 'text-slate-600',  bgColor: 'bg-slate-50',  Icon: Code2 },
//   discussion:   { label: 'Discussion',          color: 'text-teal-600',   bgColor: 'bg-teal-50',   Icon: MessageSquare },
// }

// // ─── LessonContent ────────────────────────────────────────────────────────────
// // Renders the body for non-video lessons (text, document, audio, code, etc.)

// interface LessonContentProps {
//   lesson:          Lesson
//   module:          Module
//   courseResources: CourseResource[]
//   onViewFile:      (resource: CourseResource, index: number) => void
// }

// function LessonContent({ lesson, module, courseResources, onViewFile }: LessonContentProps) {
//   const meta         = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//   const hasContent   = hasHtmlContent(lesson.contentHtml)
//   const hasDocument  = Boolean(lesson.documentUrl)
//   const hasExtLinks  = Array.isArray(lesson.externalLinks) && lesson.externalLinks.length > 0
//   const hasReadings  = Array.isArray(lesson.recommendedReadings) && lesson.recommendedReadings.length > 0
//   const lessonFiles  = courseResources.filter(r => r.lessonTitle === lesson.title)
//   const hasFiles     = lessonFiles.length > 0
//   const hasModuleObjectives = module.learningObjectives?.length > 0
//   const hasModuleKeyConcepts = module.keyConcepts?.length > 0
//   const [docExpanded, setDocExpanded] = useState(true)

//   // Inject CSS into <head> once — guarantees styles survive SSR/hydration
//   useEffect(() => {
//     const id = 'axioquan-lesson-body-styles'
//     if (document.getElementById(id)) return
//     const tag = document.createElement('style')
//     tag.id = id
//     tag.textContent = `
//       .lesson-body{color:#374151;font-size:15px;line-height:1.8;word-break:break-word}
//       .lesson-body *{box-sizing:border-box}

//       /* ── Paragraphs ── */
//       .lesson-body p{margin:0 0 1.4em 0 !important;line-height:1.85 !important;color:#374151}
//       .lesson-body p:last-child{margin-bottom:0 !important}

//       /* ── Headings ── */
//       .lesson-body h1,.lesson-body h2,.lesson-body h3,
//       .lesson-body h4,.lesson-body h5,.lesson-body h6{
//         font-weight:700;color:#111827;letter-spacing:-0.02em;
//         line-height:1.3;margin:2em 0 0.65em 0 !important}
//       .lesson-body h1{font-size:1.8rem}
//       .lesson-body h2{font-size:1.4rem;border-bottom:2px solid #f3f4f6;padding-bottom:0.4em}
//       .lesson-body h3{font-size:1.18rem;color:#1f2937}
//       .lesson-body h4{font-size:1.05rem;color:#374151}
//       .lesson-body h5,.lesson-body h6{font-size:1rem;color:#4b5563}
//       .lesson-body h1:first-child,.lesson-body h2:first-child,
//       .lesson-body h3:first-child{margin-top:0 !important}

//       /* ── Lists ── */
//       .lesson-body ul,.lesson-body ol{padding-left:1.7em;margin:0 0 1.4em 0 !important}
//       .lesson-body ul{list-style-type:disc}
//       .lesson-body ol{list-style-type:decimal}
//       .lesson-body li{margin-bottom:0.5em !important;line-height:1.75;color:#374151;display:list-item}
//       .lesson-body li::marker{color:#6366f1}
//       .lesson-body li>p{margin-bottom:0.35em !important}
//       .lesson-body ul ul,.lesson-body ol ol,
//       .lesson-body ul ol,.lesson-body ol ul{margin:0.4em 0 0.4em 0 !important}

//       /* ── Inline code ── */
//       .lesson-body code{background:#f3f4f6;color:#e11d48;
//         font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
//         font-size:0.875em;padding:0.15em 0.45em;border-radius:5px;
//         border:1px solid #e5e7eb}
//       .lesson-body code::before,.lesson-body code::after{content:none !important}

//       /* ── Code blocks ── */
//       .lesson-body pre{background:#1e293b;color:#e2e8f0;
//         font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
//         font-size:0.875em;line-height:1.65;padding:1.25em 1.5em;
//         border-radius:12px;overflow-x:auto;margin:0 0 1.5em 0 !important;
//         border:1px solid #334155}
//       .lesson-body pre code{background:none;color:inherit;padding:0;
//         border:none;border-radius:0;font-size:1em}

//       /* ── Blockquote ── */
//       .lesson-body blockquote{border-left:4px solid #6366f1;background:#eef2ff;
//         margin:1.5em 0 !important;padding:1em 1.25em;
//         border-radius:0 10px 10px 0;color:#4338ca;font-style:normal}
//       .lesson-body blockquote p{margin-bottom:0 !important;color:#4338ca}

//       /* ── Links ── */
//       .lesson-body a{color:#4f46e5;font-weight:500;text-decoration:none;
//         border-bottom:1px solid #c7d2fe;transition:color .15s,border-color .15s}
//       .lesson-body a:hover{color:#3730a3;border-bottom-color:#6366f1}

//       /* ── Inline styling ── */
//       .lesson-body strong,.lesson-body b{font-weight:700;color:#111827}
//       .lesson-body em,.lesson-body i{font-style:italic}
//       .lesson-body u{text-decoration:underline;text-underline-offset:3px}
//       .lesson-body s,.lesson-body del{text-decoration:line-through;color:#9ca3af}
//       .lesson-body mark{background:#fef9c3;padding:0.1em 0.25em;border-radius:3px}
//       .lesson-body sub{vertical-align:sub;font-size:0.8em}
//       .lesson-body sup{vertical-align:super;font-size:0.8em}

//       /* ── HR ── */
//       .lesson-body hr{border:none;border-top:2px solid #f3f4f6;margin:2em 0 !important}

//       /* ── Images ── */
//       .lesson-body img{max-width:100%;height:auto;border-radius:10px;
//         box-shadow:0 4px 16px rgba(0,0,0,.08);margin:1.25em auto !important;display:block}

//       /* ── Tables ── */
//       .lesson-body table{width:100%;border-collapse:collapse;font-size:0.9em;
//         margin:0 0 1.5em 0 !important;border-radius:10px;overflow:hidden;
//         border:1px solid #e5e7eb}
//       .lesson-body thead{background:#f9fafb}
//       .lesson-body th{padding:0.65em 1em;text-align:left;font-weight:600;
//         color:#374151;font-size:0.8em;text-transform:uppercase;
//         letter-spacing:0.05em;border-bottom:2px solid #e5e7eb}
//       .lesson-body td{padding:0.6em 1em;color:#374151;
//         border-bottom:1px solid #f3f4f6;vertical-align:top}
//       .lesson-body tbody tr:last-child td{border-bottom:none}
//       .lesson-body tbody tr:hover{background:#f9fafb}

//       /* ── Dividers / spacers that WYSIWYG editors output ── */
//       .lesson-body div{margin-bottom:0}
//       .lesson-body br+br{display:block;margin:0.8em 0;content:""}

//       /* ── Iframes ── */
//       .lesson-body iframe{width:100%;border-radius:10px;
//         margin:1.25em 0 !important;border:none}
//     `
//     document.head.appendChild(tag)
//     return () => { /* keep styles across lesson switches */ }
//   }, [])

//   const nothing = !hasContent && !hasDocument && !hasExtLinks && !hasReadings && !hasFiles

//   if (nothing) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className={`w-16 h-16 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-4`}>
//           <meta.Icon className={`w-8 h-8 ${meta.color}`} />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-1">No content yet</h3>
//         <p className="text-sm text-gray-400 max-w-sm">
//           The instructor hasn't added content for this lesson. Check back later or explore the Resources tab.
//         </p>
//       </div>
//     )
//   }

//   // Detect if document is a PDF (can be embedded inline)
//   const isPdf = lesson.documentType?.toLowerCase().includes('pdf')
//     || lesson.documentUrl?.toLowerCase().endsWith('.pdf')

//   return (
//     <div className="space-y-10">

//       {/* ── RICH HTML BODY ────────────────────────────────────────────────── */}
//       {hasContent && (
//         <section>
//           <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//             <AlignLeft className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Lesson Content</span>
//             <span className="ml-auto text-xs text-gray-400">~{readTimeMinutes(lesson.contentHtml)} min read</span>
//           </div>
//           {/* lesson-body styles are injected into <head> via useEffect above */}
//           <div
//             className="lesson-body"
//             dangerouslySetInnerHTML={{ __html: lesson.contentHtml! }}
//           />
//         </section>
//       )}

//       {/* ── DOCUMENT VIEWER (document_url) ───────────────────────────────── */}
//       {hasDocument && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
//               Attached Document
//             </span>
//             {lesson.documentSize && (
//               <span className="text-xs text-gray-400 ml-auto">{formatFileSize(lesson.documentSize)}</span>
//             )}
//           </div>

//           {/* Document action bar */}
//           <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-3">
//             <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
//               {isPdf ? '📄' : '📎'}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {lesson.documentType || 'Document'}
//                 {lesson.documentSize ? ` · ${formatFileSize(lesson.documentSize)}` : ''}
//               </p>
//             </div>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               {/* Toggle inline view */}
//               <button
//                 onClick={() => setDocExpanded(v => !v)}
//                 className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
//               >
//                 <Eye className="w-3.5 h-3.5" />
//                 {docExpanded ? 'Collapse' : 'View'}
//               </button>
//               {/* Open in new tab */}
//               <a
//                 href={lesson.documentUrl!}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 <ExternalLink className="w-3.5 h-3.5" /> Open
//               </a>
//               {/* Download */}
//               <a
//                 href={lesson.documentUrl!}
//                 download
//                 className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
//               >
//                 <Download className="w-3.5 h-3.5" /> Download
//               </a>
//             </div>
//           </div>

//           {/* Inline viewer */}
//           {docExpanded && (
//             <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
//               {isPdf ? (
//                 /* PDF — native browser embed */
//                 <iframe
//                   src={`${lesson.documentUrl!}#toolbar=1&navpanes=1&scrollbar=1`}
//                   className="w-full"
//                   style={{ height: '75vh', minHeight: '500px', border: 'none' }}
//                   title={lesson.title}
//                 />
//               ) : (
//                 /* Non-PDF: try Google Docs viewer as fallback */
//                 <iframe
//                   src={`https://docs.google.com/viewer?url=${encodeURIComponent(lesson.documentUrl!)}&embedded=true`}
//                   className="w-full"
//                   style={{ height: '75vh', minHeight: '500px', border: 'none' }}
//                   title={lesson.title}
//                 />
//               )}
//               {/* Fallback message shown below iframe */}
//               <div className="px-4 py-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
//                 <p className="text-xs text-gray-400">
//                   If the document doesn't load,{' '}
//                   <a href={lesson.documentUrl!} target="_blank" rel="noopener noreferrer"
//                     className="text-indigo-600 font-medium hover:underline">
//                     open it in a new tab
//                   </a>
//                 </p>
//                 <a href={lesson.documentUrl!} download
//                   className="inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-900">
//                   <Download className="w-3 h-3" /> Download
//                 </a>
//               </div>
//             </div>
//           )}
//         </section>
//       )}

//       {/* ── LESSON FILES (from courseResources, filtered by lessonTitle) ──── */}
//       {hasFiles && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Archive className="w-4 h-4 text-violet-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Lesson Files</span>
//             <span className="ml-auto text-xs text-gray-400">
//               {lessonFiles.length} file{lessonFiles.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="grid gap-2.5">
//             {lessonFiles.map((resource) => {
//               const globalIdx = courseResources.findIndex(r => r.id === resource.id)
//               return (
//                 <div
//                   key={resource.id}
//                   className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all"
//                 >
//                   <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base shadow-sm">
//                     {getFileIcon(resource.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 text-sm truncate">{resource.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}
//                     </p>
//                   </div>
//                   <div className="flex gap-1.5 flex-shrink-0">
//                     <button
//                       onClick={() => onViewFile(resource, globalIdx)}
//                       className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
//                     >
//                       <Eye className="w-3 h-3" /> View
//                     </button>
//                     <a
//                       href={resource.url}
//                       download={resource.name}
//                       className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
//                     >
//                       <Download className="w-3 h-3" /> Save
//                     </a>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </section>
//       )}

//       {/* ── RECOMMENDED READINGS (recommended_readings string[]) ─────────── */}
//       {hasReadings && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
//               Recommended Readings
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {lesson.recommendedReadings!.map((reading, i) => (
//               <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                 <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
//                 </div>
//                 <span className="text-sm text-gray-700 leading-relaxed">{reading}</span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* ── EXTERNAL LINKS (external_links JSONB) ────────────────────────── */}
//       {hasExtLinks && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <ExternalLink className="w-4 h-4 text-sky-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
//               References & Links
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {(lesson.externalLinks as any[]).map((link: any, i: number) => {
//               const href  = typeof link === 'string' ? link : (link.url || '#')
//               const label = typeof link === 'string' ? link : (link.name || link.title || link.url || href)
//               return (
//                 <li key={i}>
//                   <a
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-sky-50 hover:bg-sky-100 hover:border-sky-200 transition-all"
//                   >
//                     <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-100">
//                       <Hash className="w-3.5 h-3.5 text-sky-500" />
//                     </div>
//                     <span className="flex-1 text-sm text-sky-700 group-hover:text-sky-900 font-medium truncate">
//                       {label}
//                     </span>
//                     <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0" />
//                   </a>
//                 </li>
//               )
//             })}
//           </ul>
//         </section>
//       )}

//       {/* ── MODULE KEY CONCEPTS (module.keyConcepts string[]) ────────────── */}
//       {hasModuleKeyConcepts && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Key Concepts</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {module.keyConcepts.map((concept, i) => (
//               <span
//                 key={i}
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
//                 {concept}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }

// // ─── CourseMaterialsCard ──────────────────────────────────────────────────────
// // Displays the document uploaded at course-creation time (courses.materials_url)
// // as a featured card in the Resources tab with inline viewer + download.

// function CourseMaterialsCard({ url, courseTitle }: { url: string; courseTitle: string }) {
//   const [expanded, setExpanded] = useState(false)

//   // Detect type from URL extension
//   const ext  = url.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
//   const isPdf = ext === 'pdf'
//   const isOffice = ['doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext)

//   const typeLabel = isPdf
//     ? 'PDF Document'
//     : isOffice
//     ? `${ext.toUpperCase()} File`
//     : 'Course Document'

//   const emoji = isPdf
//     ? '📄'
//     : ['doc','docx'].includes(ext) ? '📝'
//     : ['ppt','pptx'].includes(ext) ? '📊'
//     : ['xls','xlsx'].includes(ext) ? '📈'
//     : '📎'

//   // Viewer src
//   const viewerSrc = isPdf
//     ? `${url}#toolbar=1&navpanes=1&scrollbar=1`
//     : `https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`

//   return (
//     <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm overflow-hidden">
//       {/* Header banner */}
//       <div className="flex items-center gap-3 px-5 py-4 bg-indigo-600 text-white">
//         <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
//           {emoji}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-0.5">
//             <Package className="w-3.5 h-3.5 text-indigo-200" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
//               Course Materials
//             </span>
//           </div>
//           <p className="font-bold text-white text-base leading-snug truncate">
//             {courseTitle} — Study Materials
//           </p>
//           <p className="text-indigo-200 text-xs mt-0.5">
//             {typeLabel} · Available for the entire course
//           </p>
//         </div>
//       </div>

//       {/* Action bar */}
//       <div className="flex items-center gap-3 px-5 py-4 bg-white border-b border-indigo-50">
//         <button
//           onClick={() => setExpanded(v => !v)}
//           className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
//         >
//           <Eye className="w-4 h-4" />
//           {expanded ? 'Collapse Viewer' : 'Read / View'}
//         </button>
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
//         >
//           <ExternalLink className="w-4 h-4" /> Open in tab
//         </a>
//         <a
//           href={url}
//           download
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors ml-auto"
//         >
//           <Download className="w-4 h-4" /> Download
//         </a>
//       </div>

//       {/* Inline viewer */}
//       {expanded && (
//         <div className="bg-gray-50">
//           <iframe
//             key={viewerSrc}
//             src={viewerSrc}
//             className="w-full"
//             style={{ height: '78vh', minHeight: '520px', border: 'none', display: 'block' }}
//             title={`${courseTitle} materials`}
//             allow="fullscreen"
//           />
//           <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
//             <span>
//               {isPdf
//                 ? 'PDF rendered natively by your browser.'
//                 : 'Rendered via Google Docs Viewer. If it doesn\'t load, use Open in tab.'}
//             </span>
//             <a href={url} download
//               className="inline-flex items-center gap-1 text-green-700 font-medium hover:text-green-900">
//               <Download className="w-3 h-3" /> Save a copy
//             </a>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CourseLearningPage({
//   courseId,
//   courseData,
//   curriculumData,
//   enrollmentData,
//   userId,
//   initialUserProgress = {},
//   courseResources = [],
// }: CourseLearningProps) {
//   const [currentModule, setCurrentModule]             = useState(0)
//   const [currentLesson, setCurrentLesson]             = useState(0)
//   const [expandedModules, setExpandedModules]         = useState<number[]>([0])
//   const [isPlaying, setIsPlaying]                     = useState(false)
//   const [isMuted, setIsMuted]                         = useState(false)
//   const [bookmarkedTimes, setBookmarkedTimes]         = useState<number[]>([])
//   const [activeTab, setActiveTab]                     = useState<'overview' | 'notes' | 'resources'>('overview')
//   const [notes, setNotes]                             = useState('')
//   const [notesSaveStatus, setNotesSaveStatus]         = useState<'idle'|'saving'|'saved'>('idle')
//   const notesSaveTimer                                 = useRef<NodeJS.Timeout | null>(null)

//   // ── IndexedDB-backed notes (survives all refreshes, no expiry) ─────────────
//   // DB: axioquan_notes  |  Store: notes  |  key: `${userId}::${courseId}::${lessonId}`
//   const openNotesDB = (): Promise<IDBDatabase> => new Promise((res, rej) => {
//     const req = indexedDB.open('axioquan_notes', 1)
//     req.onupgradeneeded = () => req.result.createObjectStore('notes')
//     req.onsuccess = () => res(req.result)
//     req.onerror   = () => rej(req.error)
//   })

//   const loadNoteFromDB = async (lessonId: string) => {
//     try {
//       const db  = await openNotesDB()
//       const key = `${userId}::${courseId}::${lessonId}`
//       const tx  = db.transaction('notes', 'readonly')
//       const req = tx.objectStore('notes').get(key)
//       req.onsuccess = () => setNotes(req.result ?? '')
//     } catch { setNotes('') }
//   }

//   const saveNoteToDB = async (lessonId: string, text: string) => {
//     try {
//       setNotesSaveStatus('saving')
//       const db  = await openNotesDB()
//       const key = `${userId}::${courseId}::${lessonId}`
//       const tx  = db.transaction('notes', 'readwrite')
//       tx.objectStore('notes').put(text, key)
//       tx.oncomplete = () => setNotesSaveStatus('saved')
//     } catch { setNotesSaveStatus('idle') }
//   }

//   const handleNotesChange = (text: string) => {
//     setNotes(text)
//     setNotesSaveStatus('saving')
//     if (notesSaveTimer.current) clearTimeout(notesSaveTimer.current)
//     const lessonId = getCurrentLessonData()?.id
//     if (!lessonId) return
//     notesSaveTimer.current = setTimeout(() => saveNoteToDB(lessonId, text), 600)
//   }
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
//   const [userProgress, setUserProgress]               = useState<UserProgress>(initialUserProgress)
//   const [selectedFile, setSelectedFile]               = useState<CourseResource | null>(null)
//   const [showFileViewer, setShowFileViewer]           = useState(false)
//   const [currentFileIndex, setCurrentFileIndex]       = useState(0)
//   const [videoDuration, setVideoDuration]             = useState(0)
//   const [isSaving, setIsSaving]                       = useState(false)

//   const currentTimeRef     = useRef(0)
//   const [, forceUpdate]    = useState(0)
//   const videoRef           = useRef<HTMLVideoElement>(null)
//   const audioRef           = useRef<HTMLAudioElement>(null)
//   const lastSaveRef        = useRef(0)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const pdfResources   = courseResources.filter(r => r.type === 'PDF Document')
//   const otherResources = courseResources.filter(r => r.type !== 'PDF Document')

//   const handleNextFile = () => {
//     if (currentFileIndex < courseResources.length - 1) {
//       const n = currentFileIndex + 1
//       setSelectedFile(courseResources[n]); setCurrentFileIndex(n)
//     }
//   }
//   const handlePrevFile = () => {
//     if (currentFileIndex > 0) {
//       const p = currentFileIndex - 1
//       setSelectedFile(courseResources[p]); setCurrentFileIndex(p)
//     }
//   }

//   useEffect(() => { loadUserProgress() }, [courseId, userId])

//   // Load notes for initial lesson on mount
//   useEffect(() => {
//     const lesson = curriculumData[0]?.lessons[0]
//     if (lesson) loadNoteFromDB(lesson.id)
//   }, [])

//   const loadUserProgress = async () => {
//     try {
//       const res = await fetch(`/api/student/progress?courseId=${courseId}`)
//       if (res.ok) {
//         const data = await res.json()
//         const t: UserProgress = {}
//         if (data.progress && typeof data.progress === 'object') {
//           Object.entries(data.progress).forEach(([id, d]: [string, any]) => {
//             t[id] = {
//               completed:      d.is_completed  || d.completed  || false,
//               progress:       d.video_progress || d.progress  || 0,
//               timeSpent:      d.time_spent     || 0,
//               lastPosition:   d.last_position  || 0,
//               lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
//             }
//           })
//         }
//         setUserProgress(t)
//       } else {
//         const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//         if (saved) setUserProgress(JSON.parse(saved))
//       }
//     } catch {
//       const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//       if (saved) try { setUserProgress(JSON.parse(saved)) } catch {}
//     }
//   }

//   const saveProgressToDatabase = async (lessonId: string, data: {
//     completed?: boolean; progress?: number; timeSpent?: number; lastPosition?: number
//   }) => {
//     try {
//       setIsSaving(true)
//       const res = await fetch('/api/student/progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ courseId, lessonId, userId, ...data }),
//       })
//       if (!res.ok) throw new Error('Failed to save')
//       return await res.json()
//     } catch {
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(userProgress).length > 0 && userId)
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//   }, [userProgress, courseId, userId])

//   // Auto-save video/audio progress
//   useEffect(() => {
//     const autoSave = async () => {
//       const lesson = getCurrentLessonData()
//       if (!lesson) return
//       const now = Date.now()
//       const currentTime = currentTimeRef.current
//       if (now - lastSaveRef.current > 30000 && currentTime > 10) {
//         const pct = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0
//         await saveProgressToDatabase(lesson.id, {
//           progress: pct, timeSpent: Math.floor(currentTime), lastPosition: Math.floor(currentTime),
//         })
//         lastSaveRef.current = now
//       }
//     }
//     const id = setInterval(autoSave, 10000)
//     return () => clearInterval(id)
//   }, [courseId, videoDuration])

//   const calculateOverallProgress = () => {
//     let total = 0, done = 0
//     curriculumData.forEach(m => m.lessons.forEach(l => {
//       total++
//       if (userProgress[l.id]?.completed) done++
//     }))
//     return total > 0 ? Math.round((done / total) * 100) : 0
//   }

//   const calculateModuleProgress = (module: Module) => {
//     if (!module.lessons.length) return 0
//     const done = module.lessons.filter(l => userProgress[l.id]?.completed).length
//     return Math.round((done / module.lessons.length) * 100)
//   }

//   const completeLesson = async (lessonId?: string) => {
//     const id = lessonId || getCurrentLessonData()?.id
//     if (!id) return
//     setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
//     await saveProgressToDatabase(id, { completed: true, progress: 100 })
//   }

//   const goToNextLesson = () => {
//     const lesson = getCurrentLessonData()
//     if (lesson && !userProgress[lesson.id]?.completed) completeLesson()
//     if (currentLesson < curriculumData[currentModule].lessons.length - 1)
//       selectLesson(currentModule, currentLesson + 1)
//     else if (currentModule < curriculumData.length - 1)
//       selectLesson(currentModule + 1, 0)
//   }

//   const goToPreviousLesson = () => {
//     if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
//     else if (currentModule > 0)
//       selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
//   }

//   const toggleModule = (i: number) =>
//     setExpandedModules(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

//   const selectLesson = async (modIdx: number, lesIdx: number) => {
//     setCurrentModule(modIdx); setCurrentLesson(lesIdx)
//     currentTimeRef.current = 0
//     setIsPlaying(false); setIsMobileSidebarOpen(false)
//     const lesson = curriculumData[modIdx]?.lessons[lesIdx]
//     if (lesson) loadNoteFromDB(lesson.id)
//     setTimeout(() => {
//       if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
//       if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.pause() }
//       forceUpdate(x => x + 1)
//     }, 100)
//     if (lesson && !userProgress[lesson.id]?.completed) {
//       setUserProgress(prev => ({
//         ...prev,
//         [lesson.id]: { ...prev[lesson.id], completed: prev[lesson.id]?.completed || false,
//           progress: prev[lesson.id]?.progress || 0, timeSpent: prev[lesson.id]?.timeSpent || 0,
//           lastPosition: 0, lastAccessedAt: new Date().toISOString() },
//       }))
//       saveProgressToDatabase(lesson.id, { progress: 0, timeSpent: 0, lastPosition: 0 }).catch(() => {})
//     }
//   }

//   const formatTime = (s: number) =>
//     !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

//   const getCurrentLessonData = (): Lesson | null => {
//     const l = curriculumData[currentModule]?.lessons[currentLesson]
//     if (!l) return null
//     const p = userProgress[l.id] || {}
//     return { ...l, watched: p.timeSpent || 0, completed: p.completed || false }
//   }

//   const currentLessonData    = getCurrentLessonData()
//   const currentModuleData    = curriculumData[currentModule]
//   const overallProgress      = calculateOverallProgress()

//   // ── Determine what to show ──────────────────────────────────────────────
//   // We branch exclusively on lesson_type (the real medium field).
//   // video_url being present is the secondary check for video lessons
//   // (in case lesson_type is incorrectly set but url exists).
//   const lt = currentLessonData?.lessonType
//   const isVideoLesson = (lt === 'video') && Boolean(currentLessonData?.videoUrl)
//   const isAudioLesson = (lt === 'audio') && Boolean(currentLessonData?.audioUrl)
//   // All others render text/document content layout
//   const hasMediaPlayer = isVideoLesson || isAudioLesson

//   const lessonMeta = lt ? (LESSON_TYPE_META[lt] ?? LESSON_TYPE_META.text) : LESSON_TYPE_META.text

//   // ── Per-lesson sidebar icon (uses lesson's own lessonType/urls) ─────────
//   const getLessonIcon = (lesson: Lesson, completed?: boolean) => {
//     if (completed) return <CheckCircle2 size={15} className="flex-shrink-0 text-green-500" />
//     const meta = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//     return <meta.Icon size={14} className={`flex-shrink-0 ${meta.color}`} />
//   }

//   useEffect(() => () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }, [])

//   if (!currentLessonData) {
//     return (
//       <div className="flex-1 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
//           <p className="mt-4 text-gray-500 text-sm">Loading lesson…</p>
//         </div>
//       </div>
//     )
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // Sub-components
//   // ─────────────────────────────────────────────────────────────────────────

//   const AxioQuanLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
//     <a href="/" className={`flex items-center gap-2.5 ${size === 'small' ? 'px-1' : 'px-2'}`}>
//       <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
//         <span className="text-white font-bold text-sm">A</span>
//       </div>
//       {size === 'default' && <span className="font-bold text-lg text-foreground">AxioQuan</span>}
//     </a>
//   )

//   const CurriculumList = () => (
//     <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
//       {curriculumData.map((module, modIdx) => {
//         const modProgress = calculateModuleProgress(module)
//         return (
//           <div key={module.id}>
//             <button
//               onClick={() => toggleModule(modIdx)}
//               className="cursor-pointer w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
//             >
//               <div className="flex items-center gap-2.5 flex-1 min-w-0">
//                 <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
//                   <BookOpen size={13} className="text-gray-500" />
//                 </div>
//                 <div className="text-left min-w-0">
//                   <p className="font-semibold text-sm text-foreground truncate">{module.title}</p>
//                   <p className="text-xs text-muted-foreground">{modProgress}% complete</p>
//                 </div>
//               </div>
//               {expandedModules.includes(modIdx)
//                 ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
//                 : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
//             </button>

//             {expandedModules.includes(modIdx) && (
//               <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
//                 {module.lessons.map((lesson, lesIdx) => {
//                   const isActive    = currentModule === modIdx && currentLesson === lesIdx
//                   const isDone      = userProgress[lesson.id]?.completed
//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(modIdx, lesIdx)}
//                       className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
//                         isActive
//                           ? 'bg-primary text-primary-foreground'
//                           : 'hover:bg-gray-50 text-foreground'
//                       }`}
//                     >
//                       <span className="flex-shrink-0">{getLessonIcon(lesson, isDone)}</span>
//                       <span className="flex-1 text-left text-xs leading-snug line-clamp-2">{lesson.title}</span>
//                       {lesson.duration > 0 && !isDone && (
//                         <span className={`text-xs flex-shrink-0 flex items-center gap-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
//                           <Clock size={10} />{formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )

//   const MobileSidebar = () => (
//     <>
//       {isMobileSidebarOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)} />
//       )}
//       <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden shadow-2xl
//         ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <AxioQuanLogo />
//             <button onClick={() => setIsMobileSidebarOpen(false)}
//               className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <X size={18} />
//             </button>
//           </div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>
//     </>
//   )

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="flex min-h-screen bg-background">
//       <MobileSidebar />

//       {/* Desktop sidebar */}
//       <div className="hidden md:flex w-80 bg-white border-r border-border flex-col fixed left-0 top-0 bottom-0 z-30">
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="mb-3"><AxioQuanLogo /></div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>

//       {/* Main area */}
//       <div className="flex-1 md:ml-80 w-full min-h-screen flex flex-col">

//         {/* Mobile top bar */}
//         <div className="md:hidden bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <AxioQuanLogo size="small" />
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-muted-foreground truncate">{currentModuleData?.title}</p>
//               <p className="font-semibold text-sm truncate">{currentLessonData.title}</p>
//             </div>
//           </div>
//         </div>

//         {/* Floating mobile menu */}
//         <button
//           onClick={() => setIsMobileSidebarOpen(true)}
//           className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl z-40"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Course header (desktop only) */}
//         <div className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{courseData?.title || 'Course'}</h1>
//             {courseData?.short_description && (
//               <p className="text-gray-500 text-sm">{courseData.short_description}</p>
//             )}
//             <p className="text-gray-400 text-xs mt-0.5">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             VIDEO PLAYER — only when lessonType='video' AND videoUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isVideoLesson && (
//           <div className="bg-white border-b border-gray-100 flex-shrink-0">
//             {/* White section with generous padding so the video breathes */}
//             <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
//               {/* Dark rounded card — video sits inside with shadow */}
//               <div
//                 className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
//                 style={{ background: '#0f0f0f' }}
//               >
//                 <video
//                   key={currentLessonData.videoUrl!}
//                   ref={videoRef}
//                   className="w-full aspect-video object-contain"
//                   controls
//                   playsInline
//                   poster={currentLessonData.videoThumbnail ?? undefined}
//                   onTimeUpdate={() => {
//                     if (!videoRef.current) return
//                     currentTimeRef.current = videoRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onLoadedMetadata={() => {
//                     if (videoRef.current) setVideoDuration(videoRef.current.duration)
//                   }}
//                   onEnded={() => {
//                     setIsPlaying(false)
//                     const pct = currentLessonData.duration > 0
//                       ? (currentTimeRef.current / currentLessonData.duration) * 100
//                       : 100
//                     if (pct >= 90) completeLesson()
//                   }}
//                   onPlay={() => setIsPlaying(true)}
//                   onPause={() => setIsPlaying(false)}
//                 >
//                   <source src={currentLessonData.videoUrl!} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//               {isSaving && (
//                 <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
//                   <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
//                   Saving progress…
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             AUDIO PLAYER — lessonType='audio' AND audioUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isAudioLesson && (
//           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
//               <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
//                     <Music className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
//                       Audio Lesson
//                     </p>
//                     <h3 className="text-white font-bold text-lg leading-tight">{currentLessonData.title}</h3>
//                   </div>
//                 </div>
//                 <audio
//                   key={currentLessonData.audioUrl!}
//                   ref={audioRef}
//                   className="w-full"
//                   controls
//                   onTimeUpdate={() => {
//                     if (!audioRef.current) return
//                     currentTimeRef.current = audioRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onEnded={() => completeLesson()}
//                 >
//                   <source src={currentLessonData.audioUrl!} />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             Progress bar
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-3 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <div className="flex items-center justify-between mb-1.5">
//               <span className="text-xs font-semibold text-gray-600">Course Progress</span>
//               <span className="text-xs font-bold text-primary">{overallProgress}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2">
//               <div
//                 className="bg-primary rounded-full h-2 transition-all duration-700"
//                 style={{ width: `${overallProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Lesson header + Mark Complete
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-4 justify-between flex-col md:flex-row">
//             <div className="min-w-0">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//                 {currentModuleData?.title}
//               </p>
//               <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
//                 {currentLessonData.title}
//               </h2>
//               <div className="flex flex-wrap items-center gap-2.5">
//                 {/* Lesson type badge */}
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${lessonMeta.bgColor} ${lessonMeta.color}`}>
//                   <lessonMeta.Icon size={12} />
//                   {lessonMeta.label}
//                 </span>
//                 {currentLessonData.difficulty && (
//                   <span className="text-xs text-gray-400 capitalize">{currentLessonData.difficulty}</span>
//                 )}
//                 {currentLessonData.duration > 0 && (
//                   <span className="flex items-center gap-1 text-xs text-gray-400">
//                     <Clock size={11} />{formatTime(currentLessonData.duration)}
//                   </span>
//                 )}
//                 {isVideoLesson && (
//                   <span className="text-xs text-gray-400 flex items-center gap-1">
//                     <Video size={11} /> Video
//                   </span>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => completeLesson()}
//               disabled={userProgress[currentLessonData.id]?.completed || isSaving}
//               className={`flex-shrink-0 w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
//                 userProgress[currentLessonData.id]?.completed
//                   ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
//                   : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
//               }`}
//             >
//               {userProgress[currentLessonData.id]?.completed ? (
//                 <><CheckCircle2 size={16} />Completed</>
//               ) : isSaving ? (
//                 <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
//               ) : (
//                 'Mark Complete'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Tabs
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border flex-shrink-0 sticky top-0 z-20">
//           <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0 overflow-x-auto">
//             {(['overview', 'notes', 'resources'] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`cursor-pointer px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* File viewer modal */}
//         {showFileViewer && selectedFile && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-6xl h-[90vh]">
//               <FileViewer
//                 file={selectedFile}
//                 onClose={() => setShowFileViewer(false)}
//                 onNext={handleNextFile}
//                 onPrev={handlePrevFile}
//                 showNavigation={courseResources.length > 1}
//               />
//             </div>
//           </div>
//         )}

//         {/* ─── Tab content ────────────────────────────────────────────── */}
//         <div className="flex-1 bg-gray-50">
//           <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

//             {/* ── OVERVIEW ─────────────────────────────────────────────── */}
//             {activeTab === 'overview' && (
//               <div className="space-y-8">

//                 {/* Description */}
//                 {currentLessonData.description && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Lightbulb className="w-4 h-4 text-amber-500" />
//                       <h3 className="font-bold text-gray-900 text-sm">About this lesson</h3>
//                     </div>
//                     <p className="text-gray-600 leading-relaxed text-[15px]">
//                       {currentLessonData.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ─────────────────────────────────────────────────────
//                     VIDEO lesson → objectives + bookmarks
//                     All other lesson types → full content body
//                 ───────────────────────────────────────────────────── */}
//                 {hasMediaPlayer ? (
//                   /* ── Video/Audio: objectives + bookmarks ──────────── */
//                   <div className="space-y-6">
//                     {/* Module learning objectives */}
//                     {currentModuleData?.learningObjectives?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <GraduationCap className="w-4 h-4 text-indigo-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Learning Objectives</h3>
//                         </div>
//                         <ul className="space-y-2.5">
//                           {currentModuleData.learningObjectives.map((obj, i) => (
//                             <li key={i} className="flex items-start gap-3">
//                               <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
//                               <span className="text-gray-600 text-[15px] leading-relaxed">{obj}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Module key concepts */}
//                     {currentModuleData?.keyConcepts?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Lightbulb className="w-4 h-4 text-yellow-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Key Concepts</h3>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {currentModuleData.keyConcepts.map((concept, i) => (
//                             <span key={i}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
//                               <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{concept}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Bookmarks (only relevant for video) */}
//                     {isVideoLesson && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Bookmark className="w-4 h-4 text-blue-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Video Bookmarks</h3>
//                         </div>
//                         {bookmarkedTimes.length > 0 ? (
//                           <div className="space-y-2">
//                             {bookmarkedTimes.map((t, i) => (
//                               <button
//                                 key={i}
//                                 onClick={() => {
//                                   currentTimeRef.current = t
//                                   if (videoRef.current) videoRef.current.currentTime = t
//                                   forceUpdate(x => x + 1)
//                                 }}
//                                 className="cursor-pointer w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition flex items-center gap-3"
//                               >
//                                 <Bookmark size={13} className="text-blue-400 flex-shrink-0" />
//                                 <span className="font-mono font-semibold text-sm text-gray-800">{formatTime(t)}</span>
//                                 <span className="text-xs text-gray-400">Bookmark {i + 1}</span>
//                               </button>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-400 text-center py-3">
//                             No bookmarks yet. Use the video player to add them.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   /* ── Text/Document/Quiz/etc: full lesson content ─── */
//                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className={`px-6 py-4 border-b border-gray-50 flex items-center gap-3 ${lessonMeta.bgColor}`}>
//                       <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
//                         <lessonMeta.Icon className={`w-4 h-4 ${lessonMeta.color}`} />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 text-sm">{lessonMeta.label}</p>
//                         <p className="text-xs text-gray-500">
//                           {hasHtmlContent(currentLessonData.contentHtml)
//                             ? `~${readTimeMinutes(currentLessonData.contentHtml)} min read`
//                             : 'Study material below'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="p-6 md:p-8">
//                       <LessonContent
//                         lesson={currentLessonData}
//                         module={currentModuleData}
//                         courseResources={courseResources}
//                         onViewFile={(resource, index) => {
//                           setSelectedFile(resource)
//                           setCurrentFileIndex(index)
//                           setShowFileViewer(true)
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── NOTES ────────────────────────────────────────────────── */}
//             {activeTab === 'notes' && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       Notes are saved per lesson and persist forever — even after refresh or closing the browser.
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     {notesSaveStatus === 'saving' && (
//                       <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
//                         <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
//                         Saving…
//                       </span>
//                     )}
//                     {notesSaveStatus === 'saved' && (
//                       <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
//                         <Save size={12} /> Saved
//                       </span>
//                     )}
//                     <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                       {notes.split(/\s+/).filter(Boolean).length} words
//                     </span>
//                   </div>
//                 </div>

//                 {/* Lesson selector hint */}
//                 <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm">
//                   <BookMarked className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//                   <span className="text-indigo-700">
//                     Showing notes for: <strong>{currentLessonData?.title}</strong>
//                   </span>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                   {/* Mini toolbar */}
//                   <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
//                     {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, i) => (
//                       <button key={i}
//                         className="cursor-pointer p-1.5 rounded hover:bg-gray-200 transition text-gray-500 hover:text-gray-800"
//                         title="Tip: These buttons are visual hints — just type your notes freely below">
//                         <Icon size={14} />
//                       </button>
//                     ))}
//                     <div className="flex-1" />
//                     <span className="text-[10px] text-gray-300 font-medium pr-1">Auto-saved to browser storage</span>
//                   </div>

//                   {/* Textarea */}
//                   <textarea
//                     value={notes}
//                     onChange={e => handleNotesChange(e.target.value)}
//                     placeholder={"Start typing your notes for this lesson…\n\n• Key concepts\n• Questions to review later\n• Insights and observations\n\nNotes are saved automatically and persist forever, even after refresh."}
//                     className="w-full min-h-[460px] p-5 bg-white text-gray-800 placeholder-gray-300 focus:outline-none text-[15px] leading-relaxed resize-y font-sans"
//                   />

//                   {/* Footer */}
//                   <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/60">
//                     <div className="flex items-center gap-2 text-xs text-gray-400">
//                       <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
//                       Stored in IndexedDB — survives refresh, cache clear, and browser restart
//                     </div>
//                     <span className="text-xs text-gray-400">{notes.length} chars</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── RESOURCES ────────────────────────────────────────────── */}
//             {activeTab === 'resources' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-bold text-foreground">Course Resources</h3>

//                 {/* ── COURSE-LEVEL MATERIALS (from course creation) ──────────── */}
//                 {courseData?.materials_url && (
//                   <CourseMaterialsCard
//                     url={courseData.materials_url}
//                     courseTitle={courseData.title || 'Course Materials'}
//                   />
//                 )}

//                 {courseResources.length > 0 ? (
//                   <>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {[
//                         { label: 'Total Files',   value: courseResources.length, bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-500' },
//                         { label: 'PDFs',          value: pdfResources.length,    bg: 'bg-green-50',  text: 'text-green-700',  sub: 'text-green-500' },
//                         { label: 'Other',         value: otherResources.length,  bg: 'bg-violet-50', text: 'text-violet-700', sub: 'text-violet-500' },
//                         { label: 'Modules',       value: new Set(courseResources.map(r => r.moduleTitle)).size, bg: 'bg-amber-50', text: 'text-amber-700', sub: 'text-amber-500' },
//                       ].map(s => (
//                         <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
//                           <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
//                           <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Desktop table */}
//                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hidden md:block overflow-hidden">
//                       <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
//                         <span className="font-semibold text-sm text-gray-900">All Resources</span>
//                         <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                           {courseResources.length} files
//                         </span>
//                       </div>
//                       <table className="w-full">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             {['File', 'Type', 'Source', 'Size', 'Actions'].map(h => (
//                               <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                           {courseResources.map((resource, idx) => (
//                             <tr key={resource.id} className="hover:bg-gray-50/60 transition-colors">
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2.5">
//                                   <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">{getFileIcon(resource.type)}</div>
//                                   <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{resource.name}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resource.type}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <p className="text-sm text-gray-600 truncate max-w-[160px]">{resource.lessonTitle}</p>
//                                 <p className="text-xs text-gray-400">{resource.moduleTitle}</p>
//                               </td>
//                               <td className="py-3 px-4 text-sm text-gray-500">
//                                 {resource.size ? formatFileSize(resource.size) : '—'}
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex gap-1.5">
//                                   <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                     className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
//                                     <Eye size={11} /> View
//                                   </button>
//                                   <a href={resource.url} download={resource.name}
//                                     className="inline-flex items-center gap-1 text-green-700 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
//                                     <Download size={11} /> Download
//                                   </a>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden space-y-2.5">
//                       {courseResources.map((resource, idx) => (
//                         <div key={resource.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{getFileIcon(resource.type)}</div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
//                               <p className="text-xs text-gray-400 mt-0.5">{resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}</p>
//                               <div className="flex gap-2 mt-2.5">
//                                 <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                   className="cursor-pointer text-xs text-indigo-600 font-medium px-2.5 py-1.5 bg-indigo-50 rounded-lg">View</button>
//                                 <a href={resource.url} download={resource.name}
//                                   className="text-xs text-green-700 font-medium px-2.5 py-1.5 bg-green-50 rounded-lg">Download</a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex flex-wrap gap-3 pt-2">
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Bulk download will be available in a future update.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//                         <Archive className="w-4 h-4" /> Download All as ZIP
//                       </button>
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Print resources feature coming soon.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
//                         <Printer className="w-4 h-4" /> Print All
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   !courseData?.materials_url && (
//                     <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
//                       <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
//                       <h4 className="font-semibold text-gray-700 mb-1">No Resources Yet</h4>
//                       <p className="text-sm text-gray-400">The instructor hasn't added any downloadable resources yet.</p>
//                     </div>
//                   )
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="bg-white border-t border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-3 flex-col md:flex-row">
//             <button
//               onClick={goToPreviousLesson}
//               disabled={currentModule === 0 && currentLesson === 0}
//               className="cursor-pointer px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition disabled:opacity-40 font-semibold text-sm"
//             >
//               ← Previous Lesson
//             </button>
//             <button
//               onClick={goToNextLesson}
//               disabled={
//                 currentModule === curriculumData.length - 1 &&
//                 currentLesson === curriculumData[currentModule]?.lessons.length - 1
//               }
//               className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 font-semibold text-sm"
//             >
//               Next Lesson →
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }





































// 'use client'
// // /src/components/courses/course-learning.tsx
// //
// // Key corrections vs previous version:
// // ─ lesson_type (not content_type) determines the lesson medium
// //   Values: 'video'|'text'|'document'|'quiz'|'assignment'|
// //           'live_session'|'audio'|'interactive'|'code'|'discussion'
// // ─ content_type is 'free'|'premium'|'trial' — access control only
// // ─ content_html is the real WYSIWYG field name
// // ─ Video viewport only renders when lesson has a real video_url
// // ─ All lesson types get appropriate content displays
// // ─ Module learning_objectives and key_concepts displayed
// // ─ audio lessons get audio player
// // ─ recommended_readings displayed for text/document lessons

// import { useState, useEffect, useRef } from 'react'
// import Link from 'next/link'
// import {
//   ChevronDown, ChevronUp, Bookmark, CheckCircle2, BookOpen,
//   Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
//   LayoutDashboard, Menu, X, Clock, FileText, Video, Download,
//   Eye, Archive, Printer, ExternalLink, BookMarked, AlignLeft,
//   GraduationCap, Lightbulb, Hash, Music, Code2, MessageSquare,
//   Calendar, Puzzle, ClipboardList, ChevronRight, Save, Package,
// } from 'lucide-react'
// import { toast } from '@/hooks/use-toast'
// import FileViewer from '@/components/courses/file-viewer'

// // ─── Helpers ─────────────────────────────────────────────────────────────────

// const formatFileSize = (bytes: number | null): string => {
//   if (!bytes) return 'Unknown size'
//   const sizes = ['Bytes', 'KB', 'MB', 'GB']
//   if (bytes === 0) return '0 Bytes'
//   const i = Math.floor(Math.log(bytes) / Math.log(1024))
//   return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
// }

// const getFileIcon = (type: string) => {
//   const t = type.toLowerCase()
//   if (t.includes('pdf'))    return '📄'
//   if (t.includes('word') || t.includes('doc'))  return '📝'
//   if (t.includes('excel') || t.includes('sheet') || t.includes('csv')) return '📊'
//   if (t.includes('powerpoint') || t.includes('presentation')) return '📈'
//   if (t.includes('image'))  return '🖼️'
//   if (t.includes('video'))  return '🎬'
//   if (t.includes('audio'))  return '🎵'
//   if (t.includes('zip') || t.includes('archive') || t.includes('rar')) return '🗜️'
//   if (t.includes('code') || t.includes('json') || t.includes('xml'))   return '💻'
//   return '📁'
// }

// const hasHtmlContent = (html: string | null | undefined): boolean => {
//   if (!html) return false
//   return html.replace(/<[^>]*>/g, '').trim().length > 0
// }

// // Approximate read time in minutes
// const readTimeMinutes = (html: string | null | undefined): number => {
//   if (!html) return 1
//   const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
//   return Math.max(1, Math.ceil(words / 200))
// }

// // ─── Types ────────────────────────────────────────────────────────────────────
// // These match exactly what learn-page.tsx pushes into curriculumData

// type LessonType =
//   | 'video' | 'text' | 'document' | 'quiz' | 'assignment'
//   | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion'

// interface Lesson {
//   id:           string
//   title:        string
//   description?: string | null
//   lessonType:   LessonType   // the actual medium — THIS is what we branch on
//   contentType:  string       // 'free'|'premium'|'trial' — access control only
//   difficulty?:  string | null
//   // ── Rich text body ────────────────────────────────────────────────────
//   contentHtml?: string | null
//   // ── Video ─────────────────────────────────────────────────────────────
//   videoUrl?:       string | null
//   videoDuration?:  number
//   videoThumbnail?: string | null
//   // ── Audio ─────────────────────────────────────────────────────────────
//   audioUrl?:      string | null
//   audioDuration?: number
//   // ── Document ──────────────────────────────────────────────────────────
//   documentUrl?:  string | null
//   documentType?: string | null
//   documentSize?: number | null
//   // ── Supplementary ─────────────────────────────────────────────────────
//   externalLinks?:            any
//   downloadableResources?:    string[]
//   attachedFiles?:            string[]
//   recommendedReadings?:      string[]
//   hasDownloadableResources?: boolean
//   // ── Display ───────────────────────────────────────────────────────────
//   duration:  number
//   order:     number
//   isPreview: boolean
//   // ── Progress (merged in by getCurrentLessonData) ───────────────────────
//   watched?:    number
//   completed?:  boolean
// }

// interface Module {
//   id:                 string
//   title:              string
//   description?:       string | null
//   order:              number
//   learningObjectives: string[]
//   keyConcepts:        string[]
//   lessons:            Lesson[]
// }

// interface UserProgress {
//   [lessonId: string]: {
//     completed:      boolean
//     progress:       number
//     timeSpent:      number
//     lastPosition:   number
//     lastAccessedAt: string | null
//   }
// }

// interface CourseResource {
//   id:           string
//   name:         string
//   url:          string
//   type:         string
//   size:         number | null
//   lessonTitle:  string
//   moduleTitle:  string
//   isPdf?:       boolean
// }

// interface CourseLearningProps {
//   courseId:             string
//   courseData:           any
//   curriculumData:       Module[]
//   enrollmentData?:      any
//   userId:               string
//   initialUserProgress?: UserProgress
//   courseResources?:     CourseResource[]
// }

// // ─── Lesson type metadata ────────────────────────────────────────────────────

// const LESSON_TYPE_META: Record<LessonType, { label: string; color: string; bgColor: string; Icon: any }> = {
//   video:        { label: 'Video Lesson',       color: 'text-blue-600',   bgColor: 'bg-blue-50',   Icon: Video },
//   audio:        { label: 'Audio Lesson',        color: 'text-violet-600', bgColor: 'bg-violet-50', Icon: Music },
//   text:         { label: 'Reading',             color: 'text-indigo-600', bgColor: 'bg-indigo-50', Icon: BookMarked },
//   document:     { label: 'Document',            color: 'text-amber-600',  bgColor: 'bg-amber-50',  Icon: FileText },
//   quiz:         { label: 'Quiz',                color: 'text-orange-600', bgColor: 'bg-orange-50', Icon: ClipboardList },
//   assignment:   { label: 'Assignment',          color: 'text-rose-600',   bgColor: 'bg-rose-50',   Icon: ClipboardList },
//   live_session: { label: 'Live Session',        color: 'text-green-600',  bgColor: 'bg-green-50',  Icon: Calendar },
//   interactive:  { label: 'Interactive Lesson',  color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   Icon: Puzzle },
//   code:         { label: 'Code Exercise',       color: 'text-slate-600',  bgColor: 'bg-slate-50',  Icon: Code2 },
//   discussion:   { label: 'Discussion',          color: 'text-teal-600',   bgColor: 'bg-teal-50',   Icon: MessageSquare },
// }

// // ─── LessonContent ────────────────────────────────────────────────────────────
// // Renders the body for non-video lessons (text, document, audio, code, etc.)

// interface LessonContentProps {
//   lesson:          Lesson
//   module:          Module
//   courseResources: CourseResource[]
//   onViewFile:      (resource: CourseResource, index: number) => void
// }

// function LessonContent({ lesson, module, courseResources, onViewFile }: LessonContentProps) {
//   const meta         = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//   const hasContent   = hasHtmlContent(lesson.contentHtml)
//   const hasDocument  = Boolean(lesson.documentUrl)
//   const hasExtLinks  = Array.isArray(lesson.externalLinks) && lesson.externalLinks.length > 0
//   const hasReadings  = Array.isArray(lesson.recommendedReadings) && lesson.recommendedReadings.length > 0
//   const lessonFiles  = courseResources.filter(r => r.lessonTitle === lesson.title)
//   const hasFiles     = lessonFiles.length > 0
//   const hasModuleObjectives = module.learningObjectives?.length > 0
//   const hasModuleKeyConcepts = module.keyConcepts?.length > 0
//   const [docExpanded, setDocExpanded] = useState(true)

//   // Inject CSS into <head> once — guarantees styles survive SSR/hydration
//   useEffect(() => {
//     const id = 'axioquan-lesson-body-styles'
//     if (document.getElementById(id)) return
//     const tag = document.createElement('style')
//     tag.id = id
//     tag.textContent = `
//       .lesson-body{color:#374151;font-size:15px;line-height:1.8;word-break:break-word}
//       .lesson-body *{box-sizing:border-box}

//       /* ── Paragraphs ── */
//       .lesson-body p{margin:0 0 1.4em 0 !important;line-height:1.85 !important;color:#374151}
//       .lesson-body p:last-child{margin-bottom:0 !important}

//       /* ── Headings ── */
//       .lesson-body h1,.lesson-body h2,.lesson-body h3,
//       .lesson-body h4,.lesson-body h5,.lesson-body h6{
//         font-weight:700;color:#111827;letter-spacing:-0.02em;
//         line-height:1.3;margin:2em 0 0.65em 0 !important}
//       .lesson-body h1{font-size:1.8rem}
//       .lesson-body h2{font-size:1.4rem;border-bottom:2px solid #f3f4f6;padding-bottom:0.4em}
//       .lesson-body h3{font-size:1.18rem;color:#1f2937}
//       .lesson-body h4{font-size:1.05rem;color:#374151}
//       .lesson-body h5,.lesson-body h6{font-size:1rem;color:#4b5563}
//       .lesson-body h1:first-child,.lesson-body h2:first-child,
//       .lesson-body h3:first-child{margin-top:0 !important}

//       /* ── Lists ── */
//       .lesson-body ul,.lesson-body ol{padding-left:1.7em;margin:0 0 1.4em 0 !important}
//       .lesson-body ul{list-style-type:disc}
//       .lesson-body ol{list-style-type:decimal}
//       .lesson-body li{margin-bottom:0.5em !important;line-height:1.75;color:#374151;display:list-item}
//       .lesson-body li::marker{color:#6366f1}
//       .lesson-body li>p{margin-bottom:0.35em !important}
//       .lesson-body ul ul,.lesson-body ol ol,
//       .lesson-body ul ol,.lesson-body ol ul{margin:0.4em 0 0.4em 0 !important}

//       /* ── Inline code ── */
//       .lesson-body code{background:#f3f4f6;color:#e11d48;
//         font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
//         font-size:0.875em;padding:0.15em 0.45em;border-radius:5px;
//         border:1px solid #e5e7eb}
//       .lesson-body code::before,.lesson-body code::after{content:none !important}

//       /* ── Code blocks ── */
//       .lesson-body pre{background:#1e293b;color:#e2e8f0;
//         font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
//         font-size:0.875em;line-height:1.65;padding:1.25em 1.5em;
//         border-radius:12px;overflow-x:auto;margin:0 0 1.5em 0 !important;
//         border:1px solid #334155}
//       .lesson-body pre code{background:none;color:inherit;padding:0;
//         border:none;border-radius:0;font-size:1em}

//       /* ── Blockquote ── */
//       .lesson-body blockquote{border-left:4px solid #6366f1;background:#eef2ff;
//         margin:1.5em 0 !important;padding:1em 1.25em;
//         border-radius:0 10px 10px 0;color:#4338ca;font-style:normal}
//       .lesson-body blockquote p{margin-bottom:0 !important;color:#4338ca}

//       /* ── Links ── */
//       .lesson-body a{color:#4f46e5;font-weight:500;text-decoration:none;
//         border-bottom:1px solid #c7d2fe;transition:color .15s,border-color .15s}
//       .lesson-body a:hover{color:#3730a3;border-bottom-color:#6366f1}

//       /* ── Inline styling ── */
//       .lesson-body strong,.lesson-body b{font-weight:700;color:#111827}
//       .lesson-body em,.lesson-body i{font-style:italic}
//       .lesson-body u{text-decoration:underline;text-underline-offset:3px}
//       .lesson-body s,.lesson-body del{text-decoration:line-through;color:#9ca3af}
//       .lesson-body mark{background:#fef9c3;padding:0.1em 0.25em;border-radius:3px}
//       .lesson-body sub{vertical-align:sub;font-size:0.8em}
//       .lesson-body sup{vertical-align:super;font-size:0.8em}

//       /* ── HR ── */
//       .lesson-body hr{border:none;border-top:2px solid #f3f4f6;margin:2em 0 !important}

//       /* ── Images ── */
//       .lesson-body img{max-width:100%;height:auto;border-radius:10px;
//         box-shadow:0 4px 16px rgba(0,0,0,.08);margin:1.25em auto !important;display:block}

//       /* ── Tables ── */
//       .lesson-body table{width:100%;border-collapse:collapse;font-size:0.9em;
//         margin:0 0 1.5em 0 !important;border-radius:10px;overflow:hidden;
//         border:1px solid #e5e7eb}
//       .lesson-body thead{background:#f9fafb}
//       .lesson-body th{padding:0.65em 1em;text-align:left;font-weight:600;
//         color:#374151;font-size:0.8em;text-transform:uppercase;
//         letter-spacing:0.05em;border-bottom:2px solid #e5e7eb}
//       .lesson-body td{padding:0.6em 1em;color:#374151;
//         border-bottom:1px solid #f3f4f6;vertical-align:top}
//       .lesson-body tbody tr:last-child td{border-bottom:none}
//       .lesson-body tbody tr:hover{background:#f9fafb}

//       /* ── Dividers / spacers that WYSIWYG editors output ── */
//       .lesson-body div{margin-bottom:0}
//       .lesson-body br+br{display:block;margin:0.8em 0;content:""}

//       /* ── Iframes ── */
//       .lesson-body iframe{width:100%;border-radius:10px;
//         margin:1.25em 0 !important;border:none}
//     `
//     document.head.appendChild(tag)
//     return () => { /* keep styles across lesson switches */ }
//   }, [])

//   const nothing = !hasContent && !hasDocument && !hasExtLinks && !hasReadings && !hasFiles

//   if (nothing) {
//     return (
//       <div className="flex flex-col items-center justify-center py-20 text-center">
//         <div className={`w-16 h-16 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-4`}>
//           <meta.Icon className={`w-8 h-8 ${meta.color}`} />
//         </div>
//         <h3 className="text-lg font-semibold text-gray-700 mb-1">No content yet</h3>
//         <p className="text-sm text-gray-400 max-w-sm">
//           The instructor hasn't added content for this lesson. Check back later or explore the Resources tab.
//         </p>
//       </div>
//     )
//   }

//   // Detect if document is a PDF (can be embedded inline)
//   const isPdf = lesson.documentType?.toLowerCase().includes('pdf')
//     || lesson.documentUrl?.toLowerCase().endsWith('.pdf')

//   return (
//     <div className="space-y-10">

//       {/* ── RICH HTML BODY ────────────────────────────────────────────────── */}
//       {hasContent && (
//         <section>
//           <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
//             <AlignLeft className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Lesson Content</span>
//             <span className="ml-auto text-xs text-gray-400">~{readTimeMinutes(lesson.contentHtml)} min read</span>
//           </div>
//           {/* lesson-body styles are injected into <head> via useEffect above */}
//           <div
//             className="lesson-body"
//             dangerouslySetInnerHTML={{ __html: lesson.contentHtml! }}
//           />
//         </section>
//       )}

//       {/* ── DOCUMENT VIEWER (document_url) ───────────────────────────────── */}
//       {hasDocument && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
//               Attached Document
//             </span>
//             {lesson.documentSize && (
//               <span className="text-xs text-gray-400 ml-auto">{formatFileSize(lesson.documentSize)}</span>
//             )}
//           </div>

//           {/* Document action bar */}
//           <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-3">
//             <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
//               {isPdf ? '📄' : '📎'}
//             </div>
//             <div className="flex-1 min-w-0">
//               <p className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</p>
//               <p className="text-xs text-gray-500 mt-0.5">
//                 {lesson.documentType || 'Document'}
//                 {lesson.documentSize ? ` · ${formatFileSize(lesson.documentSize)}` : ''}
//               </p>
//             </div>
//             <div className="flex items-center gap-2 flex-shrink-0">
//               {/* Toggle inline view */}
//               <button
//                 onClick={() => setDocExpanded(v => !v)}
//                 className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
//               >
//                 <Eye className="w-3.5 h-3.5" />
//                 {docExpanded ? 'Collapse' : 'View'}
//               </button>
//               {/* Open in new tab */}
//               <a
//                 href={lesson.documentUrl!}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
//               >
//                 <ExternalLink className="w-3.5 h-3.5" /> Open
//               </a>
//               {/* Download */}
//               <a
//                 href={lesson.documentUrl!}
//                 download
//                 className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
//               >
//                 <Download className="w-3.5 h-3.5" /> Download
//               </a>
//             </div>
//           </div>

//           {/* Inline viewer */}
//           {docExpanded && (
//             <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
//               {isPdf ? (
//                 /* PDF — native browser embed */
//                 <iframe
//                   src={`${lesson.documentUrl!}#toolbar=1&navpanes=1&scrollbar=1`}
//                   className="w-full"
//                   style={{ height: '75vh', minHeight: '500px', border: 'none' }}
//                   title={lesson.title}
//                 />
//               ) : (
//                 /* Non-PDF: try Google Docs viewer as fallback */
//                 <iframe
//                   src={`https://docs.google.com/viewer?url=${encodeURIComponent(lesson.documentUrl!)}&embedded=true`}
//                   className="w-full"
//                   style={{ height: '75vh', minHeight: '500px', border: 'none' }}
//                   title={lesson.title}
//                 />
//               )}
//               {/* Fallback message shown below iframe */}
//               <div className="px-4 py-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
//                 <p className="text-xs text-gray-400">
//                   If the document doesn't load,{' '}
//                   <a href={lesson.documentUrl!} target="_blank" rel="noopener noreferrer"
//                     className="text-indigo-600 font-medium hover:underline">
//                     open it in a new tab
//                   </a>
//                 </p>
//                 <a href={lesson.documentUrl!} download
//                   className="inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-900">
//                   <Download className="w-3 h-3" /> Download
//                 </a>
//               </div>
//             </div>
//           )}
//         </section>
//       )}

//       {/* ── LESSON FILES (from courseResources, filtered by lessonTitle) ──── */}
//       {hasFiles && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Archive className="w-4 h-4 text-violet-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Lesson Files</span>
//             <span className="ml-auto text-xs text-gray-400">
//               {lessonFiles.length} file{lessonFiles.length !== 1 ? 's' : ''}
//             </span>
//           </div>
//           <div className="grid gap-2.5">
//             {lessonFiles.map((resource) => {
//               const globalIdx = courseResources.findIndex(r => r.id === resource.id)
//               return (
//                 <div
//                   key={resource.id}
//                   className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all"
//                 >
//                   <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base shadow-sm">
//                     {getFileIcon(resource.type)}
//                   </div>
//                   <div className="flex-1 min-w-0">
//                     <p className="font-medium text-gray-900 text-sm truncate">{resource.name}</p>
//                     <p className="text-xs text-gray-400">
//                       {resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}
//                     </p>
//                   </div>
//                   <div className="flex gap-1.5 flex-shrink-0">
//                     <button
//                       onClick={() => onViewFile(resource, globalIdx)}
//                       className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
//                     >
//                       <Eye className="w-3 h-3" /> View
//                     </button>
//                     <a
//                       href={resource.url}
//                       download={resource.name}
//                       className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
//                     >
//                       <Download className="w-3 h-3" /> Save
//                     </a>
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </section>
//       )}

//       {/* ── RECOMMENDED READINGS (recommended_readings string[]) ─────────── */}
//       {hasReadings && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
//               Recommended Readings
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {lesson.recommendedReadings!.map((reading, i) => (
//               <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
//                 <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
//                   <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
//                 </div>
//                 <span className="text-sm text-gray-700 leading-relaxed">{reading}</span>
//               </li>
//             ))}
//           </ul>
//         </section>
//       )}

//       {/* ── EXTERNAL LINKS (external_links JSONB) ────────────────────────── */}
//       {hasExtLinks && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <ExternalLink className="w-4 h-4 text-sky-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
//               References & Links
//             </span>
//           </div>
//           <ul className="space-y-2">
//             {(lesson.externalLinks as any[]).map((link: any, i: number) => {
//               const href  = typeof link === 'string' ? link : (link.url || '#')
//               const label = typeof link === 'string' ? link : (link.name || link.title || link.url || href)
//               return (
//                 <li key={i}>
//                   <a
//                     href={href}
//                     target="_blank"
//                     rel="noopener noreferrer"
//                     className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-sky-50 hover:bg-sky-100 hover:border-sky-200 transition-all"
//                   >
//                     <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-100">
//                       <Hash className="w-3.5 h-3.5 text-sky-500" />
//                     </div>
//                     <span className="flex-1 text-sm text-sky-700 group-hover:text-sky-900 font-medium truncate">
//                       {label}
//                     </span>
//                     <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0" />
//                   </a>
//                 </li>
//               )
//             })}
//           </ul>
//         </section>
//       )}

//       {/* ── MODULE KEY CONCEPTS (module.keyConcepts string[]) ────────────── */}
//       {hasModuleKeyConcepts && (
//         <section>
//           <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
//             <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Key Concepts</span>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             {module.keyConcepts.map((concept, i) => (
//               <span
//                 key={i}
//                 className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
//               >
//                 <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
//                 {concept}
//               </span>
//             ))}
//           </div>
//         </section>
//       )}
//     </div>
//   )
// }

// // ─── URL helpers ─────────────────────────────────────────────────────────────
// // Fix duplicated Cloudinary path segments:
// //   /axioquan/documents/axioquan/documents/FILE.pdf → /axioquan/documents/FILE.pdf
// function cleanCdnUrl(raw: string): string {
//   try {
//     const u = new URL(raw)
//     const parts = u.pathname.split('/').filter(Boolean)
//     const deduped: string[] = []
//     for (let i = 0; i < parts.length; i++) {
//       const remaining = parts.slice(i)
//       let found = false
//       for (let k = Math.max(0, deduped.length - remaining.length); k < deduped.length; k++) {
//         const tail = deduped.slice(k)
//         if (tail.length > 0 && tail.every((s, j) => j < remaining.length && s === remaining[j])) {
//           i += tail.length - 1; found = true; break
//         }
//       }
//       if (!found) deduped.push(parts[i])
//     }
//     u.pathname = '/' + deduped.join('/')
//     return u.toString()
//   } catch { return raw }
// }

// // Route file through /api/proxy/document to bypass CORS/X-Frame restrictions
// function proxyUrl(raw: string, mode: 'inline' | 'download', filename?: string): string {
//   const clean = cleanCdnUrl(raw)
//   const fn    = filename ?? clean.split('/').pop()?.split('?')[0] ?? 'document'
//   return `/api/proxy/document?url=${encodeURIComponent(clean)}&mode=${mode}&filename=${encodeURIComponent(fn)}`
// }

// // ─── CourseMaterialsCard ──────────────────────────────────────────────────────
// function CourseMaterialsCard({ url, courseTitle }: { url: string; courseTitle: string }) {
//   const [expanded,    setExpanded]    = useState(false)
//   const [iframeError, setIframeError] = useState(false)
//   const [loading,     setLoading]     = useState(false)

//   const cleanedUrl = cleanCdnUrl(url)
//   const ext        = cleanedUrl.split('?')[0].split('.').pop()?.toLowerCase() ?? ''
//   const isPdf      = ext === 'pdf'
//   const isOffice   = ['doc','docx','ppt','pptx','xls','xlsx'].includes(ext)
//   const isImage    = ['png','jpg','jpeg','gif','webp','svg'].includes(ext)

//   const typeLabel = isPdf ? 'PDF Document'
//     : isOffice ? `${ext.toUpperCase()} File`
//     : isImage  ? 'Image File'
//     : 'Course Document'

//   const emoji = isPdf ? '📄'
//     : ['doc','docx'].includes(ext) ? '📝'
//     : ['ppt','pptx'].includes(ext) ? '📊'
//     : ['xls','xlsx'].includes(ext) ? '📈'
//     : isImage ? '🖼️'
//     : '📎'

//   const filename         = cleanedUrl.split('/').pop()?.split('?')[0] ?? 'course-materials'
//   const inlineProxyUrl   = proxyUrl(url, 'inline',   filename)
//   const downloadProxyUrl = proxyUrl(url, 'download', filename)

//   // For office files, let Google Docs Viewer render them (it can use our proxied URL)
//   const viewerSrc = isPdf || isImage
//     ? inlineProxyUrl
//     : `https://docs.google.com/viewer?url=${encodeURIComponent(inlineProxyUrl)}&embedded=true`

//   const handleViewClick = () => {
//     setIframeError(false)
//     setLoading(true)
//     setExpanded(v => !v)
//   }

//   return (
//     <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm overflow-hidden">

//       {/* Header banner */}
//       <div className="flex items-center gap-3 px-5 py-4 bg-indigo-600 text-white">
//         <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
//           {emoji}
//         </div>
//         <div className="flex-1 min-w-0">
//           <div className="flex items-center gap-2 mb-0.5">
//             <Package className="w-3.5 h-3.5 text-indigo-200" />
//             <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
//               Course Materials
//             </span>
//           </div>
//           <p className="font-bold text-white text-base leading-snug truncate">
//             {courseTitle} — Study Materials
//           </p>
//           <p className="text-indigo-200 text-xs mt-0.5">
//             {typeLabel} · Available for the entire course · {filename}
//           </p>
//         </div>
//       </div>

//       {/* Action bar */}
//       <div className="flex flex-wrap items-center gap-3 px-5 py-4 bg-white border-b border-indigo-50">
//         <button
//           onClick={handleViewClick}
//           className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
//         >
//           <Eye className="w-4 h-4" />
//           {expanded ? 'Collapse Viewer' : 'Read / View'}
//         </button>
//         <a
//           href={inlineProxyUrl}
//           target="_blank"
//           rel="noopener noreferrer"
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
//         >
//           <ExternalLink className="w-4 h-4" /> Open in tab
//         </a>
//         <a
//           href={downloadProxyUrl}
//           className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors ml-auto"
//         >
//           <Download className="w-4 h-4" /> Download
//         </a>
//       </div>

//       {/* Inline viewer */}
//       {expanded && (
//         <div className="bg-gray-50">
//           {!iframeError ? (
//             <>
//               {loading && (
//                 <div className="flex items-center justify-center py-10 bg-white">
//                   <div className="flex flex-col items-center gap-3">
//                     <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
//                     <p className="text-sm text-gray-500">Loading {typeLabel}…</p>
//                   </div>
//                 </div>
//               )}
//               <iframe
//                 key={viewerSrc}
//                 src={viewerSrc}
//                 className="w-full"
//                 style={{
//                   height: '80vh',
//                   minHeight: '540px',
//                   border: 'none',
//                   display: loading ? 'none' : 'block',
//                 }}
//                 title={`${courseTitle} — ${filename}`}
//                 allow="fullscreen"
//                 onLoad={() => setLoading(false)}
//                 onError={() => { setLoading(false); setIframeError(true) }}
//               />
//             </>
//           ) : (
//             <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white">
//               <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">{emoji}</div>
//               <h4 className="font-bold text-gray-900 mb-1">Preview unavailable</h4>
//               <p className="text-sm text-gray-500 mb-6 max-w-sm">
//                 The document can't be previewed inline. Use one of the options below to read it.
//               </p>
//               <div className="flex flex-wrap gap-3 justify-center">
//                 <a href={inlineProxyUrl} target="_blank" rel="noopener noreferrer"
//                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
//                   <ExternalLink className="w-4 h-4" /> Open in new tab
//                 </a>
//                 <a href={downloadProxyUrl}
//                   className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
//                   <Download className="w-4 h-4" /> Download file
//                 </a>
//               </div>
//             </div>
//           )}

//           {!iframeError && !loading && (
//             <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
//               <p className="text-xs text-gray-400">
//                 {isPdf ? 'PDF · Use browser controls to zoom, search, or print.'
//                   : isOffice ? 'Office document via Google Docs Viewer.'
//                   : 'Document viewer'}
//               </p>
//               <a href={downloadProxyUrl}
//                 className="inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-900">
//                 <Download className="w-3 h-3" /> Save a copy
//               </a>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   )
// }

// // ─── Main Component ───────────────────────────────────────────────────────────

// export default function CourseLearningPage({
//   courseId,
//   courseData,
//   curriculumData,
//   enrollmentData,
//   userId,
//   initialUserProgress = {},
//   courseResources = [],
// }: CourseLearningProps) {
//   const [currentModule, setCurrentModule]             = useState(0)
//   const [currentLesson, setCurrentLesson]             = useState(0)
//   const [expandedModules, setExpandedModules]         = useState<number[]>([0])
//   const [isPlaying, setIsPlaying]                     = useState(false)
//   const [isMuted, setIsMuted]                         = useState(false)
//   const [bookmarkedTimes, setBookmarkedTimes]         = useState<number[]>([])
//   const [activeTab, setActiveTab]                     = useState<'overview' | 'notes' | 'resources'>('overview')
//   const [notes, setNotes]                             = useState('')
//   const [notesSaveStatus, setNotesSaveStatus]         = useState<'idle'|'saving'|'saved'>('idle')
//   const notesSaveTimer                                 = useRef<NodeJS.Timeout | null>(null)

//   // ── IndexedDB-backed notes (survives all refreshes, no expiry) ─────────────
//   // DB: axioquan_notes  |  Store: notes  |  key: `${userId}::${courseId}::${lessonId}`
//   const openNotesDB = (): Promise<IDBDatabase> => new Promise((res, rej) => {
//     const req = indexedDB.open('axioquan_notes', 1)
//     req.onupgradeneeded = () => req.result.createObjectStore('notes')
//     req.onsuccess = () => res(req.result)
//     req.onerror   = () => rej(req.error)
//   })

//   const loadNoteFromDB = async (lessonId: string) => {
//     try {
//       const db  = await openNotesDB()
//       const key = `${userId}::${courseId}::${lessonId}`
//       const tx  = db.transaction('notes', 'readonly')
//       const req = tx.objectStore('notes').get(key)
//       req.onsuccess = () => setNotes(req.result ?? '')
//     } catch { setNotes('') }
//   }

//   const saveNoteToDB = async (lessonId: string, text: string) => {
//     try {
//       setNotesSaveStatus('saving')
//       const db  = await openNotesDB()
//       const key = `${userId}::${courseId}::${lessonId}`
//       const tx  = db.transaction('notes', 'readwrite')
//       tx.objectStore('notes').put(text, key)
//       tx.oncomplete = () => setNotesSaveStatus('saved')
//     } catch { setNotesSaveStatus('idle') }
//   }

//   const handleNotesChange = (text: string) => {
//     setNotes(text)
//     setNotesSaveStatus('saving')
//     if (notesSaveTimer.current) clearTimeout(notesSaveTimer.current)
//     const lessonId = getCurrentLessonData()?.id
//     if (!lessonId) return
//     notesSaveTimer.current = setTimeout(() => saveNoteToDB(lessonId, text), 600)
//   }
//   const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
//   const [userProgress, setUserProgress]               = useState<UserProgress>(initialUserProgress)
//   const [selectedFile, setSelectedFile]               = useState<CourseResource | null>(null)
//   const [showFileViewer, setShowFileViewer]           = useState(false)
//   const [currentFileIndex, setCurrentFileIndex]       = useState(0)
//   const [videoDuration, setVideoDuration]             = useState(0)
//   const [isSaving, setIsSaving]                       = useState(false)

//   const currentTimeRef     = useRef(0)
//   const [, forceUpdate]    = useState(0)
//   const videoRef           = useRef<HTMLVideoElement>(null)
//   const audioRef           = useRef<HTMLAudioElement>(null)
//   const lastSaveRef        = useRef(0)
//   const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

//   const pdfResources   = courseResources.filter(r => r.type === 'PDF Document')
//   const otherResources = courseResources.filter(r => r.type !== 'PDF Document')

//   const handleNextFile = () => {
//     if (currentFileIndex < courseResources.length - 1) {
//       const n = currentFileIndex + 1
//       setSelectedFile(courseResources[n]); setCurrentFileIndex(n)
//     }
//   }
//   const handlePrevFile = () => {
//     if (currentFileIndex > 0) {
//       const p = currentFileIndex - 1
//       setSelectedFile(courseResources[p]); setCurrentFileIndex(p)
//     }
//   }

//   useEffect(() => { loadUserProgress() }, [courseId, userId])

//   // Load notes for initial lesson on mount
//   useEffect(() => {
//     const lesson = curriculumData[0]?.lessons[0]
//     if (lesson) loadNoteFromDB(lesson.id)
//   }, [])

//   const loadUserProgress = async () => {
//     try {
//       const res = await fetch(`/api/student/progress?courseId=${courseId}`)
//       if (res.ok) {
//         const data = await res.json()
//         const t: UserProgress = {}
//         if (data.progress && typeof data.progress === 'object') {
//           Object.entries(data.progress).forEach(([id, d]: [string, any]) => {
//             t[id] = {
//               completed:      d.is_completed  || d.completed  || false,
//               progress:       d.video_progress || d.progress  || 0,
//               timeSpent:      d.time_spent     || 0,
//               lastPosition:   d.last_position  || 0,
//               lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
//             }
//           })
//         }
//         setUserProgress(t)
//       } else {
//         const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//         if (saved) setUserProgress(JSON.parse(saved))
//       }
//     } catch {
//       const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
//       if (saved) try { setUserProgress(JSON.parse(saved)) } catch {}
//     }
//   }

//   const saveProgressToDatabase = async (lessonId: string, data: {
//     completed?: boolean; progress?: number; timeSpent?: number; lastPosition?: number
//   }) => {
//     try {
//       setIsSaving(true)
//       const res = await fetch('/api/student/progress', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ courseId, lessonId, userId, ...data }),
//       })
//       if (!res.ok) throw new Error('Failed to save')
//       return await res.json()
//     } catch {
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//     } finally {
//       setIsSaving(false)
//     }
//   }

//   useEffect(() => {
//     if (Object.keys(userProgress).length > 0 && userId)
//       localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
//   }, [userProgress, courseId, userId])

//   // Auto-save video/audio progress
//   useEffect(() => {
//     const autoSave = async () => {
//       const lesson = getCurrentLessonData()
//       if (!lesson) return
//       const now = Date.now()
//       const currentTime = currentTimeRef.current
//       if (now - lastSaveRef.current > 30000 && currentTime > 10) {
//         const pct = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0
//         await saveProgressToDatabase(lesson.id, {
//           progress: pct, timeSpent: Math.floor(currentTime), lastPosition: Math.floor(currentTime),
//         })
//         lastSaveRef.current = now
//       }
//     }
//     const id = setInterval(autoSave, 10000)
//     return () => clearInterval(id)
//   }, [courseId, videoDuration])

//   const calculateOverallProgress = () => {
//     let total = 0, done = 0
//     curriculumData.forEach(m => m.lessons.forEach(l => {
//       total++
//       if (userProgress[l.id]?.completed) done++
//     }))
//     return total > 0 ? Math.round((done / total) * 100) : 0
//   }

//   const calculateModuleProgress = (module: Module) => {
//     if (!module.lessons.length) return 0
//     const done = module.lessons.filter(l => userProgress[l.id]?.completed).length
//     return Math.round((done / module.lessons.length) * 100)
//   }

//   const completeLesson = async (lessonId?: string) => {
//     const id = lessonId || getCurrentLessonData()?.id
//     if (!id) return
//     setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
//     await saveProgressToDatabase(id, { completed: true, progress: 100 })
//   }

//   const goToNextLesson = () => {
//     const lesson = getCurrentLessonData()
//     if (lesson && !userProgress[lesson.id]?.completed) completeLesson()
//     if (currentLesson < curriculumData[currentModule].lessons.length - 1)
//       selectLesson(currentModule, currentLesson + 1)
//     else if (currentModule < curriculumData.length - 1)
//       selectLesson(currentModule + 1, 0)
//   }

//   const goToPreviousLesson = () => {
//     if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
//     else if (currentModule > 0)
//       selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
//   }

//   const toggleModule = (i: number) =>
//     setExpandedModules(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

//   const selectLesson = async (modIdx: number, lesIdx: number) => {
//     setCurrentModule(modIdx); setCurrentLesson(lesIdx)
//     currentTimeRef.current = 0
//     setIsPlaying(false); setIsMobileSidebarOpen(false)
//     const lesson = curriculumData[modIdx]?.lessons[lesIdx]
//     if (lesson) loadNoteFromDB(lesson.id)
//     setTimeout(() => {
//       if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
//       if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.pause() }
//       forceUpdate(x => x + 1)
//     }, 100)
//     if (lesson && !userProgress[lesson.id]?.completed) {
//       setUserProgress(prev => ({
//         ...prev,
//         [lesson.id]: { ...prev[lesson.id], completed: prev[lesson.id]?.completed || false,
//           progress: prev[lesson.id]?.progress || 0, timeSpent: prev[lesson.id]?.timeSpent || 0,
//           lastPosition: 0, lastAccessedAt: new Date().toISOString() },
//       }))
//       saveProgressToDatabase(lesson.id, { progress: 0, timeSpent: 0, lastPosition: 0 }).catch(() => {})
//     }
//   }

//   const formatTime = (s: number) =>
//     !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

//   const getCurrentLessonData = (): Lesson | null => {
//     const l = curriculumData[currentModule]?.lessons[currentLesson]
//     if (!l) return null
//     const p = userProgress[l.id] || {}
//     return { ...l, watched: p.timeSpent || 0, completed: p.completed || false }
//   }

//   const currentLessonData    = getCurrentLessonData()
//   const currentModuleData    = curriculumData[currentModule]
//   const overallProgress      = calculateOverallProgress()

//   // ── Determine what to show ──────────────────────────────────────────────
//   // We branch exclusively on lesson_type (the real medium field).
//   // video_url being present is the secondary check for video lessons
//   // (in case lesson_type is incorrectly set but url exists).
//   const lt = currentLessonData?.lessonType
//   const isVideoLesson = (lt === 'video') && Boolean(currentLessonData?.videoUrl)
//   const isAudioLesson = (lt === 'audio') && Boolean(currentLessonData?.audioUrl)
//   // All others render text/document content layout
//   const hasMediaPlayer = isVideoLesson || isAudioLesson

//   const lessonMeta = lt ? (LESSON_TYPE_META[lt] ?? LESSON_TYPE_META.text) : LESSON_TYPE_META.text

//   // ── Per-lesson sidebar icon (uses lesson's own lessonType/urls) ─────────
//   const getLessonIcon = (lesson: Lesson, completed?: boolean) => {
//     if (completed) return <CheckCircle2 size={15} className="flex-shrink-0 text-green-500" />
//     const meta = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
//     return <meta.Icon size={14} className={`flex-shrink-0 ${meta.color}`} />
//   }

//   useEffect(() => () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }, [])

//   if (!currentLessonData) {
//     return (
//       <div className="flex-1 flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
//           <p className="mt-4 text-gray-500 text-sm">Loading lesson…</p>
//         </div>
//       </div>
//     )
//   }

//   // ─────────────────────────────────────────────────────────────────────────
//   // Sub-components
//   // ─────────────────────────────────────────────────────────────────────────

//   const AxioQuanLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
//     <a href="/" className={`flex items-center gap-2.5 ${size === 'small' ? 'px-1' : 'px-2'}`}>
//       <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
//         <span className="text-white font-bold text-sm">A</span>
//       </div>
//       {size === 'default' && <span className="font-bold text-lg text-foreground">AxioQuan</span>}
//     </a>
//   )

//   const CurriculumList = () => (
//     <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
//       {curriculumData.map((module, modIdx) => {
//         const modProgress = calculateModuleProgress(module)
//         return (
//           <div key={module.id}>
//             <button
//               onClick={() => toggleModule(modIdx)}
//               className="cursor-pointer w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
//             >
//               <div className="flex items-center gap-2.5 flex-1 min-w-0">
//                 <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
//                   <BookOpen size={13} className="text-gray-500" />
//                 </div>
//                 <div className="text-left min-w-0">
//                   <p className="font-semibold text-sm text-foreground truncate">{module.title}</p>
//                   <p className="text-xs text-muted-foreground">{modProgress}% complete</p>
//                 </div>
//               </div>
//               {expandedModules.includes(modIdx)
//                 ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
//                 : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
//             </button>

//             {expandedModules.includes(modIdx) && (
//               <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
//                 {module.lessons.map((lesson, lesIdx) => {
//                   const isActive    = currentModule === modIdx && currentLesson === lesIdx
//                   const isDone      = userProgress[lesson.id]?.completed
//                   return (
//                     <button
//                       key={lesson.id}
//                       onClick={() => selectLesson(modIdx, lesIdx)}
//                       className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
//                         isActive
//                           ? 'bg-primary text-primary-foreground'
//                           : 'hover:bg-gray-50 text-foreground'
//                       }`}
//                     >
//                       <span className="flex-shrink-0">{getLessonIcon(lesson, isDone)}</span>
//                       <span className="flex-1 text-left text-xs leading-snug line-clamp-2">{lesson.title}</span>
//                       {lesson.duration > 0 && !isDone && (
//                         <span className={`text-xs flex-shrink-0 flex items-center gap-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
//                           <Clock size={10} />{formatTime(lesson.duration)}
//                         </span>
//                       )}
//                     </button>
//                   )
//                 })}
//               </div>
//             )}
//           </div>
//         )
//       })}
//     </div>
//   )

//   const MobileSidebar = () => (
//     <>
//       {isMobileSidebarOpen && (
//         <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
//           onClick={() => setIsMobileSidebarOpen(false)} />
//       )}
//       <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden shadow-2xl
//         ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="flex items-center justify-between mb-3">
//             <AxioQuanLogo />
//             <button onClick={() => setIsMobileSidebarOpen(false)}
//               className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
//               <X size={18} />
//             </button>
//           </div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>
//     </>
//   )

//   // ─── RENDER ───────────────────────────────────────────────────────────────
//   return (
//     <div className="flex min-h-screen bg-background">
//       <MobileSidebar />

//       {/* Desktop sidebar */}
//       <div className="hidden md:flex w-80 bg-white border-r border-border flex-col fixed left-0 top-0 bottom-0 z-30">
//         <div className="p-4 border-b border-border flex-shrink-0">
//           <div className="mb-3"><AxioQuanLogo /></div>
//           <Link href="/dashboard"
//             className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
//             <LayoutDashboard size={16} className="text-primary" />
//             Back to Dashboard
//           </Link>
//         </div>
//         <CurriculumList />
//       </div>

//       {/* Main area */}
//       <div className="flex-1 md:ml-80 w-full min-h-screen flex flex-col">

//         {/* Mobile top bar */}
//         <div className="md:hidden bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex-shrink-0">
//           <div className="flex items-center gap-3">
//             <AxioQuanLogo size="small" />
//             <div className="flex-1 min-w-0">
//               <p className="text-xs text-muted-foreground truncate">{currentModuleData?.title}</p>
//               <p className="font-semibold text-sm truncate">{currentLessonData.title}</p>
//             </div>
//           </div>
//         </div>

//         {/* Floating mobile menu */}
//         <button
//           onClick={() => setIsMobileSidebarOpen(true)}
//           className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl z-40"
//         >
//           <Menu size={22} />
//         </button>

//         {/* Course header (desktop only) */}
//         <div className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{courseData?.title || 'Course'}</h1>
//             {courseData?.short_description && (
//               <p className="text-gray-500 text-sm">{courseData.short_description}</p>
//             )}
//             <p className="text-gray-400 text-xs mt-0.5">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             VIDEO PLAYER — only when lessonType='video' AND videoUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isVideoLesson && (
//           <div className="bg-white border-b border-gray-100 flex-shrink-0">
//             {/* White section with generous padding so the video breathes */}
//             <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
//               {/* Dark rounded card — video sits inside with shadow */}
//               <div
//                 className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
//                 style={{ background: '#0f0f0f' }}
//               >
//                 <video
//                   key={currentLessonData.videoUrl!}
//                   ref={videoRef}
//                   className="w-full aspect-video object-contain"
//                   controls
//                   playsInline
//                   poster={currentLessonData.videoThumbnail ?? undefined}
//                   onTimeUpdate={() => {
//                     if (!videoRef.current) return
//                     currentTimeRef.current = videoRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onLoadedMetadata={() => {
//                     if (videoRef.current) setVideoDuration(videoRef.current.duration)
//                   }}
//                   onEnded={() => {
//                     setIsPlaying(false)
//                     const pct = currentLessonData.duration > 0
//                       ? (currentTimeRef.current / currentLessonData.duration) * 100
//                       : 100
//                     if (pct >= 90) completeLesson()
//                   }}
//                   onPlay={() => setIsPlaying(true)}
//                   onPause={() => setIsPlaying(false)}
//                 >
//                   <source src={currentLessonData.videoUrl!} type="video/mp4" />
//                   Your browser does not support the video tag.
//                 </video>
//               </div>
//               {isSaving && (
//                 <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
//                   <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
//                   Saving progress…
//                 </p>
//               )}
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             AUDIO PLAYER — lessonType='audio' AND audioUrl exists
//         ════════════════════════════════════════════════════════════════ */}
//         {isAudioLesson && (
//           <div className="bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0">
//             <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
//               <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
//                 <div className="flex items-center gap-4 mb-6">
//                   <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
//                     <Music className="w-7 h-7 text-white" />
//                   </div>
//                   <div>
//                     <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
//                       Audio Lesson
//                     </p>
//                     <h3 className="text-white font-bold text-lg leading-tight">{currentLessonData.title}</h3>
//                   </div>
//                 </div>
//                 <audio
//                   key={currentLessonData.audioUrl!}
//                   ref={audioRef}
//                   className="w-full"
//                   controls
//                   onTimeUpdate={() => {
//                     if (!audioRef.current) return
//                     currentTimeRef.current = audioRef.current.currentTime
//                     forceUpdate(x => x + 1)
//                   }}
//                   onEnded={() => completeLesson()}
//                 >
//                   <source src={currentLessonData.audioUrl!} />
//                   Your browser does not support the audio element.
//                 </audio>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* ═══════════════════════════════════════════════════════════════
//             Progress bar
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-3 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6">
//             <div className="flex items-center justify-between mb-1.5">
//               <span className="text-xs font-semibold text-gray-600">Course Progress</span>
//               <span className="text-xs font-bold text-primary">{overallProgress}%</span>
//             </div>
//             <div className="w-full bg-gray-100 rounded-full h-2">
//               <div
//                 className="bg-primary rounded-full h-2 transition-all duration-700"
//                 style={{ width: `${overallProgress}%` }}
//               />
//             </div>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Lesson header + Mark Complete
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-4 justify-between flex-col md:flex-row">
//             <div className="min-w-0">
//               <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
//                 {currentModuleData?.title}
//               </p>
//               <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
//                 {currentLessonData.title}
//               </h2>
//               <div className="flex flex-wrap items-center gap-2.5">
//                 {/* Lesson type badge */}
//                 <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${lessonMeta.bgColor} ${lessonMeta.color}`}>
//                   <lessonMeta.Icon size={12} />
//                   {lessonMeta.label}
//                 </span>
//                 {currentLessonData.difficulty && (
//                   <span className="text-xs text-gray-400 capitalize">{currentLessonData.difficulty}</span>
//                 )}
//                 {currentLessonData.duration > 0 && (
//                   <span className="flex items-center gap-1 text-xs text-gray-400">
//                     <Clock size={11} />{formatTime(currentLessonData.duration)}
//                   </span>
//                 )}
//                 {isVideoLesson && (
//                   <span className="text-xs text-gray-400 flex items-center gap-1">
//                     <Video size={11} /> Video
//                   </span>
//                 )}
//               </div>
//             </div>
//             <button
//               onClick={() => completeLesson()}
//               disabled={userProgress[currentLessonData.id]?.completed || isSaving}
//               className={`flex-shrink-0 w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
//                 userProgress[currentLessonData.id]?.completed
//                   ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
//                   : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
//               }`}
//             >
//               {userProgress[currentLessonData.id]?.completed ? (
//                 <><CheckCircle2 size={16} />Completed</>
//               ) : isSaving ? (
//                 <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
//               ) : (
//                 'Mark Complete'
//               )}
//             </button>
//           </div>
//         </div>

//         {/* ═══════════════════════════════════════════════════════════════
//             Tabs
//         ════════════════════════════════════════════════════════════════ */}
//         <div className="bg-white border-b border-border flex-shrink-0 sticky top-0 z-20">
//           <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0 overflow-x-auto">
//             {(['overview', 'notes', 'resources'] as const).map(tab => (
//               <button
//                 key={tab}
//                 onClick={() => setActiveTab(tab)}
//                 className={`cursor-pointer px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
//                   activeTab === tab
//                     ? 'border-primary text-primary'
//                     : 'border-transparent text-muted-foreground hover:text-foreground'
//                 }`}
//               >
//                 {tab.charAt(0).toUpperCase() + tab.slice(1)}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* File viewer modal */}
//         {showFileViewer && selectedFile && (
//           <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
//             <div className="w-full max-w-6xl h-[90vh]">
//               <FileViewer
//                 file={selectedFile}
//                 onClose={() => setShowFileViewer(false)}
//                 onNext={handleNextFile}
//                 onPrev={handlePrevFile}
//                 showNavigation={courseResources.length > 1}
//               />
//             </div>
//           </div>
//         )}

//         {/* ─── Tab content ────────────────────────────────────────────── */}
//         <div className="flex-1 bg-gray-50">
//           <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

//             {/* ── OVERVIEW ─────────────────────────────────────────────── */}
//             {activeTab === 'overview' && (
//               <div className="space-y-8">

//                 {/* Description */}
//                 {currentLessonData.description && (
//                   <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                     <div className="flex items-center gap-2 mb-3">
//                       <Lightbulb className="w-4 h-4 text-amber-500" />
//                       <h3 className="font-bold text-gray-900 text-sm">About this lesson</h3>
//                     </div>
//                     <p className="text-gray-600 leading-relaxed text-[15px]">
//                       {currentLessonData.description}
//                     </p>
//                   </div>
//                 )}

//                 {/* ─────────────────────────────────────────────────────
//                     VIDEO lesson → objectives + bookmarks
//                     All other lesson types → full content body
//                 ───────────────────────────────────────────────────── */}
//                 {hasMediaPlayer ? (
//                   /* ── Video/Audio: objectives + bookmarks ──────────── */
//                   <div className="space-y-6">
//                     {/* Module learning objectives */}
//                     {currentModuleData?.learningObjectives?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <GraduationCap className="w-4 h-4 text-indigo-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Learning Objectives</h3>
//                         </div>
//                         <ul className="space-y-2.5">
//                           {currentModuleData.learningObjectives.map((obj, i) => (
//                             <li key={i} className="flex items-start gap-3">
//                               <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
//                               <span className="text-gray-600 text-[15px] leading-relaxed">{obj}</span>
//                             </li>
//                           ))}
//                         </ul>
//                       </div>
//                     )}

//                     {/* Module key concepts */}
//                     {currentModuleData?.keyConcepts?.length > 0 && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Lightbulb className="w-4 h-4 text-yellow-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Key Concepts</h3>
//                         </div>
//                         <div className="flex flex-wrap gap-2">
//                           {currentModuleData.keyConcepts.map((concept, i) => (
//                             <span key={i}
//                               className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
//                               <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{concept}
//                             </span>
//                           ))}
//                         </div>
//                       </div>
//                     )}

//                     {/* Bookmarks (only relevant for video) */}
//                     {isVideoLesson && (
//                       <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
//                         <div className="flex items-center gap-2 mb-4">
//                           <Bookmark className="w-4 h-4 text-blue-500" />
//                           <h3 className="font-bold text-gray-900 text-sm">Video Bookmarks</h3>
//                         </div>
//                         {bookmarkedTimes.length > 0 ? (
//                           <div className="space-y-2">
//                             {bookmarkedTimes.map((t, i) => (
//                               <button
//                                 key={i}
//                                 onClick={() => {
//                                   currentTimeRef.current = t
//                                   if (videoRef.current) videoRef.current.currentTime = t
//                                   forceUpdate(x => x + 1)
//                                 }}
//                                 className="cursor-pointer w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition flex items-center gap-3"
//                               >
//                                 <Bookmark size={13} className="text-blue-400 flex-shrink-0" />
//                                 <span className="font-mono font-semibold text-sm text-gray-800">{formatTime(t)}</span>
//                                 <span className="text-xs text-gray-400">Bookmark {i + 1}</span>
//                               </button>
//                             ))}
//                           </div>
//                         ) : (
//                           <p className="text-sm text-gray-400 text-center py-3">
//                             No bookmarks yet. Use the video player to add them.
//                           </p>
//                         )}
//                       </div>
//                     )}
//                   </div>
//                 ) : (
//                   /* ── Text/Document/Quiz/etc: full lesson content ─── */
//                   <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                     <div className={`px-6 py-4 border-b border-gray-50 flex items-center gap-3 ${lessonMeta.bgColor}`}>
//                       <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
//                         <lessonMeta.Icon className={`w-4 h-4 ${lessonMeta.color}`} />
//                       </div>
//                       <div>
//                         <p className="font-semibold text-gray-900 text-sm">{lessonMeta.label}</p>
//                         <p className="text-xs text-gray-500">
//                           {hasHtmlContent(currentLessonData.contentHtml)
//                             ? `~${readTimeMinutes(currentLessonData.contentHtml)} min read`
//                             : 'Study material below'}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="p-6 md:p-8">
//                       <LessonContent
//                         lesson={currentLessonData}
//                         module={currentModuleData}
//                         courseResources={courseResources}
//                         onViewFile={(resource, index) => {
//                           setSelectedFile(resource)
//                           setCurrentFileIndex(index)
//                           setShowFileViewer(true)
//                         }}
//                       />
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* ── NOTES ────────────────────────────────────────────────── */}
//             {activeTab === 'notes' && (
//               <div className="space-y-4">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
//                     <p className="text-xs text-gray-400 mt-0.5">
//                       Notes are saved per lesson and persist forever — even after refresh or closing the browser.
//                     </p>
//                   </div>
//                   <div className="flex items-center gap-3">
//                     {notesSaveStatus === 'saving' && (
//                       <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
//                         <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
//                         Saving…
//                       </span>
//                     )}
//                     {notesSaveStatus === 'saved' && (
//                       <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
//                         <Save size={12} /> Saved
//                       </span>
//                     )}
//                     <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                       {notes.split(/\s+/).filter(Boolean).length} words
//                     </span>
//                   </div>
//                 </div>

//                 {/* Lesson selector hint */}
//                 <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm">
//                   <BookMarked className="w-4 h-4 text-indigo-500 flex-shrink-0" />
//                   <span className="text-indigo-700">
//                     Showing notes for: <strong>{currentLessonData?.title}</strong>
//                   </span>
//                 </div>

//                 <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
//                   {/* Mini toolbar */}
//                   <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
//                     {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, i) => (
//                       <button key={i}
//                         className="cursor-pointer p-1.5 rounded hover:bg-gray-200 transition text-gray-500 hover:text-gray-800"
//                         title="Tip: These buttons are visual hints — just type your notes freely below">
//                         <Icon size={14} />
//                       </button>
//                     ))}
//                     <div className="flex-1" />
//                     <span className="text-[10px] text-gray-300 font-medium pr-1">Auto-saved to browser storage</span>
//                   </div>

//                   {/* Textarea */}
//                   <textarea
//                     value={notes}
//                     onChange={e => handleNotesChange(e.target.value)}
//                     placeholder={"Start typing your notes for this lesson…\n\n• Key concepts\n• Questions to review later\n• Insights and observations\n\nNotes are saved automatically and persist forever, even after refresh."}
//                     className="w-full min-h-[460px] p-5 bg-white text-gray-800 placeholder-gray-300 focus:outline-none text-[15px] leading-relaxed resize-y font-sans"
//                   />

//                   {/* Footer */}
//                   <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/60">
//                     <div className="flex items-center gap-2 text-xs text-gray-400">
//                       <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
//                       Stored in IndexedDB — survives refresh, cache clear, and browser restart
//                     </div>
//                     <span className="text-xs text-gray-400">{notes.length} chars</span>
//                   </div>
//                 </div>
//               </div>
//             )}

//             {/* ── RESOURCES ────────────────────────────────────────────── */}
//             {activeTab === 'resources' && (
//               <div className="space-y-6">
//                 <h3 className="text-lg font-bold text-foreground">Course Resources</h3>

//                 {/* ── COURSE-LEVEL MATERIALS (from course creation) ──────────── */}
//                 {courseData?.materials_url && (
//                   <CourseMaterialsCard
//                     url={courseData.materials_url}
//                     courseTitle={courseData.title || 'Course Materials'}
//                   />
//                 )}

//                 {courseResources.length > 0 ? (
//                   <>
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//                       {[
//                         { label: 'Total Files',   value: courseResources.length, bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-500' },
//                         { label: 'PDFs',          value: pdfResources.length,    bg: 'bg-green-50',  text: 'text-green-700',  sub: 'text-green-500' },
//                         { label: 'Other',         value: otherResources.length,  bg: 'bg-violet-50', text: 'text-violet-700', sub: 'text-violet-500' },
//                         { label: 'Modules',       value: new Set(courseResources.map(r => r.moduleTitle)).size, bg: 'bg-amber-50', text: 'text-amber-700', sub: 'text-amber-500' },
//                       ].map(s => (
//                         <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
//                           <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
//                           <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Desktop table */}
//                     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hidden md:block overflow-hidden">
//                       <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
//                         <span className="font-semibold text-sm text-gray-900">All Resources</span>
//                         <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
//                           {courseResources.length} files
//                         </span>
//                       </div>
//                       <table className="w-full">
//                         <thead>
//                           <tr className="bg-gray-50">
//                             {['File', 'Type', 'Source', 'Size', 'Actions'].map(h => (
//                               <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
//                                 {h}
//                               </th>
//                             ))}
//                           </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-50">
//                           {courseResources.map((resource, idx) => (
//                             <tr key={resource.id} className="hover:bg-gray-50/60 transition-colors">
//                               <td className="py-3 px-4">
//                                 <div className="flex items-center gap-2.5">
//                                   <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">{getFileIcon(resource.type)}</div>
//                                   <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{resource.name}</span>
//                                 </div>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resource.type}</span>
//                               </td>
//                               <td className="py-3 px-4">
//                                 <p className="text-sm text-gray-600 truncate max-w-[160px]">{resource.lessonTitle}</p>
//                                 <p className="text-xs text-gray-400">{resource.moduleTitle}</p>
//                               </td>
//                               <td className="py-3 px-4 text-sm text-gray-500">
//                                 {resource.size ? formatFileSize(resource.size) : '—'}
//                               </td>
//                               <td className="py-3 px-4">
//                                 <div className="flex gap-1.5">
//                                   <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                     className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
//                                     <Eye size={11} /> View
//                                   </button>
//                                   <a href={resource.url} download={resource.name}
//                                     className="inline-flex items-center gap-1 text-green-700 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
//                                     <Download size={11} /> Download
//                                   </a>
//                                 </div>
//                               </td>
//                             </tr>
//                           ))}
//                         </tbody>
//                       </table>
//                     </div>

//                     {/* Mobile cards */}
//                     <div className="md:hidden space-y-2.5">
//                       {courseResources.map((resource, idx) => (
//                         <div key={resource.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
//                           <div className="flex items-start gap-3">
//                             <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{getFileIcon(resource.type)}</div>
//                             <div className="flex-1 min-w-0">
//                               <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
//                               <p className="text-xs text-gray-400 mt-0.5">{resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}</p>
//                               <div className="flex gap-2 mt-2.5">
//                                 <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
//                                   className="cursor-pointer text-xs text-indigo-600 font-medium px-2.5 py-1.5 bg-indigo-50 rounded-lg">View</button>
//                                 <a href={resource.url} download={resource.name}
//                                   className="text-xs text-green-700 font-medium px-2.5 py-1.5 bg-green-50 rounded-lg">Download</a>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex flex-wrap gap-3 pt-2">
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Bulk download will be available in a future update.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
//                         <Archive className="w-4 h-4" /> Download All as ZIP
//                       </button>
//                       <button
//                         onClick={() => toast({ title: 'Coming Soon', description: 'Print resources feature coming soon.' })}
//                         className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
//                         <Printer className="w-4 h-4" /> Print All
//                       </button>
//                     </div>
//                   </>
//                 ) : (
//                   !courseData?.materials_url && (
//                     <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
//                       <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
//                       <h4 className="font-semibold text-gray-700 mb-1">No Resources Yet</h4>
//                       <p className="text-sm text-gray-400">The instructor hasn't added any downloadable resources yet.</p>
//                     </div>
//                   )
//                 )}
//               </div>
//             )}

//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="bg-white border-t border-border px-4 md:px-8 py-5 flex-shrink-0">
//           <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-3 flex-col md:flex-row">
//             <button
//               onClick={goToPreviousLesson}
//               disabled={currentModule === 0 && currentLesson === 0}
//               className="cursor-pointer px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition disabled:opacity-40 font-semibold text-sm"
//             >
//               ← Previous Lesson
//             </button>
//             <button
//               onClick={goToNextLesson}
//               disabled={
//                 currentModule === curriculumData.length - 1 &&
//                 currentLesson === curriculumData[currentModule]?.lessons.length - 1
//               }
//               className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 font-semibold text-sm"
//             >
//               Next Lesson →
//             </button>
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }






























'use client'
// /src/components/courses/course-learning.tsx
//
// Key corrections vs previous version:
// ─ lesson_type (not content_type) determines the lesson medium
//   Values: 'video'|'text'|'document'|'quiz'|'assignment'|
//           'live_session'|'audio'|'interactive'|'code'|'discussion'
// ─ content_type is 'free'|'premium'|'trial' — access control only
// ─ content_html is the real WYSIWYG field name
// ─ Video viewport only renders when lesson has a real video_url
// ─ All lesson types get appropriate content displays
// ─ Module learning_objectives and key_concepts displayed
// ─ audio lessons get audio player
// ─ recommended_readings displayed for text/document lessons

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  ChevronDown, ChevronUp, Bookmark, CheckCircle2, BookOpen,
  Bold, Italic, Underline, List, ListOrdered, Link as LinkIcon,
  LayoutDashboard, Menu, X, Clock, FileText, Video, Download,
  Eye, Archive, Printer, ExternalLink, BookMarked, AlignLeft,
  GraduationCap, Lightbulb, Hash, Music, Code2, MessageSquare,
  Calendar, Puzzle, ClipboardList, ChevronRight, Save, Package,
} from 'lucide-react'
import { toast } from '@/hooks/use-toast'
import FileViewer from '@/components/courses/file-viewer'

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatFileSize = (bytes: number | null): string => {
  if (!bytes) return 'Unknown size'
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 Bytes'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i]
}

const getFileIcon = (type: string) => {
  const t = type.toLowerCase()
  if (t.includes('pdf'))    return '📄'
  if (t.includes('word') || t.includes('doc'))  return '📝'
  if (t.includes('excel') || t.includes('sheet') || t.includes('csv')) return '📊'
  if (t.includes('powerpoint') || t.includes('presentation')) return '📈'
  if (t.includes('image'))  return '🖼️'
  if (t.includes('video'))  return '🎬'
  if (t.includes('audio'))  return '🎵'
  if (t.includes('zip') || t.includes('archive') || t.includes('rar')) return '🗜️'
  if (t.includes('code') || t.includes('json') || t.includes('xml'))   return '💻'
  return '📁'
}

const hasHtmlContent = (html: string | null | undefined): boolean => {
  if (!html) return false
  return html.replace(/<[^>]*>/g, '').trim().length > 0
}

// Approximate read time in minutes
const readTimeMinutes = (html: string | null | undefined): number => {
  if (!html) return 1
  const words = html.replace(/<[^>]*>/g, '').trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 200))
}

// ─── Types ────────────────────────────────────────────────────────────────────
// These match exactly what learn-page.tsx pushes into curriculumData

type LessonType =
  | 'video' | 'text' | 'document' | 'quiz' | 'assignment'
  | 'live_session' | 'audio' | 'interactive' | 'code' | 'discussion'

interface Lesson {
  id:           string
  title:        string
  description?: string | null
  lessonType:   LessonType   // the actual medium — THIS is what we branch on
  contentType:  string       // 'free'|'premium'|'trial' — access control only
  difficulty?:  string | null
  // ── Rich text body ────────────────────────────────────────────────────
  contentHtml?: string | null
  // ── Video ─────────────────────────────────────────────────────────────
  videoUrl?:       string | null
  videoDuration?:  number
  videoThumbnail?: string | null
  // ── Audio ─────────────────────────────────────────────────────────────
  audioUrl?:      string | null
  audioDuration?: number
  // ── Document ──────────────────────────────────────────────────────────
  documentUrl?:  string | null
  documentType?: string | null
  documentSize?: number | null
  // ── Supplementary ─────────────────────────────────────────────────────
  externalLinks?:            any
  downloadableResources?:    string[]
  attachedFiles?:            string[]
  recommendedReadings?:      string[]
  hasDownloadableResources?: boolean
  // ── Display ───────────────────────────────────────────────────────────
  duration:  number
  order:     number
  isPreview: boolean
  // ── Progress (merged in by getCurrentLessonData) ───────────────────────
  watched?:    number
  completed?:  boolean
}

interface Module {
  id:                 string
  title:              string
  description?:       string | null
  order:              number
  learningObjectives: string[]
  keyConcepts:        string[]
  lessons:            Lesson[]
}

interface UserProgress {
  [lessonId: string]: {
    completed:      boolean
    progress:       number
    timeSpent:      number
    lastPosition:   number
    lastAccessedAt: string | null
  }
}

interface CourseResource {
  id:           string
  name:         string
  url:          string
  type:         string
  size:         number | null
  lessonTitle:  string
  moduleTitle:  string
  isPdf?:       boolean
}

interface CourseLearningProps {
  courseId:             string
  courseData:           any
  curriculumData:       Module[]
  enrollmentData?:      any
  userId:               string
  initialUserProgress?: UserProgress
  courseResources?:     CourseResource[]
}

// ─── Lesson type metadata ────────────────────────────────────────────────────

const LESSON_TYPE_META: Record<LessonType, { label: string; color: string; bgColor: string; Icon: any }> = {
  video:        { label: 'Video Lesson',       color: 'text-blue-600',   bgColor: 'bg-blue-50',   Icon: Video },
  audio:        { label: 'Audio Lesson',        color: 'text-violet-600', bgColor: 'bg-violet-50', Icon: Music },
  text:         { label: 'Reading',             color: 'text-indigo-600', bgColor: 'bg-indigo-50', Icon: BookMarked },
  document:     { label: 'Document',            color: 'text-amber-600',  bgColor: 'bg-amber-50',  Icon: FileText },
  quiz:         { label: 'Quiz',                color: 'text-orange-600', bgColor: 'bg-orange-50', Icon: ClipboardList },
  assignment:   { label: 'Assignment',          color: 'text-rose-600',   bgColor: 'bg-rose-50',   Icon: ClipboardList },
  live_session: { label: 'Live Session',        color: 'text-green-600',  bgColor: 'bg-green-50',  Icon: Calendar },
  interactive:  { label: 'Interactive Lesson',  color: 'text-cyan-600',   bgColor: 'bg-cyan-50',   Icon: Puzzle },
  code:         { label: 'Code Exercise',       color: 'text-slate-600',  bgColor: 'bg-slate-50',  Icon: Code2 },
  discussion:   { label: 'Discussion',          color: 'text-teal-600',   bgColor: 'bg-teal-50',   Icon: MessageSquare },
}

// ─── LessonContent ────────────────────────────────────────────────────────────
// Renders the body for non-video lessons (text, document, audio, code, etc.)

interface LessonContentProps {
  lesson:          Lesson
  module:          Module
  courseResources: CourseResource[]
  onViewFile:      (resource: CourseResource, index: number) => void
}

function LessonContent({ lesson, module, courseResources, onViewFile }: LessonContentProps) {
  const meta         = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
  const hasContent   = hasHtmlContent(lesson.contentHtml)
  const hasDocument  = Boolean(lesson.documentUrl)
  const hasExtLinks  = Array.isArray(lesson.externalLinks) && lesson.externalLinks.length > 0
  const hasReadings  = Array.isArray(lesson.recommendedReadings) && lesson.recommendedReadings.length > 0
  const lessonFiles  = courseResources.filter(r => r.lessonTitle === lesson.title)
  const hasFiles     = lessonFiles.length > 0
  const hasModuleObjectives = module.learningObjectives?.length > 0
  const hasModuleKeyConcepts = module.keyConcepts?.length > 0
  const [docExpanded, setDocExpanded] = useState(true)

  // Inject CSS into <head> once — guarantees styles survive SSR/hydration
  useEffect(() => {
    const id = 'axioquan-lesson-body-styles'
    if (document.getElementById(id)) return
    const tag = document.createElement('style')
    tag.id = id
    tag.textContent = `
      .lesson-body{color:#374151;font-size:15px;line-height:1.8;word-break:break-word}
      .lesson-body *{box-sizing:border-box}

      /* ── Paragraphs ── */
      .lesson-body p{margin:0 0 1.4em 0 !important;line-height:1.85 !important;color:#374151}
      .lesson-body p:last-child{margin-bottom:0 !important}

      /* ── Headings ── */
      .lesson-body h1,.lesson-body h2,.lesson-body h3,
      .lesson-body h4,.lesson-body h5,.lesson-body h6{
        font-weight:700;color:#111827;letter-spacing:-0.02em;
        line-height:1.3;margin:2em 0 0.65em 0 !important}
      .lesson-body h1{font-size:1.8rem}
      .lesson-body h2{font-size:1.4rem;border-bottom:2px solid #f3f4f6;padding-bottom:0.4em}
      .lesson-body h3{font-size:1.18rem;color:#1f2937}
      .lesson-body h4{font-size:1.05rem;color:#374151}
      .lesson-body h5,.lesson-body h6{font-size:1rem;color:#4b5563}
      .lesson-body h1:first-child,.lesson-body h2:first-child,
      .lesson-body h3:first-child{margin-top:0 !important}

      /* ── Lists ── */
      .lesson-body ul,.lesson-body ol{padding-left:1.7em;margin:0 0 1.4em 0 !important}
      .lesson-body ul{list-style-type:disc}
      .lesson-body ol{list-style-type:decimal}
      .lesson-body li{margin-bottom:0.5em !important;line-height:1.75;color:#374151;display:list-item}
      .lesson-body li::marker{color:#6366f1}
      .lesson-body li>p{margin-bottom:0.35em !important}
      .lesson-body ul ul,.lesson-body ol ol,
      .lesson-body ul ol,.lesson-body ol ul{margin:0.4em 0 0.4em 0 !important}

      /* ── Inline code ── */
      .lesson-body code{background:#f3f4f6;color:#e11d48;
        font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
        font-size:0.875em;padding:0.15em 0.45em;border-radius:5px;
        border:1px solid #e5e7eb}
      .lesson-body code::before,.lesson-body code::after{content:none !important}

      /* ── Code blocks ── */
      .lesson-body pre{background:#1e293b;color:#e2e8f0;
        font-family:ui-monospace,SFMono-Regular,Menlo,monospace;
        font-size:0.875em;line-height:1.65;padding:1.25em 1.5em;
        border-radius:12px;overflow-x:auto;margin:0 0 1.5em 0 !important;
        border:1px solid #334155}
      .lesson-body pre code{background:none;color:inherit;padding:0;
        border:none;border-radius:0;font-size:1em}

      /* ── Blockquote ── */
      .lesson-body blockquote{border-left:4px solid #6366f1;background:#eef2ff;
        margin:1.5em 0 !important;padding:1em 1.25em;
        border-radius:0 10px 10px 0;color:#4338ca;font-style:normal}
      .lesson-body blockquote p{margin-bottom:0 !important;color:#4338ca}

      /* ── Links ── */
      .lesson-body a{color:#4f46e5;font-weight:500;text-decoration:none;
        border-bottom:1px solid #c7d2fe;transition:color .15s,border-color .15s}
      .lesson-body a:hover{color:#3730a3;border-bottom-color:#6366f1}

      /* ── Inline styling ── */
      .lesson-body strong,.lesson-body b{font-weight:700;color:#111827}
      .lesson-body em,.lesson-body i{font-style:italic}
      .lesson-body u{text-decoration:underline;text-underline-offset:3px}
      .lesson-body s,.lesson-body del{text-decoration:line-through;color:#9ca3af}
      .lesson-body mark{background:#fef9c3;padding:0.1em 0.25em;border-radius:3px}
      .lesson-body sub{vertical-align:sub;font-size:0.8em}
      .lesson-body sup{vertical-align:super;font-size:0.8em}

      /* ── HR ── */
      .lesson-body hr{border:none;border-top:2px solid #f3f4f6;margin:2em 0 !important}

      /* ── Images ── */
      .lesson-body img{max-width:100%;height:auto;border-radius:10px;
        box-shadow:0 4px 16px rgba(0,0,0,.08);margin:1.25em auto !important;display:block}

      /* ── Tables ── */
      .lesson-body table{width:100%;border-collapse:collapse;font-size:0.9em;
        margin:0 0 1.5em 0 !important;border-radius:10px;overflow:hidden;
        border:1px solid #e5e7eb}
      .lesson-body thead{background:#f9fafb}
      .lesson-body th{padding:0.65em 1em;text-align:left;font-weight:600;
        color:#374151;font-size:0.8em;text-transform:uppercase;
        letter-spacing:0.05em;border-bottom:2px solid #e5e7eb}
      .lesson-body td{padding:0.6em 1em;color:#374151;
        border-bottom:1px solid #f3f4f6;vertical-align:top}
      .lesson-body tbody tr:last-child td{border-bottom:none}
      .lesson-body tbody tr:hover{background:#f9fafb}

      /* ── Dividers / spacers that WYSIWYG editors output ── */
      .lesson-body div{margin-bottom:0}
      .lesson-body br+br{display:block;margin:0.8em 0;content:""}

      /* ── Iframes ── */
      .lesson-body iframe{width:100%;border-radius:10px;
        margin:1.25em 0 !important;border:none}
    `
    document.head.appendChild(tag)
    return () => { /* keep styles across lesson switches */ }
  }, [])

  const nothing = !hasContent && !hasDocument && !hasExtLinks && !hasReadings && !hasFiles

  if (nothing) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className={`w-16 h-16 rounded-2xl ${meta.bgColor} flex items-center justify-center mb-4`}>
          <meta.Icon className={`w-8 h-8 ${meta.color}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-700 mb-1">No content yet</h3>
        <p className="text-sm text-gray-400 max-w-sm">
          The instructor hasn't added content for this lesson. Check back later or explore the Resources tab.
        </p>
      </div>
    )
  }

  // Detect if document is a PDF (can be embedded inline)
  const isPdf = lesson.documentType?.toLowerCase().includes('pdf')
    || lesson.documentUrl?.toLowerCase().endsWith('.pdf')

  return (
    <div className="space-y-10">

      {/* ── RICH HTML BODY ────────────────────────────────────────────────── */}
      {hasContent && (
        <section>
          <div className="flex items-center gap-2 mb-5 pb-4 border-b border-gray-100">
            <AlignLeft className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-500">Lesson Content</span>
            <span className="ml-auto text-xs text-gray-400">~{readTimeMinutes(lesson.contentHtml)} min read</span>
          </div>
          {/* lesson-body styles are injected into <head> via useEffect above */}
          <div
            className="lesson-body"
            dangerouslySetInnerHTML={{ __html: lesson.contentHtml! }}
          />
        </section>
      )}

      {/* ── DOCUMENT VIEWER (document_url) ───────────────────────────────── */}
      {hasDocument && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <FileText className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-amber-500">
              Attached Document
            </span>
            {lesson.documentSize && (
              <span className="text-xs text-gray-400 ml-auto">{formatFileSize(lesson.documentSize)}</span>
            )}
          </div>

          {/* Document action bar */}
          {(() => {
            // Build proxy URLs for this lesson's document — raw URL passed as-is
            const docFilename = lesson.documentUrl!.split('/').pop()?.split('?')[0] ?? 'document'
            const docExt      = docFilename.split('.').pop()?.toLowerCase() ?? ''
            const docIsPdf    = docExt === 'pdf'
            const docIsOffice = ['doc','docx','ppt','pptx','xls','xlsx'].includes(docExt)
            const docInline   = proxyUrl(lesson.documentUrl!, 'inline',   docFilename)
            const docDownload = proxyUrl(lesson.documentUrl!, 'download', docFilename)
            const docViewer   = docIsPdf
              ? docInline
              : docIsOffice
                ? `https://docs.google.com/viewer?url=${encodeURIComponent(docInline)}&embedded=true`
                : docInline
            return (
              <>
                <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl mb-3">
                  <div className="w-11 h-11 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-xl">
                    {docIsPdf ? '📄' : '📎'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{lesson.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {lesson.documentType || 'Document'}
                      {lesson.documentSize ? ` · ${formatFileSize(lesson.documentSize)}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Toggle inline view */}
                    <button
                      onClick={() => setDocExpanded(v => !v)}
                      className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {docExpanded ? 'Collapse' : 'View'}
                    </button>
                    {/* Open in new tab — via proxy for correct headers */}
                    <a
                      href={docInline}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Open
                    </a>
                    {/* Download — via proxy with Content-Disposition: attachment */}
                    <a
                      href={docDownload}
                      className="inline-flex items-center gap-1.5 px-3 py-2 text-sm font-medium rounded-lg bg-green-600 text-white hover:bg-green-700 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Download
                    </a>
                  </div>
                </div>

                {/* Inline viewer */}
                {docExpanded && (
                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-gray-50">
                    <iframe
                      src={docViewer}
                      className="w-full"
                      style={{ height: '75vh', minHeight: '500px', border: 'none' }}
                      title={lesson.title}
                    />
                    <div className="px-4 py-2.5 bg-white border-t border-gray-100 flex items-center justify-between">
                      <p className="text-xs text-gray-400">
                        If the document doesn't load,{' '}
                        <a href={docInline} target="_blank" rel="noopener noreferrer"
                          className="text-indigo-600 font-medium hover:underline">
                          open it in a new tab
                        </a>
                      </p>
                      <a href={docDownload}
                        className="inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-900">
                        <Download className="w-3 h-3" /> Download
                      </a>
                    </div>
                  </div>
                )}
              </>
            )
          })()}
        </section>
      )}

      {/* ── LESSON FILES (from courseResources, filtered by lessonTitle) ──── */}
      {hasFiles && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Archive className="w-4 h-4 text-violet-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-violet-500">Lesson Files</span>
            <span className="ml-auto text-xs text-gray-400">
              {lessonFiles.length} file{lessonFiles.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="grid gap-2.5">
            {lessonFiles.map((resource) => {
              const globalIdx = courseResources.findIndex(r => r.id === resource.id)
              return (
                <div
                  key={resource.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-100 rounded-xl hover:bg-white hover:border-gray-200 transition-all"
                >
                  <div className="w-9 h-9 bg-white border border-gray-200 rounded-lg flex items-center justify-center flex-shrink-0 text-base shadow-sm">
                    {getFileIcon(resource.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{resource.name}</p>
                    <p className="text-xs text-gray-400">
                      {resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}
                    </p>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => onViewFile(resource, globalIdx)}
                      className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> View
                    </button>
                    <a
                      href={proxyUrl(resource.url, 'download', resource.name)}
                      className="inline-flex items-center gap-1 text-green-700 hover:text-green-900 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors"
                    >
                      <Download className="w-3 h-3" /> Save
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      )}

      {/* ── RECOMMENDED READINGS (recommended_readings string[]) ─────────── */}
      {hasReadings && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <BookOpen className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-emerald-500">
              Recommended Readings
            </span>
          </div>
          <ul className="space-y-2">
            {lesson.recommendedReadings!.map((reading, i) => (
              <li key={i} className="flex items-start gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="w-6 h-6 bg-emerald-100 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-bold text-emerald-600">{i + 1}</span>
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{reading}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── EXTERNAL LINKS (external_links JSONB) ────────────────────────── */}
      {hasExtLinks && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <ExternalLink className="w-4 h-4 text-sky-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-sky-500">
              References & Links
            </span>
          </div>
          <ul className="space-y-2">
            {(lesson.externalLinks as any[]).map((link: any, i: number) => {
              const href  = typeof link === 'string' ? link : (link.url || '#')
              const label = typeof link === 'string' ? link : (link.name || link.title || link.url || href)
              return (
                <li key={i}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-sky-50 hover:bg-sky-100 hover:border-sky-200 transition-all"
                  >
                    <div className="w-7 h-7 bg-white rounded-lg flex items-center justify-center flex-shrink-0 border border-sky-100">
                      <Hash className="w-3.5 h-3.5 text-sky-500" />
                    </div>
                    <span className="flex-1 text-sm text-sky-700 group-hover:text-sky-900 font-medium truncate">
                      {label}
                    </span>
                    <ExternalLink className="w-3.5 h-3.5 text-sky-400 group-hover:text-sky-600 flex-shrink-0" />
                  </a>
                </li>
              )
            })}
          </ul>
        </section>
      )}

      {/* ── MODULE KEY CONCEPTS (module.keyConcepts string[]) ────────────── */}
      {hasModuleKeyConcepts && (
        <section>
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-100">
            <Lightbulb className="w-4 h-4 text-yellow-500 flex-shrink-0" />
            <span className="text-xs font-semibold uppercase tracking-widest text-yellow-600">Key Concepts</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {module.keyConcepts.map((concept, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 flex-shrink-0" />
                {concept}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

// ─── URL helpers ─────────────────────────────────────────────────────────────
// Fix duplicated Cloudinary path segments:
//   /axioquan/documents/axioquan/documents/FILE.pdf → /axioquan/documents/FILE.pdf
// Route file through /api/proxy/document to bypass CORS/X-Frame restrictions.
// We pass the raw stored URL exactly as-is — Cloudinary stores files at whatever
// public_id was generated at upload time (including any double-path quirks).
function proxyUrl(raw: string, mode: 'inline' | 'download', filename?: string): string {
  // Extract filename from the last path segment of the raw URL
  const fn = filename ?? raw.split('/').pop()?.split('?')[0] ?? 'document'
  return `/api/proxy/document?url=${encodeURIComponent(raw)}&mode=${mode}&filename=${encodeURIComponent(fn)}`
}

// ─── CourseMaterialsCard ──────────────────────────────────────────────────────
function CourseMaterialsCard({ url, courseTitle }: { url: string; courseTitle: string }) {
  const [expanded,    setExpanded]    = useState(false)
  const [iframeError, setIframeError] = useState(false)
  const [loading,     setLoading]     = useState(false)

  // Derive metadata from raw stored URL exactly — don't clean/transform it
  const filename         = url.split('/').pop()?.split('?')[0] ?? 'course-materials'
  const ext              = filename.split('.').pop()?.toLowerCase() ?? ''
  const isPdf            = ext === 'pdf'
  const isOffice         = ['doc','docx','ppt','pptx','xls','xlsx'].includes(ext)
  const isImage          = ['png','jpg','jpeg','gif','webp','svg'].includes(ext)

  const typeLabel = isPdf ? 'PDF Document'
    : isOffice ? `${ext.toUpperCase()} File`
    : isImage  ? 'Image File'
    : 'Course Document'

  const emoji = isPdf ? '📄'
    : ['doc','docx'].includes(ext) ? '📝'
    : ['ppt','pptx'].includes(ext) ? '📊'
    : ['xls','xlsx'].includes(ext) ? '📈'
    : isImage ? '🖼️'
    : '📎'

  // Build proxy URLs — raw URL passed as-is, proxy fetches from Cloudinary directly
  const inlineProxyUrl   = proxyUrl(url, 'inline',   filename)
  const downloadProxyUrl = proxyUrl(url, 'download', filename)

  // For office files, let Google Docs Viewer render them (it can use our proxied URL)
  const viewerSrc = isPdf || isImage
    ? inlineProxyUrl
    : `https://docs.google.com/viewer?url=${encodeURIComponent(inlineProxyUrl)}&embedded=true`

  const handleViewClick = () => {
    setIframeError(false)
    setLoading(true)
    setExpanded(v => !v)
  }

  return (
    <div className="rounded-2xl border-2 border-indigo-100 bg-gradient-to-br from-indigo-50 to-white shadow-sm overflow-hidden">

      {/* Header banner */}
      <div className="flex items-center gap-3 px-5 py-4 bg-indigo-600 text-white">
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0 text-2xl">
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <Package className="w-3.5 h-3.5 text-indigo-200" />
            <span className="text-xs font-semibold uppercase tracking-widest text-indigo-200">
              Course Materials
            </span>
          </div>
          <p className="font-bold text-white text-base leading-snug truncate">
            {courseTitle} — Study Materials
          </p>
          <p className="text-indigo-200 text-xs mt-0.5">
            {typeLabel} · Available for the entire course · {filename}
          </p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex flex-wrap items-center gap-3 px-5 py-4 bg-white border-b border-indigo-50">
        <button
          onClick={handleViewClick}
          className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors"
        >
          <Eye className="w-4 h-4" />
          {expanded ? 'Collapse Viewer' : 'Read / View'}
        </button>
        <a
          href={inlineProxyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium transition-colors"
        >
          <ExternalLink className="w-4 h-4" /> Open in tab
        </a>
        <a
          href={downloadProxyUrl}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-semibold transition-colors ml-auto"
        >
          <Download className="w-4 h-4" /> Download
        </a>
      </div>

      {/* Inline viewer */}
      {expanded && (
        <div className="bg-gray-50">
          {!iframeError ? (
            <>
              {loading && (
                <div className="flex items-center justify-center py-10 bg-white">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 border-[3px] border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-sm text-gray-500">Loading {typeLabel}…</p>
                  </div>
                </div>
              )}
              <iframe
                key={viewerSrc}
                src={viewerSrc}
                className="w-full"
                style={{
                  height: '80vh',
                  minHeight: '540px',
                  border: 'none',
                  display: loading ? 'none' : 'block',
                }}
                title={`${courseTitle} — ${filename}`}
                allow="fullscreen"
                onLoad={() => setLoading(false)}
                onError={() => { setLoading(false); setIframeError(true) }}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white">
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4 text-3xl">{emoji}</div>
              <h4 className="font-bold text-gray-900 mb-1">Preview unavailable</h4>
              <p className="text-sm text-gray-500 mb-6 max-w-sm">
                The document can't be previewed inline. Use one of the options below to read it.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <a href={inlineProxyUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors">
                  <ExternalLink className="w-4 h-4" /> Open in new tab
                </a>
                <a href={downloadProxyUrl}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-green-600 text-white text-sm font-semibold hover:bg-green-700 transition-colors">
                  <Download className="w-4 h-4" /> Download file
                </a>
              </div>
            </div>
          )}

          {!iframeError && !loading && (
            <div className="px-5 py-3 bg-white border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">
                {isPdf ? 'PDF · Use browser controls to zoom, search, or print.'
                  : isOffice ? 'Office document via Google Docs Viewer.'
                  : 'Document viewer'}
              </p>
              <a href={downloadProxyUrl}
                className="inline-flex items-center gap-1 text-xs text-green-700 font-medium hover:text-green-900">
                <Download className="w-3 h-3" /> Save a copy
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function CourseLearningPage({
  courseId,
  courseData,
  curriculumData,
  enrollmentData,
  userId,
  initialUserProgress = {},
  courseResources = [],
}: CourseLearningProps) {
  const [currentModule, setCurrentModule]             = useState(0)
  const [currentLesson, setCurrentLesson]             = useState(0)
  const [expandedModules, setExpandedModules]         = useState<number[]>([0])
  const [isPlaying, setIsPlaying]                     = useState(false)
  const [isMuted, setIsMuted]                         = useState(false)
  const [bookmarkedTimes, setBookmarkedTimes]         = useState<number[]>([])
  const [activeTab, setActiveTab]                     = useState<'overview' | 'notes' | 'resources'>('overview')
  const [notes, setNotes]                             = useState('')
  const [notesSaveStatus, setNotesSaveStatus]         = useState<'idle'|'saving'|'saved'>('idle')
  const notesSaveTimer                                 = useRef<NodeJS.Timeout | null>(null)

  // ── IndexedDB-backed notes (survives all refreshes, no expiry) ─────────────
  // DB: axioquan_notes  |  Store: notes  |  key: `${userId}::${courseId}::${lessonId}`
  const openNotesDB = (): Promise<IDBDatabase> => new Promise((res, rej) => {
    const req = indexedDB.open('axioquan_notes', 1)
    req.onupgradeneeded = () => req.result.createObjectStore('notes')
    req.onsuccess = () => res(req.result)
    req.onerror   = () => rej(req.error)
  })

  const loadNoteFromDB = async (lessonId: string) => {
    try {
      const db  = await openNotesDB()
      const key = `${userId}::${courseId}::${lessonId}`
      const tx  = db.transaction('notes', 'readonly')
      const req = tx.objectStore('notes').get(key)
      req.onsuccess = () => setNotes(req.result ?? '')
    } catch { setNotes('') }
  }

  const saveNoteToDB = async (lessonId: string, text: string) => {
    try {
      setNotesSaveStatus('saving')
      const db  = await openNotesDB()
      const key = `${userId}::${courseId}::${lessonId}`
      const tx  = db.transaction('notes', 'readwrite')
      tx.objectStore('notes').put(text, key)
      tx.oncomplete = () => setNotesSaveStatus('saved')
    } catch { setNotesSaveStatus('idle') }
  }

  const handleNotesChange = (text: string) => {
    setNotes(text)
    setNotesSaveStatus('saving')
    if (notesSaveTimer.current) clearTimeout(notesSaveTimer.current)
    const lessonId = getCurrentLessonData()?.id
    if (!lessonId) return
    notesSaveTimer.current = setTimeout(() => saveNoteToDB(lessonId, text), 600)
  }
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [userProgress, setUserProgress]               = useState<UserProgress>(initialUserProgress)
  const [selectedFile, setSelectedFile]               = useState<CourseResource | null>(null)
  const [showFileViewer, setShowFileViewer]           = useState(false)
  const [currentFileIndex, setCurrentFileIndex]       = useState(0)
  const [videoDuration, setVideoDuration]             = useState(0)
  const [isSaving, setIsSaving]                       = useState(false)

  const currentTimeRef     = useRef(0)
  const [, forceUpdate]    = useState(0)
  const videoRef           = useRef<HTMLVideoElement>(null)
  const audioRef           = useRef<HTMLAudioElement>(null)
  const lastSaveRef        = useRef(0)
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const pdfResources   = courseResources.filter(r => r.type === 'PDF Document')
  const otherResources = courseResources.filter(r => r.type !== 'PDF Document')

  const handleNextFile = () => {
    if (currentFileIndex < courseResources.length - 1) {
      const n = currentFileIndex + 1
      setSelectedFile(courseResources[n]); setCurrentFileIndex(n)
    }
  }
  const handlePrevFile = () => {
    if (currentFileIndex > 0) {
      const p = currentFileIndex - 1
      setSelectedFile(courseResources[p]); setCurrentFileIndex(p)
    }
  }

  useEffect(() => { loadUserProgress() }, [courseId, userId])

  // Load notes for initial lesson on mount
  useEffect(() => {
    const lesson = curriculumData[0]?.lessons[0]
    if (lesson) loadNoteFromDB(lesson.id)
  }, [])

  const loadUserProgress = async () => {
    try {
      const res = await fetch(`/api/student/progress?courseId=${courseId}`)
      if (res.ok) {
        const data = await res.json()
        const t: UserProgress = {}
        if (data.progress && typeof data.progress === 'object') {
          Object.entries(data.progress).forEach(([id, d]: [string, any]) => {
            t[id] = {
              completed:      d.is_completed  || d.completed  || false,
              progress:       d.video_progress || d.progress  || 0,
              timeSpent:      d.time_spent     || 0,
              lastPosition:   d.last_position  || 0,
              lastAccessedAt: d.last_accessed_at || d.last_accessed || null,
            }
          })
        }
        setUserProgress(t)
      } else {
        const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
        if (saved) setUserProgress(JSON.parse(saved))
      }
    } catch {
      const saved = localStorage.getItem(`course-progress-${userId}-${courseId}`)
      if (saved) try { setUserProgress(JSON.parse(saved)) } catch {}
    }
  }

  const saveProgressToDatabase = async (lessonId: string, data: {
    completed?: boolean; progress?: number; timeSpent?: number; lastPosition?: number
  }) => {
    try {
      setIsSaving(true)
      const res = await fetch('/api/student/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId, lessonId, userId, ...data }),
      })
      if (!res.ok) throw new Error('Failed to save')
      return await res.json()
    } catch {
      localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    if (Object.keys(userProgress).length > 0 && userId)
      localStorage.setItem(`course-progress-${userId}-${courseId}`, JSON.stringify(userProgress))
  }, [userProgress, courseId, userId])

  // Auto-save video/audio progress
  useEffect(() => {
    const autoSave = async () => {
      const lesson = getCurrentLessonData()
      if (!lesson) return
      const now = Date.now()
      const currentTime = currentTimeRef.current
      if (now - lastSaveRef.current > 30000 && currentTime > 10) {
        const pct = lesson.duration > 0 ? (currentTime / lesson.duration) * 100 : 0
        await saveProgressToDatabase(lesson.id, {
          progress: pct, timeSpent: Math.floor(currentTime), lastPosition: Math.floor(currentTime),
        })
        lastSaveRef.current = now
      }
    }
    const id = setInterval(autoSave, 10000)
    return () => clearInterval(id)
  }, [courseId, videoDuration])

  const calculateOverallProgress = () => {
    let total = 0, done = 0
    curriculumData.forEach(m => m.lessons.forEach(l => {
      total++
      if (userProgress[l.id]?.completed) done++
    }))
    return total > 0 ? Math.round((done / total) * 100) : 0
  }

  const calculateModuleProgress = (module: Module) => {
    if (!module.lessons.length) return 0
    const done = module.lessons.filter(l => userProgress[l.id]?.completed).length
    return Math.round((done / module.lessons.length) * 100)
  }

  // Fire-and-forget: record lesson_completed in user_activities for streak
const trackActivity = (type: string) => {
  fetch('/api/activity/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ activity_type: type }),
  }).catch(() => {}) // never throw
}

const completeLesson = async (lessonId?: string) => {
  const id = lessonId || getCurrentLessonData()?.id
  if (!id) return
  setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
  await saveProgressToDatabase(id, { completed: true, progress: 100 })
  trackActivity('lesson_completed') // ← ADD THIS LINE
}

  // const completeLesson = async (lessonId?: string) => {
  //   const id = lessonId || getCurrentLessonData()?.id
  //   if (!id) return
  //   setUserProgress(prev => ({ ...prev, [id]: { ...prev[id], completed: true } }))
  //   await saveProgressToDatabase(id, { completed: true, progress: 100 })
  // }

  const goToNextLesson = () => {
    const lesson = getCurrentLessonData()
    if (lesson && !userProgress[lesson.id]?.completed) completeLesson()
    if (currentLesson < curriculumData[currentModule].lessons.length - 1)
      selectLesson(currentModule, currentLesson + 1)
    else if (currentModule < curriculumData.length - 1)
      selectLesson(currentModule + 1, 0)
  }

  const goToPreviousLesson = () => {
    if (currentLesson > 0) selectLesson(currentModule, currentLesson - 1)
    else if (currentModule > 0)
      selectLesson(currentModule - 1, curriculumData[currentModule - 1].lessons.length - 1)
  }

  const toggleModule = (i: number) =>
    setExpandedModules(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])

  const selectLesson = async (modIdx: number, lesIdx: number) => {
    setCurrentModule(modIdx); setCurrentLesson(lesIdx)
    currentTimeRef.current = 0
    setIsPlaying(false); setIsMobileSidebarOpen(false)
    const lesson = curriculumData[modIdx]?.lessons[lesIdx]
    if (lesson) loadNoteFromDB(lesson.id)
    setTimeout(() => {
      if (videoRef.current) { videoRef.current.currentTime = 0; videoRef.current.pause() }
      if (audioRef.current) { audioRef.current.currentTime = 0; audioRef.current.pause() }
      forceUpdate(x => x + 1)
    }, 100)
    if (lesson && !userProgress[lesson.id]?.completed) {
      setUserProgress(prev => ({
        ...prev,
        [lesson.id]: { ...prev[lesson.id], completed: prev[lesson.id]?.completed || false,
          progress: prev[lesson.id]?.progress || 0, timeSpent: prev[lesson.id]?.timeSpent || 0,
          lastPosition: 0, lastAccessedAt: new Date().toISOString() },
      }))
      saveProgressToDatabase(lesson.id, { progress: 0, timeSpent: 0, lastPosition: 0 }).catch(() => {})
    }
  }

  const formatTime = (s: number) =>
    !s || isNaN(s) ? '0:00' : `${Math.floor(s / 60)}:${Math.floor(s % 60).toString().padStart(2, '0')}`

  const getCurrentLessonData = (): Lesson | null => {
    const l = curriculumData[currentModule]?.lessons[currentLesson]
    if (!l) return null
    const p = userProgress[l.id] || {}
    return { ...l, watched: p.timeSpent || 0, completed: p.completed || false }
  }

  const currentLessonData    = getCurrentLessonData()
  const currentModuleData    = curriculumData[currentModule]
  const overallProgress      = calculateOverallProgress()

  // ── Determine what to show ──────────────────────────────────────────────
  // We branch exclusively on lesson_type (the real medium field).
  // video_url being present is the secondary check for video lessons
  // (in case lesson_type is incorrectly set but url exists).
  const lt = currentLessonData?.lessonType
  const isVideoLesson = (lt === 'video') && Boolean(currentLessonData?.videoUrl)
  const isAudioLesson = (lt === 'audio') && Boolean(currentLessonData?.audioUrl)
  // All others render text/document content layout
  const hasMediaPlayer = isVideoLesson || isAudioLesson

  const lessonMeta = lt ? (LESSON_TYPE_META[lt] ?? LESSON_TYPE_META.text) : LESSON_TYPE_META.text

  // ── Per-lesson sidebar icon (uses lesson's own lessonType/urls) ─────────
  const getLessonIcon = (lesson: Lesson, completed?: boolean) => {
    if (completed) return <CheckCircle2 size={15} className="flex-shrink-0 text-green-500" />
    const meta = LESSON_TYPE_META[lesson.lessonType] ?? LESSON_TYPE_META.text
    return <meta.Icon size={14} className={`flex-shrink-0 ${meta.color}`} />
  }

  useEffect(() => () => { if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current) }, [])

  if (!currentLessonData) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-gray-500 text-sm">Loading lesson…</p>
        </div>
      </div>
    )
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Sub-components
  // ─────────────────────────────────────────────────────────────────────────

  const AxioQuanLogo = ({ size = 'default' }: { size?: 'default' | 'small' }) => (
    <a href="/" className={`flex items-center gap-2.5 ${size === 'small' ? 'px-1' : 'px-2'}`}>
      <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
        <span className="text-white font-bold text-sm">A</span>
      </div>
      {size === 'default' && <span className="font-bold text-lg text-foreground">AxioQuan</span>}
    </a>
  )

  const CurriculumList = () => (
    <div className="flex-1 overflow-y-auto p-3 space-y-0.5">
      {curriculumData.map((module, modIdx) => {
        const modProgress = calculateModuleProgress(module)
        return (
          <div key={module.id}>
            <button
              onClick={() => toggleModule(modIdx)}
              className="cursor-pointer w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition group"
            >
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-6 h-6 rounded-md bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <BookOpen size={13} className="text-gray-500" />
                </div>
                <div className="text-left min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{module.title}</p>
                  <p className="text-xs text-muted-foreground">{modProgress}% complete</p>
                </div>
              </div>
              {expandedModules.includes(modIdx)
                ? <ChevronUp size={14} className="text-gray-400 flex-shrink-0" />
                : <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />}
            </button>

            {expandedModules.includes(modIdx) && (
              <div className="ml-3 mt-0.5 space-y-0.5 border-l-2 border-gray-100 pl-3">
                {module.lessons.map((lesson, lesIdx) => {
                  const isActive    = currentModule === modIdx && currentLesson === lesIdx
                  const isDone      = userProgress[lesson.id]?.completed
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(modIdx, lesIdx)}
                      className={`cursor-pointer w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-gray-50 text-foreground'
                      }`}
                    >
                      <span className="flex-shrink-0">{getLessonIcon(lesson, isDone)}</span>
                      <span className="flex-1 text-left text-xs leading-snug line-clamp-2">{lesson.title}</span>
                      {lesson.duration > 0 && !isDone && (
                        <span className={`text-xs flex-shrink-0 flex items-center gap-0.5 ${isActive ? 'text-primary-foreground/70' : 'text-gray-400'}`}>
                          <Clock size={10} />{formatTime(lesson.duration)}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )

  const MobileSidebar = () => (
    <>
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)} />
      )}
      <div className={`fixed top-0 right-0 h-full w-80 bg-white z-50 flex flex-col transform transition-transform duration-300 ease-out md:hidden shadow-2xl
        ${isMobileSidebarOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between mb-3">
            <AxioQuanLogo />
            <button onClick={() => setIsMobileSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
              <X size={18} />
            </button>
          </div>
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
            <LayoutDashboard size={16} className="text-primary" />
            Back to Dashboard
          </Link>
        </div>
        <CurriculumList />
      </div>
    </>
  )

  // ─── RENDER ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-background">
      <MobileSidebar />

      {/* Desktop sidebar */}
      <div className="hidden md:flex w-80 bg-white border-r border-border flex-col fixed left-0 top-0 bottom-0 z-30">
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="mb-3"><AxioQuanLogo /></div>
          <Link href="/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition text-sm font-medium">
            <LayoutDashboard size={16} className="text-primary" />
            Back to Dashboard
          </Link>
        </div>
        <CurriculumList />
      </div>

      {/* Main area */}
      <div className="flex-1 md:ml-80 w-full min-h-screen flex flex-col">

        {/* Mobile top bar */}
        <div className="md:hidden bg-white border-b border-border px-4 py-3 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-3">
            <AxioQuanLogo size="small" />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{currentModuleData?.title}</p>
              <p className="font-semibold text-sm truncate">{currentLessonData.title}</p>
            </div>
          </div>
        </div>

        {/* Floating mobile menu */}
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="cursor-pointer md:hidden fixed bottom-6 right-6 bg-primary text-primary-foreground p-4 rounded-full shadow-2xl z-40"
        >
          <Menu size={22} />
        </button>

        {/* Course header (desktop only) */}
        <div className="hidden md:block bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-0.5">{courseData?.title || 'Course'}</h1>
            {courseData?.short_description && (
              <p className="text-gray-500 text-sm">{courseData.short_description}</p>
            )}
            <p className="text-gray-400 text-xs mt-0.5">Instructor: {courseData?.instructor_name || 'Instructor'}</p>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            VIDEO PLAYER — only when lessonType='video' AND videoUrl exists
        ════════════════════════════════════════════════════════════════ */}
        {isVideoLesson && (
          <div className="bg-white border-b border-gray-100 flex-shrink-0">
            {/* White section with generous padding so the video breathes */}
            <div className="max-w-5xl mx-auto px-6 md:px-12 py-6 md:py-8">
              {/* Dark rounded card — video sits inside with shadow */}
              <div
                className="rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
                style={{ background: '#0f0f0f' }}
              >
                <video
                  key={currentLessonData.videoUrl!}
                  ref={videoRef}
                  className="w-full aspect-video object-contain"
                  controls
                  playsInline
                  poster={currentLessonData.videoThumbnail ?? undefined}
                  onTimeUpdate={() => {
                    if (!videoRef.current) return
                    currentTimeRef.current = videoRef.current.currentTime
                    forceUpdate(x => x + 1)
                  }}
                  onLoadedMetadata={() => {
                    if (videoRef.current) setVideoDuration(videoRef.current.duration)
                  }}
                  onEnded={() => {
                    setIsPlaying(false)
                    const pct = currentLessonData.duration > 0
                      ? (currentTimeRef.current / currentLessonData.duration) * 100
                      : 100
                    if (pct >= 90) completeLesson()
                  }}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                >
                  <source src={currentLessonData.videoUrl!} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
              {isSaving && (
                <p className="text-center text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5">
                  <span className="inline-block w-3 h-3 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
                  Saving progress…
                </p>
              )}
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            AUDIO PLAYER — lessonType='audio' AND audioUrl exists
        ════════════════════════════════════════════════════════════════ */}
        {isAudioLesson && (
          <div className="bg-gradient-to-br from-violet-600 to-indigo-700 flex-shrink-0">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-10">
              <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur rounded-2xl p-6 md:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Music className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-white/70 text-xs font-semibold uppercase tracking-widest mb-0.5">
                      Audio Lesson
                    </p>
                    <h3 className="text-white font-bold text-lg leading-tight">{currentLessonData.title}</h3>
                  </div>
                </div>
                <audio
                  key={currentLessonData.audioUrl!}
                  ref={audioRef}
                  className="w-full"
                  controls
                  onTimeUpdate={() => {
                    if (!audioRef.current) return
                    currentTimeRef.current = audioRef.current.currentTime
                    forceUpdate(x => x + 1)
                  }}
                  onEnded={() => completeLesson()}
                >
                  <source src={currentLessonData.audioUrl!} />
                  Your browser does not support the audio element.
                </audio>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            Progress bar
        ════════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-border px-4 md:px-8 py-3 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-gray-600">Course Progress</span>
              <span className="text-xs font-bold text-primary">{overallProgress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-700"
                style={{ width: `${overallProgress}%` }}
              />
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            Lesson header + Mark Complete
        ════════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-border px-4 md:px-8 py-5 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-start gap-4 justify-between flex-col md:flex-row">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1">
                {currentModuleData?.title}
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight mb-2">
                {currentLessonData.title}
              </h2>
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Lesson type badge */}
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${lessonMeta.bgColor} ${lessonMeta.color}`}>
                  <lessonMeta.Icon size={12} />
                  {lessonMeta.label}
                </span>
                {currentLessonData.difficulty && (
                  <span className="text-xs text-gray-400 capitalize">{currentLessonData.difficulty}</span>
                )}
                {currentLessonData.duration > 0 && (
                  <span className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={11} />{formatTime(currentLessonData.duration)}
                  </span>
                )}
                {isVideoLesson && (
                  <span className="text-xs text-gray-400 flex items-center gap-1">
                    <Video size={11} /> Video
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => completeLesson()}
              disabled={userProgress[currentLessonData.id]?.completed || isSaving}
              className={`flex-shrink-0 w-full md:w-auto px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2 ${
                userProgress[currentLessonData.id]?.completed
                  ? 'bg-green-50 text-green-700 border border-green-200 cursor-not-allowed'
                  : 'bg-primary text-primary-foreground hover:opacity-90 shadow-sm'
              }`}
            >
              {userProgress[currentLessonData.id]?.completed ? (
                <><CheckCircle2 size={16} />Completed</>
              ) : isSaving ? (
                <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />Saving…</>
              ) : (
                'Mark Complete'
              )}
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            Tabs
        ════════════════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-border flex-shrink-0 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 md:px-10 flex gap-0 overflow-x-auto">
            {(['overview', 'notes', 'resources'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`cursor-pointer px-4 py-3.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* File viewer modal */}
        {showFileViewer && selectedFile && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="w-full max-w-6xl h-[90vh]">
              <FileViewer
                file={selectedFile}
                onClose={() => setShowFileViewer(false)}
                onNext={handleNextFile}
                onPrev={handlePrevFile}
                showNavigation={courseResources.length > 1}
              />
            </div>
          </div>
        )}

        {/* ─── Tab content ────────────────────────────────────────────── */}
        <div className="flex-1 bg-gray-50">
          <div className="max-w-4xl mx-auto px-4 md:px-6 py-8 md:py-10">

            {/* ── OVERVIEW ─────────────────────────────────────────────── */}
            {activeTab === 'overview' && (
              <div className="space-y-8">

                {/* Description */}
                {currentLessonData.description && (
                  <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <Lightbulb className="w-4 h-4 text-amber-500" />
                      <h3 className="font-bold text-gray-900 text-sm">About this lesson</h3>
                    </div>
                    <p className="text-gray-600 leading-relaxed text-[15px]">
                      {currentLessonData.description}
                    </p>
                  </div>
                )}

                {/* ─────────────────────────────────────────────────────
                    VIDEO lesson → objectives + bookmarks
                    All other lesson types → full content body
                ───────────────────────────────────────────────────── */}
                {hasMediaPlayer ? (
                  /* ── Video/Audio: objectives + bookmarks ──────────── */
                  <div className="space-y-6">
                    {/* Module learning objectives */}
                    {currentModuleData?.learningObjectives?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <GraduationCap className="w-4 h-4 text-indigo-500" />
                          <h3 className="font-bold text-gray-900 text-sm">Learning Objectives</h3>
                        </div>
                        <ul className="space-y-2.5">
                          {currentModuleData.learningObjectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />
                              <span className="text-gray-600 text-[15px] leading-relaxed">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Module key concepts */}
                    {currentModuleData?.keyConcepts?.length > 0 && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Lightbulb className="w-4 h-4 text-yellow-500" />
                          <h3 className="font-bold text-gray-900 text-sm">Key Concepts</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {currentModuleData.keyConcepts.map((concept, i) => (
                            <span key={i}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-100 text-yellow-800 text-sm rounded-full font-medium">
                              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />{concept}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bookmarks (only relevant for video) */}
                    {isVideoLesson && (
                      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                          <Bookmark className="w-4 h-4 text-blue-500" />
                          <h3 className="font-bold text-gray-900 text-sm">Video Bookmarks</h3>
                        </div>
                        {bookmarkedTimes.length > 0 ? (
                          <div className="space-y-2">
                            {bookmarkedTimes.map((t, i) => (
                              <button
                                key={i}
                                onClick={() => {
                                  currentTimeRef.current = t
                                  if (videoRef.current) videoRef.current.currentTime = t
                                  forceUpdate(x => x + 1)
                                }}
                                className="cursor-pointer w-full text-left px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-blue-50 border border-transparent hover:border-blue-100 transition flex items-center gap-3"
                              >
                                <Bookmark size={13} className="text-blue-400 flex-shrink-0" />
                                <span className="font-mono font-semibold text-sm text-gray-800">{formatTime(t)}</span>
                                <span className="text-xs text-gray-400">Bookmark {i + 1}</span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400 text-center py-3">
                            No bookmarks yet. Use the video player to add them.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  /* ── Text/Document/Quiz/etc: full lesson content ─── */
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className={`px-6 py-4 border-b border-gray-50 flex items-center gap-3 ${lessonMeta.bgColor}`}>
                      <div className="w-8 h-8 bg-white/70 rounded-lg flex items-center justify-center">
                        <lessonMeta.Icon className={`w-4 h-4 ${lessonMeta.color}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{lessonMeta.label}</p>
                        <p className="text-xs text-gray-500">
                          {hasHtmlContent(currentLessonData.contentHtml)
                            ? `~${readTimeMinutes(currentLessonData.contentHtml)} min read`
                            : 'Study material below'}
                        </p>
                      </div>
                    </div>
                    <div className="p-6 md:p-8">
                      <LessonContent
                        lesson={currentLessonData}
                        module={currentModuleData}
                        courseResources={courseResources}
                        onViewFile={(resource, index) => {
                          setSelectedFile(resource)
                          setCurrentFileIndex(index)
                          setShowFileViewer(true)
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── NOTES ────────────────────────────────────────────────── */}
            {activeTab === 'notes' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">Your Notes</h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Notes are saved per lesson and persist forever — even after refresh or closing the browser.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    {notesSaveStatus === 'saving' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-amber-600 font-medium">
                        <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                        Saving…
                      </span>
                    )}
                    {notesSaveStatus === 'saved' && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-green-600 font-medium">
                        <Save size={12} /> Saved
                      </span>
                    )}
                    <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                      {notes.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                </div>

                {/* Lesson selector hint */}
                <div className="flex items-center gap-2 px-4 py-3 bg-indigo-50 border border-indigo-100 rounded-xl text-sm">
                  <BookMarked className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                  <span className="text-indigo-700">
                    Showing notes for: <strong>{currentLessonData?.title}</strong>
                  </span>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Mini toolbar */}
                  <div className="flex items-center gap-1 px-4 py-2.5 border-b border-gray-100 bg-gray-50">
                    {[Bold, Italic, Underline, List, ListOrdered, LinkIcon].map((Icon, i) => (
                      <button key={i}
                        className="cursor-pointer p-1.5 rounded hover:bg-gray-200 transition text-gray-500 hover:text-gray-800"
                        title="Tip: These buttons are visual hints — just type your notes freely below">
                        <Icon size={14} />
                      </button>
                    ))}
                    <div className="flex-1" />
                    <span className="text-[10px] text-gray-300 font-medium pr-1">Auto-saved to browser storage</span>
                  </div>

                  {/* Textarea */}
                  <textarea
                    value={notes}
                    onChange={e => handleNotesChange(e.target.value)}
                    placeholder={"Start typing your notes for this lesson…\n\n• Key concepts\n• Questions to review later\n• Insights and observations\n\nNotes are saved automatically and persist forever, even after refresh."}
                    className="w-full min-h-[460px] p-5 bg-white text-gray-800 placeholder-gray-300 focus:outline-none text-[15px] leading-relaxed resize-y font-sans"
                  />

                  {/* Footer */}
                  <div className="px-5 py-3 border-t border-gray-50 flex items-center justify-between bg-gray-50/60">
                    <div className="flex items-center gap-2 text-xs text-gray-400">
                      <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" />
                      Stored in IndexedDB — survives refresh, cache clear, and browser restart
                    </div>
                    <span className="text-xs text-gray-400">{notes.length} chars</span>
                  </div>
                </div>
              </div>
            )}

            {/* ── RESOURCES ────────────────────────────────────────────── */}
            {activeTab === 'resources' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold text-foreground">Course Resources</h3>

                {/* ── COURSE-LEVEL MATERIALS (from course creation) ──────────── */}
                {courseData?.materials_url && (
                  <CourseMaterialsCard
                    url={courseData.materials_url}
                    courseTitle={courseData.title || 'Course Materials'}
                  />
                )}

                {courseResources.length > 0 ? (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { label: 'Total Files',   value: courseResources.length, bg: 'bg-blue-50',   text: 'text-blue-700',   sub: 'text-blue-500' },
                        { label: 'PDFs',          value: pdfResources.length,    bg: 'bg-green-50',  text: 'text-green-700',  sub: 'text-green-500' },
                        { label: 'Other',         value: otherResources.length,  bg: 'bg-violet-50', text: 'text-violet-700', sub: 'text-violet-500' },
                        { label: 'Modules',       value: new Set(courseResources.map(r => r.moduleTitle)).size, bg: 'bg-amber-50', text: 'text-amber-700', sub: 'text-amber-500' },
                      ].map(s => (
                        <div key={s.label} className={`${s.bg} rounded-xl p-4`}>
                          <div className={`text-2xl font-bold ${s.text}`}>{s.value}</div>
                          <div className={`text-xs mt-0.5 ${s.sub}`}>{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Desktop table */}
                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hidden md:block overflow-hidden">
                      <div className="px-5 py-3.5 border-b border-gray-50 flex items-center justify-between">
                        <span className="font-semibold text-sm text-gray-900">All Resources</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
                          {courseResources.length} files
                        </span>
                      </div>
                      <table className="w-full">
                        <thead>
                          <tr className="bg-gray-50">
                            {['File', 'Type', 'Source', 'Size', 'Actions'].map(h => (
                              <th key={h} className="py-3 px-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {courseResources.map((resource, idx) => (
                            <tr key={resource.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-sm">{getFileIcon(resource.type)}</div>
                                  <span className="font-medium text-gray-900 text-sm truncate max-w-[180px]">{resource.name}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{resource.type}</span>
                              </td>
                              <td className="py-3 px-4">
                                <p className="text-sm text-gray-600 truncate max-w-[160px]">{resource.lessonTitle}</p>
                                <p className="text-xs text-gray-400">{resource.moduleTitle}</p>
                              </td>
                              <td className="py-3 px-4 text-sm text-gray-500">
                                {resource.size ? formatFileSize(resource.size) : '—'}
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex gap-1.5">
                                  <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
                                    className="cursor-pointer inline-flex items-center gap-1 text-indigo-600 text-xs font-medium px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors">
                                    <Eye size={11} /> View
                                  </button>
                                  <a href={resource.url} download={resource.name}
                                    className="inline-flex items-center gap-1 text-green-700 text-xs font-medium px-2.5 py-1.5 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
                                    <Download size={11} /> Download
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Mobile cards */}
                    <div className="md:hidden space-y-2.5">
                      {courseResources.map((resource, idx) => (
                        <div key={resource.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0 text-lg">{getFileIcon(resource.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-900 text-sm truncate">{resource.name}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{resource.type}{resource.size ? ` • ${formatFileSize(resource.size)}` : ''}</p>
                              <div className="flex gap-2 mt-2.5">
                                <button onClick={() => { setSelectedFile(resource); setCurrentFileIndex(idx); setShowFileViewer(true) }}
                                  className="cursor-pointer text-xs text-indigo-600 font-medium px-2.5 py-1.5 bg-indigo-50 rounded-lg">View</button>
                                <a href={resource.url} download={resource.name}
                                  className="text-xs text-green-700 font-medium px-2.5 py-1.5 bg-green-50 rounded-lg">Download</a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={() => toast({ title: 'Coming Soon', description: 'Bulk download will be available in a future update.' })}
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-xl text-sm font-medium transition-colors">
                        <Archive className="w-4 h-4" /> Download All as ZIP
                      </button>
                      <button
                        onClick={() => toast({ title: 'Coming Soon', description: 'Print resources feature coming soon.' })}
                        className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors">
                        <Printer className="w-4 h-4" /> Print All
                      </button>
                    </div>
                  </>
                ) : (
                  !courseData?.materials_url && (
                    <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
                      <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3 text-2xl">📁</div>
                      <h4 className="font-semibold text-gray-700 mb-1">No Resources Yet</h4>
                      <p className="text-sm text-gray-400">The instructor hasn't added any downloadable resources yet.</p>
                    </div>
                  )
                )}
              </div>
            )}

          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white border-t border-border px-4 md:px-8 py-5 flex-shrink-0">
          <div className="max-w-7xl mx-auto px-4 md:px-6 flex gap-3 flex-col md:flex-row">
            <button
              onClick={goToPreviousLesson}
              disabled={currentModule === 0 && currentLesson === 0}
              className="cursor-pointer px-6 py-2.5 rounded-xl border border-border hover:bg-muted transition disabled:opacity-40 font-semibold text-sm"
            >
              ← Previous Lesson
            </button>
            <button
              onClick={goToNextLesson}
              disabled={
                currentModule === curriculumData.length - 1 &&
                currentLesson === curriculumData[currentModule]?.lessons.length - 1
              }
              className="cursor-pointer px-6 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90 transition disabled:opacity-40 font-semibold text-sm"
            >
              Next Lesson →
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
